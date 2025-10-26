import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../library/firebase';
import { updateGameActivity, addGameResult, awardExpAndUnlockTitles } from '../userProfile/firebaseUtils';
import SignSenseSetup from './SignSenseFiles/SignSenseSetup';
import SignSenseGame from './SignSenseFiles/SignSenseGame';
import SignSenseResults from './SignSenseFiles/SignSenseResults';

const SignSense = () => {
  const [currentScreen, setCurrentScreen] = useState('setup'); // 'setup', 'game', 'results'
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const navigate = useNavigate();

  const handleStartGame = (questionCount) => {
    setSelectedQuestionCount(questionCount);
    setCurrentScreen('game');
  };

  const handleGameComplete = async (results) => {
    setGameResults(results);
    setCurrentScreen('results');

    // Update game activity in Firebase
    if (auth.currentUser) {
      try {
        await updateGameActivity(auth.currentUser.uid, 'Sign Sense');
        
        // Save simple game result with score
        await addGameResult(auth.currentUser.uid, {
          gameName: 'Sign Sense',
          score: results.score
        });
        await awardExpAndUnlockTitles(auth.currentUser.uid);
      } catch (error) {
        console.error('Error updating game activity:', error);
      }
    }
  };

  const handleBackToSetup = () => {
    setCurrentScreen('setup');
    setSelectedQuestionCount(null);
    setGameResults(null);
  };

  const handleRestartGame = () => {
    setCurrentScreen('game');
    setGameResults(null);
  };

  const handleBackToGames = () => {
    navigate('/games');
  };

  // Render different screens based on current state
  switch (currentScreen) {
    case 'setup':
      return (
        <SignSenseSetup 
          onStartGame={handleStartGame}
          onBack={handleBackToGames}
        />
      );
    
    case 'game':
      return (
        <SignSenseGame 
          questionCount={selectedQuestionCount}
          onGameComplete={handleGameComplete}
          onBack={handleBackToSetup}
        />
      );
    
    case 'results':
      return (
        <SignSenseResults 
          results={gameResults}
          onRestart={handleRestartGame}
          onBackToSetup={handleBackToSetup}
        />
      );
    
    default:
      return (
        <SignSenseSetup 
          onStartGame={handleStartGame}
          onBack={handleBackToGames}
        />
      );
  }
};

export default SignSense; 