import React, { useState, useEffect, useRef } from 'react';
import SignFlipCard from './SignFlipCard';
import { useSignFlipTranslation } from '../../Languages/useSignFlipTranslation';

// Helper to shuffle and flatten pairs into cards
function prepareCards(pairs) {
  const cards = [];
  pairs.forEach(pair => {
    cards.push({ id: pair.id, type: 'video', src: pair.video, subtitle: pair.subtitle });
    cards.push({ id: pair.id, type: 'image', src: pair.image, subtitle: pair.subtitle });
  });
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

const SHUFFLE_INTERVAL = 10000; // 10 seconds

// Extract PauseOverlay as a subcomponent
function PauseOverlay({ onResume, onRestart, onBack }) {
  return (
    <div className="pause-overlay">
      <div className="pause-card">
        <div className="pause-icon">⏸️</div>
        <div className="pause-title">Game Paused</div>
        <div className="pause-buttons">
          <button
            className="pause-button resume-button"
            onClick={onResume}
          >
            Resume
          </button>
          <button
            className="pause-button restart-button"
            onClick={onRestart}
          >
            Restart
          </button>
          <button
            className="pause-button back-button"
            onClick={onBack}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper for resetting the game
function resetGame(setFlipped, setMatched, setIsBusy, setTimeLeft, setGameOver, setWin, setScore, setPaused, setCards, pairs, timer) {
  setFlipped([]);
  setMatched([]);
  setIsBusy(false);
  setTimeLeft(timer || null);
  setGameOver(false);
  setWin(false);
  setScore(0);
  setPaused(false);
  setCards(prepareCards(pairs));
}

const SignFlipGame = ({ pairs, showSubtitle, timer, showShuffleTimer = false, onBackToLevels, onGameComplete }) => {
  const [cards, setCards] = useState(() => prepareCards(pairs));
  const [flipped, setFlipped] = useState([]); // indices of flipped cards
  const [matched, setMatched] = useState([]); // indices of matched cards
  const [isBusy, setIsBusy] = useState(false); // disables clicks during flip-back
  const [timeLeft, setTimeLeft] = useState(timer || null);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffleCountdown, setShuffleCountdown] = useState(SHUFFLE_INTERVAL / 1000);
  const timerRef = useRef();
  const shuffleRef = useRef();
  const shuffleCountdownRef = useRef();
  const [paused, setPaused] = useState(false);
  
  // New state for video timer pause functionality
  const [videoPauseTimer, setVideoPauseTimer] = useState(false);
  const [currentVideoCard, setCurrentVideoCard] = useState(null);
  const videoRef = useRef(null);
  const [pendingFlipCards, setPendingFlipCards] = useState([]);
  const [autoFlipTimeout, setAutoFlipTimeout] = useState(null);

  const { t } = useSignFlipTranslation(); // Custom hook for subtitle translation with fallback

  // Check for win
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setWin(true);
      setGameOver(false);
      clearInterval(timerRef.current);
      clearInterval(shuffleRef.current);
      clearInterval(shuffleCountdownRef.current);
      
      // Call onGameComplete with results
      if (onGameComplete) {
        const totalPairs = cards.length / 2;
        const percentage = Math.round((score / totalPairs) * 100);
        onGameComplete({
          score,
          totalPairs,
          percentage,
          timeLeft,
          win: true,
          completed: true // Add completed property
        });
      }
    }
  }, [matched, cards, score, timeLeft, onGameComplete]);

  // Timer effect for all modes if timer is set - Modified to respect video pause
  useEffect(() => {
    if (!timer || paused || videoPauseTimer) return;
    if (gameOver || win) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t === 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          
          // Call onGameComplete with results when time runs out
          if (onGameComplete) {
            const totalPairs = cards.length / 2;
            const percentage = Math.round((score / totalPairs) * 100);
            onGameComplete({
              score,
              totalPairs,
              percentage,
              timeLeft: 0,
              win: false,
              completed: false // Add completed property
            });
          }
          
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timer, gameOver, win, paused, videoPauseTimer, score, cards.length, onGameComplete]);

  // Shuffle interval for hard mode - Modified to respect video pause
  useEffect(() => {
    if (!timer || !showShuffleTimer || paused || videoPauseTimer) return;
    if (gameOver || win) return;
    shuffleRef.current = setInterval(() => {
      setCards(prevCards => {
        const newCards = [...prevCards];
        const unmatchedIndices = newCards.map((_, idx) => idx).filter(idx => !matched.includes(idx));
        for (let i = unmatchedIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const idxA = unmatchedIndices[i];
          const idxB = unmatchedIndices[j];
          [newCards[idxA], newCards[idxB]] = [newCards[idxB], newCards[idxA]];
        }
        return newCards;
      });
      setFlipped([]);
      setShuffleCountdown(SHUFFLE_INTERVAL / 1000);
    }, SHUFFLE_INTERVAL);
    return () => clearInterval(shuffleRef.current);
  }, [timer, gameOver, win, matched, showShuffleTimer, paused, videoPauseTimer]);

  // Shuffle countdown for hard mode - Modified to respect video pause
  useEffect(() => {
    if (!timer || !showShuffleTimer || paused || videoPauseTimer) return;
    if (gameOver || win) return;
    setShuffleCountdown(SHUFFLE_INTERVAL / 1000);
    shuffleCountdownRef.current = setInterval(() => {
      setShuffleCountdown(prev => {
        if (prev === 1) return SHUFFLE_INTERVAL / 1000;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(shuffleCountdownRef.current);
  }, [timer, gameOver, win, matched, showShuffleTimer, paused, videoPauseTimer]);

  // Cleanup auto flip timeout on unmount
  useEffect(() => {
    return () => {
      if (autoFlipTimeout) {
        clearTimeout(autoFlipTimeout);
      }
    };
  }, [autoFlipTimeout]);

  // Handle card click - Modified to detect video cards and pause timer
  const handleCardClick = idx => {
    if (isBusy || flipped.includes(idx) || matched.includes(idx) || gameOver || win) return;
    
    const clickedCard = cards[idx];
    
    if (flipped.length === 0) {
      setFlipped([idx]);
      
      // If it's a video card, pause timer for first loop
      if (clickedCard.type === 'video') {
        setVideoPauseTimer(true);
        setCurrentVideoCard(idx);
        
        // Resume timer after video duration (approximate first loop)
        setTimeout(() => {
          setVideoPauseTimer(false);
          setCurrentVideoCard(null);
        }, 8000); // 8 seconds should cover most FSL video durations
      }
    } else if (flipped.length === 1) {
      setFlipped([flipped[0], idx]);
      setIsBusy(true);
      
      // Check if either card is a video to determine flip-back delay
      const firstCard = cards[flipped[0]];
      const secondCard = clickedCard;
      const hasVideo = firstCard.type === 'video' || secondCard.type === 'video';
      
      // If second card is video, pause timer
      if (secondCard.type === 'video') {
        setVideoPauseTimer(true);
        setCurrentVideoCard(idx);
      }
      
      // Store the cards for manual flip option
      setPendingFlipCards([flipped[0], idx]);
      
      // Use longer delay if there's a video card (automatic flip)
      const flipBackDelay = hasVideo ? 8000 : 900;
      
      // Set up automatic flip timeout
      const timeout = setTimeout(() => {
        const first = cards[flipped[0]];
        const second = cards[idx];
        if (first.id === second.id && first.type !== second.type) {
          setMatched(m => [...m, flipped[0], idx]);
          setScore(s => s + 1);
        }
        setFlipped([]);
        setIsBusy(false);
        setPendingFlipCards([]);
        
        // Reset video pause state when cards are matched or unmatched
        setVideoPauseTimer(false);
        setCurrentVideoCard(null);
      }, flipBackDelay);
      
      setAutoFlipTimeout(timeout);
    }
  };

  // Handle manual flip button click
  const handleFlipButton = () => {
    // Clear the automatic flip timeout
    if (autoFlipTimeout) {
      clearTimeout(autoFlipTimeout);
      setAutoFlipTimeout(null);
    }
    
    const [firstIdx, secondIdx] = pendingFlipCards;
    const first = cards[firstIdx];
    const second = cards[secondIdx];
    
    if (first.id === second.id && first.type !== second.type) {
      setMatched(m => [...m, firstIdx, secondIdx]);
      setScore(s => s + 1);
    }
    
    setFlipped([]);
    setPendingFlipCards([]);
    setIsBusy(false);
    
    // Reset video pause state
    setVideoPauseTimer(false);
    setCurrentVideoCard(null);
  };

  // Show currently flipped cards in big boxes
  const flippedCards = flipped.map(idx => cards[idx]);
  // Responsive: On mobile, only show one box, always visible, with latest flipped card or placeholder
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
  const latestFlippedCard = flippedCards.length > 0 ? flippedCards[flippedCards.length - 1] : null;

  // Disable card clicks and overlay when paused
  const isInteractionDisabled = isBusy || paused || flipped.length === 2 || gameOver || win;

  // Create custom layout for small levels (4 pairs = 8 cards)
  const renderCardGrid = () => {
    return (
      <div className="card-grid-small">
        {cards.map((card, idx) => (
          <SignFlipCard
            key={idx}
            flipped={flipped.includes(idx) || matched.includes(idx)}
            matched={matched.includes(idx)}
            type={card.type}
            src={card.src}
            onClick={() => handleCardClick(idx)}
            disabled={isInteractionDisabled || matched.includes(idx)}
          />
        ))}
      </div>
    );
  };

  const totalPairs = pairs.length;
  const remainingPairs = (totalPairs - matched.length / 2);

  return (
    <div className="sign-flip-game-container">
      <div className="sign-flip-game-header">
        <button 
          className="pause-button-main"
          onClick={() => setPaused(p => !p)}
        >
          {paused ? '▶️' : '⏸️'}
        </button>
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">Remaining Pairs</span>
            <span className="stat-value">{remainingPairs} / {totalPairs}</span>
          </div>
          {timer && (
            <div className="stat-item">
              <span className="stat-label">Time</span>
              <span className={`timer-value ${timeLeft <= 5 ? 'timer-warning' : ''}`}>{timeLeft}s</span>
            </div>
          )}
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
        </div>
      </div>
      
      <div className="game-area">
        {paused && (
          <PauseOverlay
            onResume={() => setPaused(false)}
            onRestart={() => resetGame(setFlipped, setMatched, setIsBusy, setTimeLeft, setGameOver, setWin, setScore, setPaused, setCards, pairs, timer)}
            onBack={() => { if (typeof onBackToLevels === 'function') onBackToLevels(); }}
          />
        )}
        <div className={`game-content ${paused ? 'paused' : ''}`}>
          <div className="flipped-cards-row">
            {isMobile ? (
              <div className="flipped-card-container">
                <div className="flipped-card-box">
                  {latestFlippedCard ? (
                    latestFlippedCard.type === 'video' ? (
                      <div className="video-container">
                        <video
                          src={latestFlippedCard.src}
                          autoPlay
                          loop
                          muted
                          className="flipped-video"
                        />
                        {showSubtitle && latestFlippedCard.subtitle && (
                          <div className="video-subtitle">
                            {t(latestFlippedCard.subtitle)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src={latestFlippedCard.src}
                        alt="sign"
                        className="flipped-image"
                      />
                    )
                  ) : (
                    <div className="flipped-placeholder" />
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flipped-card-container">
                  <div className="flipped-card-box">
                    {flippedCards[0] && (
                      <>
                        {flippedCards[0].type === 'video' ? (
                          <div className="video-container">
                            <video
                              src={flippedCards[0].src}
                              autoPlay
                              loop
                              muted
                              className="flipped-video"
                            />
                            {showSubtitle && flippedCards[0].subtitle && (
                              <div className="video-subtitle">
                                {t(flippedCards[0].subtitle)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <img
                            src={flippedCards[0].src}
                            alt="sign"
                            className="flipped-image"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flipped-card-container">
                  <div className="flipped-card-box">
                    {flippedCards[1] && (
                      <>
                        {flippedCards[1].type === 'video' ? (
                          <div className="video-container">
                            <video
                              src={flippedCards[1].src}
                              autoPlay
                              loop
                              muted
                              className="flipped-video"
                            />
                            {showSubtitle && flippedCards[1].subtitle && (
                              <div className="video-subtitle">
                                {t(flippedCards[1].subtitle)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <img
                            src={flippedCards[1].src}
                            alt="sign"
                            className="flipped-image"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Flip Button - Always visible, active only when pairs are flipped */}
          <div className="flip-button-container">
            <button
              className={`flip-button ${flipped.length !== 2 ? 'disabled' : ''}`}
              onClick={flipped.length === 2 ? handleFlipButton : undefined}
            >
              {flipped.length === 0
                ? 'Flip Now (No pairs)'
                : flipped.length === 1
                ? 'Flip Now (1 more pair)'
                : '⚡ Flip Now'}
            </button>
          </div>
          
          {renderCardGrid()}
        </div>
      </div>
      
      {win && <div className="game-message win">🎉 You matched all pairs! Great job!</div>}
      {gameOver && !win && <div className="game-message game-over">⏰ Time's up! Try again!</div>}

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.5; }
        }

        .sign-flip-game-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 2.5rem;
        }

        .sign-flip-game-header {
          background: rgba(255,255,255,0.1);
          border-radius: 1.2rem;
          padding: 0.7rem 1.1rem;
          margin-bottom: 1.2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          width: 100%;
          max-width: 520px;
          position: relative;
          padding-left: 3.5rem;
        }

        .pause-button-main {
          position: absolute;
          left: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          color: #ffe0fa;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          z-index: 10;
        }

        .pause-button-main:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .stats-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #ffe0fa;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
        }

        .timer-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: #43cea2;
          text-shadow: 0 0 6px #43cea2;
          transition: all 0.3s ease;
        }

        .timer-value.timer-warning {
          color: #ff6b6b;
          text-shadow: 0 0 6px #ff6b6b;
          animation: blink 1s infinite;
        }

        .game-area {
          position: relative;
        }

        .game-content {
          position: relative;
        }

        .game-content.paused {
          opacity: 0.4;
          pointer-events: none;
        }

        .flipped-cards-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: clamp(1rem, 3vw, 2rem);
          margin-bottom: 0.2rem;
          flex-wrap: nowrap;
          padding: 0 1rem;
          max-width: 95vw;
          margin-left: auto;
          margin-right: auto;
        }

        .flipped-card-container {
          position: relative;
        }

        .flipped-card-box {
          width: clamp(140px, 40vw, 280px);
          height: clamp(140px, 40vw, 280px);
          background: rgba(255,255,255,0.18);
          border-radius: clamp(12px, 2vw, 18px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px #a18cd144;
          border: 2px solid #fff;
          overflow: hidden;
          flex-shrink: 0;
        }

        .video-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .flipped-video {
          border-radius: inherit;
          background: #000;
          object-fit: contain;
          max-width: 100%;
          max-height: 100%;
        }

        .flipped-image {
          border-radius: inherit;
          object-fit: cover;
          background: #eee;
          width: 100%;
          height: 100%;
        }

        .video-subtitle {
          position: absolute;
          top: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          font-weight: 700;
          font-size: clamp(0.7rem, 2vw, 1rem);
          text-align: center;
          background: rgba(0,0,0,0.7);
          padding: 0.3rem 0.6rem;
          border-radius: 0.3rem;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.2);
          white-space: nowrap;
          z-index: 10;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }

        .flip-button-container {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .flip-button {
          background: linear-gradient(135deg, #a18cd1 0%, #6f51a1 100%);
          color: #fff;
          border: none;
          border-radius: 1rem;
          padding: 0.6rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(161, 140, 209, 0.25);
          transition: all 0.3s ease;
          outline: none;
          opacity: 0.85;
        }

        .flip-button:hover:not(.disabled) {
          background: linear-gradient(135deg, #c471f5 0%, #a18cd1 100%);
          transform: scale(1.03);
          box-shadow: 0 4px 16px rgba(161, 140, 209, 0.35);
          opacity: 1;
        }

        .flip-button.disabled {
          background: transparent;
          color: #fff;
          cursor: not-allowed;
          opacity: 0.6;
          transform: none;
          box-shadow: none;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .card-grid-small {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 2rem;
        }

        .card-row {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .game-message {
          color: #43cea2;
          font-weight: 800;
          font-size: 1.3rem;
          text-align: center;
          margin-top: 2rem;
        }

        .game-message.win {
          color: #43cea2;
        }

        .game-message.game-over {
          color: #ff6b6b;
        }

        /* Pause Overlay Styles */
        .pause-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          border-radius: 1rem;
        }

        .pause-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .pause-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .pause-title {
          color: #ffe0fa;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .pause-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
          align-items: center;
        }

        .pause-button {
          min-width: 120px;
          padding: 0.6rem 1.5rem;
          border-radius: 1rem;
          border: none;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(67, 206, 162, 0.18);
          transition: background 0.2s, transform 0.15s;
          display: block;
        }

        .resume-button {
          background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
          color: #fff;
        }

        .restart-button {
          background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
          color: #3a2373;
        }

        .back-button {
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
        }

        @media (max-width: 700px) {
          .sign-flip-game-header {
            max-width: min(520px, 95vw) !important;
            padding: clamp(0.5rem, 2vw, 0.7rem) clamp(0.8rem, 3vw, 1.1rem) !important;
            padding-left: clamp(2.5rem, 8vw, 3.5rem) !important;
            border-radius: clamp(0.8rem, 2vw, 1.2rem) !important;
            margin-bottom: clamp(0.8rem, 2vw, 1.2rem) !important;
            box-sizing: border-box !important;
          }
          .pause-button-main {
            left: clamp(0.3rem, 2vw, 0.5rem) !important;
            width: clamp(2rem, 6vw, 2.5rem) !important;
            height: clamp(2rem, 6vw, 2.5rem) !important;
            font-size: clamp(0.9rem, 3vw, 1.2rem) !important;
          }
          .stats-container {
            font-size: clamp(0.8rem, 2.5vw, 0.95rem) !important;
            gap: clamp(0.5rem, 2vw, 1rem) !important;
          }
          .stat-label {
            font-size: clamp(0.6rem, 2vw, 0.75rem) !important;
            text-align: center !important;
          }
          .stat-value {
            font-size: clamp(0.9rem, 2.5vw, 1.05rem) !important;
            text-align: center !important;
          }
          .timer-value {
            font-size: clamp(1rem, 3vw, 1.2rem) !important;
          }
          .flipped-cards-row {
            flex-direction: column !important;
            gap: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            padding: 0 !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .flipped-card-container {
            width: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .flipped-card-box {
            width: clamp(120px, 90vw, 320px) !important;
            height: clamp(120px, 90vw, 320px) !important;
            max-width: 320px !important;
            min-width: 120px !important;
            margin: 0 auto !important;
            background: rgba(255,255,255,0.18);
            border-radius: clamp(12px, 2vw, 18px);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px #a18cd144;
            border: 2px solid #fff;
            overflow: hidden;
            flex-shrink: 0;
          }
          .flipped-placeholder {
            width: 100%;
            height: 100%;
            background: transparent;
          }
          .video-container, .flipped-video, .flipped-image {
            max-width: 100% !important;
            max-height: 100% !important;
          }
          .flip-button-container {
            margin-top: 0.7rem !important;
            margin-bottom: 1rem !important;
          }
          .flip-button {
            width: 100% !important;
            max-width: 320px !important;
            font-size: 1.05rem !important;
            min-height: 44px !important;
            padding: 0.7rem 1.2rem !important;
          }
          .card-grid-small {
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
            margin-top: 1rem !important;
            justify-content: center !important;
          }
          .card-row {
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
            margin-bottom: 0.7rem !important;
            justify-content: center !important;
          }
          .game-message {
            font-size: 1.1rem !important;
            margin-top: 1.2rem !important;
          }
          .pause-overlay {
            border-radius: 0.7rem !important;
          }
          .pause-card {
            padding: 1.2rem !important;
            border-radius: 0.7rem !important;
            min-width: 200px !important;
          }
          .pause-icon {
            font-size: 2rem !important;
            margin-bottom: 0.6rem !important;
          }
          .pause-title {
            font-size: 1rem !important;
            margin-bottom: 1.2rem !important;
          }
          .pause-buttons {
            gap: 0.8rem !important;
            margin-top: 1.2rem !important;
          }
          .pause-button {
            min-width: 100px !important;
            padding: 0.5rem 1.2rem !important;
            font-size: 0.95rem !important;
            border-radius: 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SignFlipGame; 