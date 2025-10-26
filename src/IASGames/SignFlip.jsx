import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../library/firebase';
import { updateGameActivity, addGameResult, awardExpAndUnlockTitles, getUserProfile, unlockNextGameLevel } from '../userProfile/firebaseUtils';
import SignFlipSetup from './SignFlipFiles/SignFlipSetup';
import SignFlipDifficulty from './SignFlipFiles/SignFlipDifficulty';
import SignFlipResults from './SignFlipFiles/SignFlipResults';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../library/firebase';

const SignFlip = () => {
  const [currentScreen, setCurrentScreen] = useState('setup'); // 'setup', 'game', 'results'
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [userProgress, setUserProgress] = useState({ easy: 1, normal: 0, hard: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProgress = async () => {
      if (auth.currentUser) {
        try {
          const profile = await getUserProfile(auth.currentUser.uid);
          
          if (profile?.gameProgress?.signFlip) {
            const signFlipProgress = profile.gameProgress.signFlip;
            
            // Handle both old format (number) and new format (object)
            if (typeof signFlipProgress === 'number') {
              // Old format: convert to new format
              const newFormat = { 
                easy: Math.min(signFlipProgress, 5), 
                normal: signFlipProgress > 5 ? Math.min(signFlipProgress - 5, 5) : 0, 
                hard: signFlipProgress > 10 ? Math.min(signFlipProgress - 10, 5) : 0 
              };
              setUserProgress(newFormat);
              
              // Update Firebase to new format
              try {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, {
                  'gameProgress.signFlip': newFormat
                });
              } catch (error) {
                console.error('Error migrating SignFlip progress:', error);
              }
            } else {
              // New format: use as is
              setUserProgress(signFlipProgress);
            }
          } else {
            setUserProgress({ easy: 1, normal: 0, hard: 0 });
          }
        } catch (error) {
          console.error('Error loading user progress:', error);
          setUserProgress({ easy: 1, normal: 0, hard: 0 });
        }
      } else {
        setUserProgress({ easy: 1, normal: 0, hard: 0 });
      }
      setLoading(false);
    };

    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      loadUserProgress();
    });

    // Initial load
    loadUserProgress();

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []); // Remove auth.currentUser dependency since we're using the listener

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentScreen('game');
  };

  const handleGameComplete = async (results) => {
    setGameResults(results);
    setCurrentScreen('results');

    // Update game activity in Firebase
    if (auth.currentUser) {
      try {
        await updateGameActivity(auth.currentUser.uid, 'Sign Flip');
        
        // Save simple game result with score
        await addGameResult(auth.currentUser.uid, {
          gameName: 'Sign Flip',
          score: results.score
        });

        await awardExpAndUnlockTitles(auth.currentUser.uid);

        // Only unlock next level if this was the highest unlocked level and all cards were matched
        
        if (results.completed && currentLevel === userProgress[selectedDifficulty]) {
          await unlockNextGameLevel(auth.currentUser.uid, 'signFlip');
          // Update local state for immediate UI feedback
          setUserProgress(prev => {
            const newProgress = { ...prev };
            if (selectedDifficulty === 'easy' && newProgress.easy < 80) {
              newProgress.easy = newProgress.easy + 1;
            } else if (selectedDifficulty === 'normal' && newProgress.normal < 80) {
              newProgress.normal = newProgress.normal + 1;
            } else if (selectedDifficulty === 'hard' && newProgress.hard < 80) {
              newProgress.hard = newProgress.hard + 1;
            }
            return newProgress;
          });
        }
      } catch (error) {
        console.error('Error updating game activity:', error);
      }
    }
  };

  const handleRestartGame = () => {
    setCurrentScreen('game');
    setGameResults(null);
  };

  const handleNewGame = () => {
    setCurrentScreen('setup');
    setSelectedDifficulty(null);
    setGameResults(null);
    setCurrentLevel(null);
  };

  const handleBackToLevels = () => {
    setCurrentScreen('game');
    setGameResults(null);
    setCurrentLevel(null); // Reset currentLevel to show level selection
  };

  const handleLevelSelect = (level) => {
    setCurrentLevel(level);
    setCurrentScreen('game');
  };

  const handleBackToSetup = () => {
    setCurrentScreen('setup');
    setSelectedDifficulty(null);
    setGameResults(null);
    setCurrentLevel(null);
  };

  const handleBack = () => navigate(-1);

  // Render different screens based on current state
  switch (currentScreen) {
    case 'setup':
      return (
        <SignFlipSetup 
          onDifficultySelect={handleDifficultySelect}
          onBack={handleBack}
          userProgress={userProgress}
          loading={loading}
        />
      );
    
    case 'game':
      return (
        <div className="signflip-game-container">
          <SignFlipDifficulty
            difficulty={selectedDifficulty}
            onGameComplete={handleGameComplete} 
            currentLevel={currentLevel}
            onLevelSelect={handleLevelSelect}
            onBack={handleBackToSetup}
            userProgress={userProgress}
          />
          <style>{`
            .signflip-game-container {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          `}</style>
        </div>
      );
    
    case 'results':
      return (
        <SignFlipResults 
          results={gameResults}
          difficulty={selectedDifficulty}
          onRestart={handleRestartGame}
          onNewGame={handleNewGame}
          onBackToLevels={handleBackToLevels}
        />
      );
    
    default:
      return (
        <SignFlipSetup 
          onDifficultySelect={handleDifficultySelect}
          onBack={handleBack}
          userProgress={userProgress}
          loading={loading}
        />
      );
  }
};

export default SignFlip; 