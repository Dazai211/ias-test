import React, { useState, useEffect } from 'react';
import { auth } from '../library/firebase';
import { updateGameActivity, addGameResult, awardExpAndUnlockTitles, getUserProfile, unlockNextGameLevel } from '../userProfile/firebaseUtils';
import SignQuestCategories from './SignQuestFiles/SignQuestCategories';
import SignQuestGame from './SignQuestFiles/SignQuestGame';
import SignQuestResults from './SignQuestFiles/SignQuestResults';
import SignQuestDetailedResults from './SignQuestFiles/SignQuestDetailedResults';

// ===== PROGRESSIVE GAME SYSTEM =====
// Categories array - defines the order of unlocking
// Users start with only the first category (Alphabet) unlocked
// Each category unlocks after completing the previous one with 80%+ accuracy
const categories = [
  { id: 'alphabet', name: 'Alphabet', icon: '/SVGIcons/Fundamentals/alphabet.svg' },
  { id: 'numbers', name: 'Numbers', icon: '/SVGIcons/Fundamentals/numbers.svg' },
  { id: 'commonQuestions', name: 'Common Questions', icon: '/SVGIcons/Fundamentals/commonQuestions.svg' },
  { id: 'simplePhrases', name: 'Simple Phrases', icon: '/SVGIcons/Fundamentals/simplePhrases.svg' },
  { id: 'greetings', name: 'Greetings', icon: '/SVGIcons/EveryDayWords/greetingsPoliteExpressions.svg' },
  { id: 'daysMonths', name: 'Days & Months', icon: '/SVGIcons/EveryDayWords/daysWeeksMonths.svg' },
  { id: 'colors', name: 'Colors', icon: '/SVGIcons/EveryDayWords/colors.svg' },
  { id: 'family', name: 'Family', icon: '/SVGIcons/EveryDayWords/familyMembers.svg' },
  { id: 'objects', name: 'Objects', icon: '/SVGIcons/EveryDayWords/commonObjects.svg' },
  { id: 'animals', name: 'Animals', icon: '/SVGIcons/EveryDayWords/animals.svg' },
  { id: 'foodDrinks', name: 'Food & Drinks', icon: '/SVGIcons/EveryDayWords/foodDrinks.svg' },
  { id: 'emotions', name: 'Emotions', icon: '/SVGIcons/EveryDayWords/emotions.svg' },
  { id: 'basicActions', name: 'Basic Actions', icon: '/SVGIcons/EveryDayWords/basicActions.svg' },
  { id: 'questionWords', name: 'Question Words', icon: '/SVGIcons/EveryDayWords/questionWords.svg' },
  { id: 'places', name: 'Places', icon: '/SVGIcons/EveryDayWords/places.svg' },
  { id: 'timeWeather', name: 'Time & Weather', icon: '/SVGIcons/EveryDayWords/timeWeather.svg' },
  { id: 'bodyParts', name: 'Body Parts', icon: '/SVGIcons/EveryDayWords/bodyparts.svg' },
  { id: 'transportationDirections', name: 'Transportation', icon: '/SVGIcons/EveryDayWords/transportationDirection.svg' },
  { id: 'pronouns', name: 'Pronouns', icon: '/SVGIcons/AddtionalBasic/pronouns.svg' },
  { id: 'commonVerbs', name: 'Common Verbs', icon: '/SVGIcons/AddtionalBasic/commonVerbs.svg' },
  { id: 'opposites', name: 'Opposites', icon: '/SVGIcons/AddtionalBasic/opposites.svg' },
  { id: 'shapesSizes', name: 'Shapes & Sizes', icon: '/SVGIcons/AddtionalBasic/shapesSizes.svg' },
  { id: 'householdItems', name: 'Household Items', icon: '/SVGIcons/AddtionalBasic/commonHousehold.svg' },
  { id: 'communicationModes', name: 'Communication', icon: '/SVGIcons/AddtionalBasic/communication.svg' },
  { id: 'clothingAccessories', name: 'Clothing', icon: '/SVGIcons/AddtionalBasic/clothingAccesories.svg' },
  { id: 'paymentModes', name: 'Payment', icon: '/SVGIcons/AddtionalBasic/modesOf Payment.svg' },
  { id: 'socialRelationships', name: 'Social', icon: '/SVGIcons/AddtionalBasic/socialRelationship.svg' },
  { id: 'emergencySigns', name: 'Emergency', icon: '/SVGIcons/AddtionalBasic/emergencySigns.svg' },
  { id: 'prepositionsLocations', name: 'Prepositions', icon: '/SVGIcons/AddtionalBasic/preopositionAndlLocations.svg' },
  { id: 'basicCommands', name: 'Commands', icon: '/SVGIcons/AddtionalBasic/basicCommands.svg' },
];

