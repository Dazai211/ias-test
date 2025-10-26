import React, { useState } from 'react';

const difficulties = [
  { label: 'Easy', value: 'easy' },
  { label: 'Normal', value: 'normal' },
  { label: 'Hard', value: 'hard' },
];

const difficultyIcons = [
  'I', // Easy - single line
  'II', // Normal - double lines
  'IIIII', // Hard - five lines
];

const difficultyDescriptions = [
  'Perfect for beginners',
  'For experienced players',
  'Challenge yourself',
];

const SignFlipSetup = ({ onDifficultySelect, onBack, userProgress = { easy: 1, normal: 0, hard: 0 }, loading = false }) => {
  const [hovered, setHovered] = useState(null);
  const [backHover, setBackHover] = useState(false);
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [infoHover, setInfoHover] = useState(false);

  const handleDifficultyClick = (difficulty) => {
    // Only allow selection if difficulty is unlocked
    if (userProgress[difficulty.value] > 0) {
      onDifficultySelect(difficulty.value);
    }
  };

  if (loading) {
    return (
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="signflip-title">Sign Flip</h2>
      <div className="signflip-subtitle-container">
        <div className="signflip-subtitle">Choose your challenge</div>
        <button 
          className={`signflip-info-btn ${infoHover ? 'signflip-info-btn-hover' : ''}`}
          onClick={() => setShowInfoOverlay(true)}
          onMouseEnter={() => setInfoHover(true)}
          onMouseLeave={() => setInfoHover(false)}
          aria-label="Game information"
        >
          !
        </button>
      </div>
      
      <div className="bubble-container">
        {difficulties.map((diff, idx) => {
          const isUnlocked = userProgress[diff.value] > 0;
          
          return (
            <div
              key={diff.value}
              className={`bubble ${hovered === idx ? 'bubble-hovered' : ''} ${!isUnlocked ? 'bubble-locked' : ''}`}
              style={{ 
                animation: `floatBubble${idx} 4s ease-in-out infinite`,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.6,
                filter: isUnlocked ? 'none' : 'grayscale(1)'
              }}
              onMouseEnter={() => isUnlocked && setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleDifficultyClick(diff)}
              tabIndex={0}
            >
              <span className={`bubble-icon bubble-icon-${idx}`}>{difficultyIcons[idx]}</span>
              <div className="bubble-label">{diff.label}</div>
              {hovered === idx && isUnlocked && (
                <div className="bubble-description-hover">{difficultyDescriptions[idx]}</div>
              )}
              {!isUnlocked && (
                <div className="bubble-lock-icon">🔒</div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className={`back-button ${backHover ? 'back-button-hovered' : ''}`}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        onClick={onBack}
      >
        Back
      </button>

      <style>{`
        .signflip-title {
          color: #fff;
          font-weight: 900;
          font-size: 2.5rem;
          margin-bottom: 0;
          margin-top: 0;
          letter-spacing: 2px;
          text-align: center;
          text-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(102, 126, 234, 0.5);
          background: linear-gradient(45deg, #fff, #f093fb, #667eea);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

                 .signflip-subtitle {
           color: #ffb6e6;
           font-weight: 600;
           font-size: 1.3rem;
           text-align: center;
           margin-bottom: 0;
           letter-spacing: 0.01em;
           text-shadow: 0 1px 8px #a18cd1aa;
         }

        .bubble-container {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 2.5rem;
          margin: 2.5rem 0 2rem 0;
          flex-wrap: wrap;
          padding: 2.8rem 2rem;
          background: rgba(30,22,54,0.45);
          border-radius: 3.5rem;
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.22), 0 2px 8px 0 #a18cd144;
          border: 2.5px solid;
          border-image: none;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          position: relative;
          z-index: 2;
          max-width: 700px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          min-height: 260px;
        }

        .bubble {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
          box-shadow: 0 4px 24px 0 #a18cd144;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.35s cubic-bezier(.4,2,.3,1);
          outline: none;
          z-index: 1;
          position: relative;
        }

        .bubble-locked {
          background: linear-gradient(135deg, #666 0%, #999 100%);
          box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.3);
        }

        .bubble-hovered {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #ffb6e6 0%, #a18cd1 100%);
          box-shadow: 0 8px 32px 0 #ffb6e6cc, 0 2px 8px 0 #a18cd144;
          outline: 2px solid #ffb6e6;
          z-index: 2;
        }

        .bubble-locked.bubble-hovered {
          transform: none;
          box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.3);
        }

        .bubble-icon {
          font-size: 2.5rem;
          margin-bottom: 0.7rem;
          font-weight: bold;
          filter: drop-shadow(0 0 8px #a18cd1);
          transition: filter 0.3s, font-size 0.3s;
        }

        .bubble-icon-0 { color: #00ff00; } /* Easy - Green */
        .bubble-icon-1 { color: #ffff00; } /* Normal - Yellow */
        .bubble-icon-2 { color: #ff0000; } /* Hard - Red */

        .bubble-hovered .bubble-icon {
          font-size: 3.2rem;
          filter: drop-shadow(0 0 18px #ffb6e6) drop-shadow(0 0 8px #a18cd1);
        }

        .bubble-label {
          font-weight: 800;
          font-size: 1.1rem;
          color: #3a2373;
          letter-spacing: 0.01em;
          text-shadow: 0 1px 4px #fff4;
          transition: all 0.3s;
        }

        .bubble-hovered .bubble-label {
          font-size: 1.25rem;
          color: #fff;
          text-shadow: 0 2px 12px #fff8;
        }

        .bubble-description-hover {
          color: #fff;
          font-weight: 600;
          font-size: 1.08rem;
          text-shadow: 0 2px 12px #3a237355;
          text-align: center;
        }

        .bubble-lock-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          color: white;
          z-index: 3;
        }

        .back-button {
          margin-top: 2.5rem;
          padding: 0.7rem 2.2rem;
          border-radius: 1.2rem;
          border: none;
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(58, 35, 115, 0.10);
          transition: background 0.2s, transform 0.15s;
          outline: none;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .back-button-hovered {
          background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
          color: #3a2373;
          transform: scale(1.07);
          box-shadow: 0 6px 24px rgba(255, 111, 161, 0.28);
        }

        @keyframes floatBubble0 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes floatBubble1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes floatBubble2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-22px); }
        }

        @media (max-width: 768px) {
          .bubble-container {
            margin-left: 2rem !important;
            margin-right: 2rem !important;
            max-width: calc(100% - 4rem) !important;
            width: calc(100% - 4rem) !important;
          }
        }

                 /* Info Overlay Styles */
         .signflip-subtitle-container {
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 0.8rem;
           margin-bottom: 0;
           margin-top: 0.8rem;
           position: relative;
         }

                           .signflip-info-btn {
            background: linear-gradient(135deg, #ff6fa1 0%, #ffb6e6 100%);
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            font-size: 1.2rem;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(255, 111, 161, 0.5), 0 0 20px rgba(255, 182, 230, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.3);
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                         animation: colorChange 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .signflip-info-btn-hover,
          .signflip-info-btn:hover {
            background: linear-gradient(135deg, #ffb6e6 0%, #ff6fa1 100%);
            transform: scale(1.2);
            box-shadow: 0 8px 25px rgba(255, 111, 161, 0.7), 0 0 30px rgba(255, 182, 230, 0.5);
            border-color: rgba(255, 255, 255, 0.6);
            animation: none;
          }

                     @keyframes colorChange {
             0% { 
               background: linear-gradient(135deg, #ff6fa1 0%, #ffb6e6 100%);
               box-shadow: 0 4px 16px rgba(255, 111, 161, 0.5), 0 0 20px rgba(255, 182, 230, 0.3);
             }
             25% { 
               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
               box-shadow: 0 4px 16px rgba(102, 126, 234, 0.5), 0 0 20px rgba(118, 75, 162, 0.3);
             }
             50% { 
               background: linear-gradient(135deg, #ff6fa1 0%, #ffb6e6 100%);
               box-shadow: 0 4px 16px rgba(255, 111, 161, 0.5), 0 0 20px rgba(255, 182, 230, 0.3);
             }
             75% { 
               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
               box-shadow: 0 4px 16px rgba(102, 126, 234, 0.5), 0 0 20px rgba(118, 75, 162, 0.3);
             }
             100% { 
               background: linear-gradient(135deg, #ff6fa1 0%, #ffb6e6 100%);
               box-shadow: 0 4px 16px rgba(255, 111, 161, 0.5), 0 0 20px rgba(255, 182, 230, 0.3);
             }
           }

        .signflip-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .signflip-overlay-content {
          background: linear-gradient(135deg, rgba(45, 30, 74, 0.95) 0%, rgba(74, 44, 122, 0.9) 100%);
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .signflip-overlay-title {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .signflip-overlay-description {
          color: #ffe0fa;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          text-align: left;
        }

        .signflip-overlay-btn {
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        .signflip-overlay-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(255, 111, 161, 0.4);
        }

        @media (max-width: 480px) {
          .signflip-overlay-content {
            padding: 1.5rem;
            margin: 1rem;
          }
          
          .signflip-overlay-title {
            font-size: 1.3rem;
          }
          
          .signflip-overlay-description {
            font-size: 0.9rem;
          }
        }
      `}</style>

      {/* Info Overlay */}
      {showInfoOverlay && (
        <div className="signflip-overlay" onClick={() => setShowInfoOverlay(false)}>
          <div className="signflip-overlay-content" onClick={(e) => e.stopPropagation()}>
            <div className="signflip-overlay-title">Sign Flip Game</div>
                         <div className="signflip-overlay-description">
               Test your memory and sign language skills with this exciting card matching game. 
               Find matching pairs of sign language cards by flipping them over.
               <br /><br />
               <strong>Easy:</strong> Subtitle and 60 seconds timer
               <br /><br />
               <strong>Normal:</strong> No subtitle and 45 seconds timer
               <br /><br />
               <strong>Hard:</strong> No subtitle and 30 seconds timer
             </div>
            <button 
              className="signflip-overlay-btn"
              onClick={() => setShowInfoOverlay(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignFlipSetup; 