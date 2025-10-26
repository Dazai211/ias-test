import React, { useState } from 'react';
import { signFlipLevels } from './SignFlipPairs';
import SignFlipGame from './SignFlipGame';
import LevelSelector from './LevelSelector';

const LEVELS_PER_PAGE = 10;
const TOTAL_LEVELS = signFlipLevels.length;

// Difficulty configuration
const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Easy',
    timer: 60,
    showShuffleTimer: false
  },
  normal: {
    label: 'Normal', 
    timer: 45,
    showShuffleTimer: false
  },
  hard: {
    label: 'Hard',
    timer: 30,
    showShuffleTimer: true
  }
};

export default function SignFlipDifficulty({ 
  difficulty, 
  onGameComplete, 
  currentLevel, 
  onLevelSelect,
  onBack, // add onBack prop
  userProgress = { easy: 1, normal: 0, hard: 0 }
}) {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel || null);
  const [showLevelSelect, setShowLevelSelect] = useState(!currentLevel);
  const [gameKey, setGameKey] = useState(0);
  const [levelPage, setLevelPage] = useState(0);

  const config = DIFFICULTY_CONFIG[difficulty];

  // Calculate unlocked levels for current difficulty
  const unlockedLevels = userProgress[difficulty] || 0;

  // When a level is selected from the LevelSelector
  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setShowLevelSelect(false);
    if (onLevelSelect) onLevelSelect(level);
  };

  if (showLevelSelect) {
    return (
      <div>
        <LevelSelector
          difficultyLabel={config.label}
          totalLevels={TOTAL_LEVELS}
          currentPage={levelPage}
          onPageChange={setLevelPage}
          onLevelSelect={handleLevelSelect}
          unlockedLevels={unlockedLevels}
        />
        <button
          className="back-to-setup-button"
          onClick={onBack}
        >
          Back
        </button>
        <style>{`
          .back-to-setup-button {
            margin: 2.5rem auto 0 auto;
            display: block;
            background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
            color: #fff;
            border: none;
            border-radius: 1.2rem;
            font-weight: 700;
            font-size: 1.05rem;
            padding: 0.7rem 2.2rem;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(58, 35, 115, 0.10);
            transition: background 0.2s, transform 0.15s;
            outline: none;
          }
          .back-to-setup-button:hover {
            background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
            color: #3a2373;
            transform: scale(1.07);
            box-shadow: 0 6px 24px rgba(255, 111, 161, 0.28);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <SignFlipGame
        key={gameKey}
        pairs={signFlipLevels[selectedLevel - 1]}
        showSubtitle={difficulty === 'easy'}
        timer={config.timer}
        showShuffleTimer={config.showShuffleTimer}
        onBackToLevels={onBack}
        onGameComplete={onGameComplete}
      />
    </div>
  );
} 