const SignQuest = () => {
  const [currentScreen, setCurrentScreen] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const [detailedResultsData, setDetailedResultsData] = useState(null);
  const [userProgress, setUserProgress] = useState(1); // Current unlocked level (starts at 1 = Alphabet only)
  const [loading, setLoading] = useState(true);

  // Load user progress from Firebase on component mount and auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProgress(profile?.gameProgress?.signQuest || 1);
        } catch (error) {
          console.error('Error loading user progress:', error);
          setUserProgress(1);
        }
      } else {
        setUserProgress(1);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show all categories but mark them as locked/unlocked based on user progress
  // If userProgress = 1, only first category (Alphabet) is unlocked
  // If userProgress = 3, first 3 categories are unlocked, rest are locked
  const allCategories = categories.map((category, index) => ({
    ...category,
    isUnlocked: index < userProgress
  }));

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentScreen('game');
  };

  const handleGameComplete = async (results) => {
    setGameResults(results);
    setCurrentScreen('results');

    // Update game activity in Firebase
    if (auth.currentUser) {
      try {
        await updateGameActivity(auth.currentUser.uid, 'Sign Quest');
        
        // Save simple game result with score
        await addGameResult(auth.currentUser.uid, {
          gameName: 'Sign Quest',
          score: results.score
        });
        await awardExpAndUnlockTitles(auth.currentUser.uid);

        // ===== PROGRESSIVE UNLOCK LOGIC =====
        // Check if user should unlock the next category
        const categoryIndex = categories.findIndex(cat => cat.id === selectedCategory);
        const percentage = (results.score / results.totalQuestions) * 100;
        
        // Unlock conditions:
        // 1. User scored 80% or higher
        // 2. This category is the highest currently unlocked (categoryIndex + 1 === userProgress)
        // 3. There are more categories to unlock (userProgress < categories.length)
        if (percentage >= 80 && categoryIndex + 1 === userProgress && userProgress < categories.length) {
          await unlockNextGameLevel(auth.currentUser.uid, 'signQuest');
          setUserProgress(userProgress + 1); // Update local state immediately for UI feedback
        }
      } catch (error) {
        console.error('Error updating game activity:', error);
      }
    }
  };

  const handleBackToCategories = () => {
    setCurrentScreen('categories');
    setSelectedCategory(null);
    setGameResults(null);
  };

  const handleRestartGame = () => {
    setCurrentScreen('game');
    setGameResults(null);
    setDetailedResultsData(null);
  };

  const handleSignResults = (data) => {
    setDetailedResultsData(data);
    setCurrentScreen('detailedResults');
  };

  const handleBackFromDetailedResults = () => {
    setCurrentScreen('results');
    setDetailedResultsData(null);
  };

  // Render different screens based on current state
  switch (currentScreen) {
    case 'categories':
      return (
        <SignQuestCategories 
          onCategorySelect={handleCategorySelect}
          categories={allCategories} // Pass all categories with locked/unlocked status
          loading={loading}
        />
      );
    
    case 'game':
      return (
        <SignQuestGame 
          category={selectedCategory}
          onGameComplete={handleGameComplete}
          onBackToCategories={handleBackToCategories}
        />
      );
    
    case 'results':
      return (
        <SignQuestResults 
          results={gameResults}
          category={selectedCategory}
          onRestart={handleRestartGame}
          onBackToCategories={handleBackToCategories}
          onSignResults={handleSignResults}
        />
      );

    case 'detailedResults':
      return (
        <SignQuestDetailedResults 
          userAnswers={detailedResultsData.userAnswers}
          quizData={detailedResultsData.quizData}
          category={detailedResultsData.category}
          onBack={handleBackFromDetailedResults}
        />
      );
    
    default:
              return (
          <SignQuestCategories 
            onCategorySelect={handleCategorySelect}
            categories={allCategories}
            loading={loading}
          />
        );
  }
};

export default SignQuest; 