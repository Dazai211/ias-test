import React, { useState, useEffect } from 'react';

const LEVELS_PER_PAGE = 10;

// Default (desktop) values
const CIRCLE_RADIUS = 180;
const CONTAINER_SIZE = 440;
const CENTER_CARD_SIZE = 90;
const LEVEL_CARD_SIZE = 64;

export default function LevelSelector({
  difficultyLabel,
  totalLevels,
  currentPage,
  onPageChange,
  onLevelSelect,
  unlockedLevels = 0
}) {
  // Animation: expand on mount and retrigger on page change
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setExpanded(false);
    const timeout = setTimeout(() => setExpanded(true), 400);
    return () => clearTimeout(timeout);
  }, [currentPage]);

  // Calculate levels for this page
  const start = currentPage * LEVELS_PER_PAGE + 1;
  const end = Math.min((currentPage + 1) * LEVELS_PER_PAGE, totalLevels);
  const levels = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  // Circular layout math (uses CSS variable for radius)
  const getCardPosition = (idx, total) => {
    const angle = (2 * Math.PI * idx) / total - Math.PI / 2;
    return {
      left: `calc(50% + var(--circle-radius) * ${Math.cos(angle)} - var(--level-card-size) / 2)`,
      top: `calc(50% + var(--circle-radius) * ${Math.sin(angle)} - var(--level-card-size) / 2)`
    };
  };

  const handleLevelClick = (level) => {
    // Only allow selection if level is unlocked
    if (level <= unlockedLevels) {
      onLevelSelect(level);
    }
  };

  return (
    <div className="level-selector-circle-wrap">
      {/* Header Section */}
      <div className="level-selector-header">
        <h1 className="level-selector-title">Sign Flip - {difficultyLabel}</h1>
        <p className="level-selector-subtitle">Choose a level to start your learning journey</p>
      </div>
      
      {/* Navigation */}
      <div className="level-selector-nav">
        <button
          className={`level-selector-nav-button ${currentPage === 0 ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          &#8592;
        </button>
        <span className="level-selector-nav-text">
          Levels {start}-{end} of {totalLevels}
        </span>
        <button
          className={`level-selector-nav-button ${end === totalLevels ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={end === totalLevels}
        >
          &#8594;
        </button>
      </div>
      
      {/* Main container */}
      <div className="level-selector-container">
        {/* Center card (static) */}
        <div className="level-selector-center-card">
          {difficultyLabel}
        </div>
        {/* Level cards (circular) */}
        {levels.map((level, idx) => {
          const isUnlocked = level <= unlockedLevels;
          
          return (
            <div
              key={level}
              className={`level-selector-level-card ${expanded ? 'expanded' : ''} ${!isUnlocked ? 'level-locked' : ''}`}
              style={{
                ...getCardPosition(idx, levels.length),
                transitionDelay: expanded ? `${0.08 * idx}s` : '0s',
                pointerEvents: expanded ? 'auto' : 'none',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.6,
                filter: isUnlocked ? 'none' : 'grayscale(1)'
              }}
              onClick={() => handleLevelClick(level)}
            >
              {level}
              {!isUnlocked && <span className="level-lock-icon">🔒</span>}
            </div>
          );
        })}
      </div>

      <style>{`
        :root {
          --circle-radius: ${CIRCLE_RADIUS}px;
          --container-size: ${CONTAINER_SIZE}px;
          --center-card-size: ${CENTER_CARD_SIZE}px;
          --level-card-size: ${LEVEL_CARD_SIZE}px;
        }

        .level-selector-circle-wrap {
          padding-top: 32px;
          padding-bottom: 32px;
        }

        .level-selector-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .level-selector-title {
          color: #fff;
          font-size: 2.5rem;
          font-weight: 900;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #ffb6e6 0%, #a18cd1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 12px #3a237355;
        }

        .level-selector-subtitle {
          color: #ffb6e6;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          text-shadow: 0 1px 8px #a18cd1aa;
        }

        .level-selector-nav {
          margin-bottom: 32px;
          margin-left: auto;
          margin-right: auto;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          backdrop-filter: blur(8px);
          max-width: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          color: #fff;
        }

        .level-selector-nav-button {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .level-selector-nav-button.disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        .level-selector-nav-text {
          font-weight: 700;
          font-size: 1.1rem;
          color: #fff;
        }

        .level-selector-container {
          position: relative;
          width: var(--container-size);
          height: var(--container-size);
          margin: 0 auto;
          margin-top: 32px;
          margin-bottom: 32px;
        }

        .level-selector-center-card {
          width: var(--center-card-size);
          height: var(--center-card-size);
          border-radius: 20px;
          background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
          color: #3a2373;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.2rem;
          box-shadow: 0 4px 24px #a18cd144;
          cursor: pointer;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          transition: box-shadow 0.2s, transform 0.3s cubic-bezier(.4,2,.3,1);
        }

        .level-selector-center-card:hover {
          box-shadow: 0 6px 32px #a18cd166;
          transform: translate(-50%, -50%) scale(1.1);
        }

        .level-selector-level-card {
          width: var(--level-card-size);
          height: var(--level-card-size);
          border-radius: 16px;
          background: linear-gradient(135deg, #fff 0%, #fbc2eb 100%);
          color: #3a2373;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px #a18cd122;
          cursor: pointer;
          position: absolute;
          transition: transform 0.4s cubic-bezier(.4,2,.3,1), opacity 0.3s;
          opacity: 0;
          transform: scale(0.3) translateZ(-50px);
        }

        .level-selector-level-card.expanded {
          opacity: 1;
          transform: scale(1) translateZ(0);
        }

        .level-selector-level-card:hover {
          transform: scale(1.1) translateZ(0);
          box-shadow: 0 4px 16px #a18cd144;
        }

        .level-locked {
          background: linear-gradient(135deg, #666 0%, #999 100%);
          color: #333;
        }

        .level-locked:hover {
          transform: scale(1) translateZ(0) !important;
          box-shadow: 0 2px 8px #a18cd122 !important;
        }

        .level-lock-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1rem;
          color: white;
          z-index: 1;
        }

        @media (max-width: 600px) {
          :root {
            --circle-radius: 120px;
            --container-size: 220px;
            --center-card-size: 56px;
            --level-card-size: 48px;
          }

          .level-selector-title {
            font-size: 2rem;
          }

          .level-selector-subtitle {
            font-size: 1rem;
            margin-bottom: 1.2rem;
            margin-top: 0.7rem;
            margin-left: 1.2rem;
            margin-right: 1.2rem;
          }

          .level-selector-nav {
            margin-bottom: 88px;
          }

          .level-selector-center-card {
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </div>
  );
}       