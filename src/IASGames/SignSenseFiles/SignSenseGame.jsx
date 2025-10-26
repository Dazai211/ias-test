import React, { useState, useMemo, useEffect } from 'react';
import { signSenseQuestions } from './SignSenseData/signSenseQuestions';
import { useSignSenseTranslation } from '../../Languages/useSignSenseTranslation';

const SignSenseGame = ({ questionCount, onGameComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [autoProceedTimer, setAutoProceedTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [timerActive, setTimerActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [videoTimerPaused, setVideoTimerPaused] = useState(false);
  const [videoRef, setVideoRef] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);

  const { t } = useSignSenseTranslation(); // Custom hook for SignSense translations

  // Video control functions
  const handleVideoError = () => {
    console.error('Video error occurred');
    setVideoLoading(false);
  };

  const handleVideoLoad = () => {
    // Video loaded successfully
    setVideoLoading(false);
  };

  // Select random questions from the pool
  const selectedQuestions = useMemo(() => {
    const shuffled = [...signSenseQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }, [questionCount]);

  // Setup current question with random text selection
  useEffect(() => {
    if (selectedQuestions[currentQuestionIndex]) {
      const question = selectedQuestions[currentQuestionIndex];
      const randomIndex = Math.floor(Math.random() * 4);
      const selectedText = question.textOptions[randomIndex];
      const isCorrectText = randomIndex === 0; // First option is always correct

      setCurrentQuestion({
        ...question,
        displayedText: selectedText,
        correctAnswer: isCorrectText,
        selectedTextIndex: randomIndex
      });
    }
  }, [currentQuestionIndex, selectedQuestions]);

  const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!timerActive || showAnswer || isPaused || videoTimerPaused || videoLoading) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - mark as incorrect and show answer
          setSelectedAnswer('timeout');
          setShowAnswer(true);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, showAnswer, isPaused, videoTimerPaused, videoLoading]);

  // Reset timer for new question
  useEffect(() => {
    setTimeLeft(15);
    setTimerActive(true);
    setVideoTimerPaused(false);
    setVideoLoading(true); // Reset video loading state for new question
  }, [currentQuestionIndex]);

  // Video timer pause effect - pause timer for 8 seconds when video starts
  useEffect(() => {
    if (videoRef && !showAnswer && !isPaused) {
      const handleVideoPlay = () => {
        setVideoTimerPaused(true);
        // Resume timer after 8 seconds (covers one video loop)
        setTimeout(() => {
          setVideoTimerPaused(false);
        }, 8000);
      };

      videoRef.addEventListener('play', handleVideoPlay);
      
      return () => {
        videoRef.removeEventListener('play', handleVideoPlay);
      };
    }
  }, [videoRef, showAnswer, isPaused]);

  // Auto-proceed to next question after 2 seconds
  useEffect(() => {
    if (showAnswer && !isPaused) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 2000);
      setAutoProceedTimer(timer);
    }

    return () => {
      if (autoProceedTimer) {
        clearTimeout(autoProceedTimer);
      }
    };
  }, [showAnswer, isPaused]);

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (autoProceedTimer) {
      clearTimeout(autoProceedTimer);
      setAutoProceedTimer(null);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null || isPaused) return; // Prevent multiple selections or answer when paused
    
    setSelectedAnswer(answer);
    setShowAnswer(true);
    setTimerActive(false);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setAutoProceedTimer(null);
      setTimeLeft(15);
      setTimerActive(true);
    } else {
      // Game completed
      const results = {
        score,
        totalQuestions: selectedQuestions.length,
        percentage: Math.round((score / selectedQuestions.length) * 100)
      };
      onGameComplete(results);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setAutoProceedTimer(null);
    setTimeLeft(15);
    setTimerActive(true);
    setIsPaused(false);
    setVideoTimerPaused(false);
    setVideoLoading(true);
  };

  const handleExit = () => {
    onBack();
  };

  if (!currentQuestion) {
    return <div className="signsense-loading">Loading...</div>;
  }

  return (
    <div className="signsense-game-wrapper">
      <div className="signsense-header">
        {/* Pause Button */}
        <button
          onClick={handlePause}
          className="signsense-pause-button"
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>

        <div className="signsense-stats">
          <div className="signsense-stat-item">
            <span className="signsense-stat-label">Question</span>
            <span className="signsense-stat-value">{currentQuestionIndex + 1} / {selectedQuestions.length}</span>
          </div>
          <div className="signsense-timer-container">
            <span className="signsense-timer-label">Time</span>
            <span className={`signsense-timer ${timeLeft <= 5 ? 'signsense-timer-warning' : ''}`}>{timeLeft}s</span>
          </div>
          <div className="signsense-stat-item">
            <span className="signsense-stat-label">Score</span>
            <span className="signsense-stat-value">{score}</span>
          </div>
        </div>
        
        <div className="signsense-progress-container">
          <div className="signsense-progress-label">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="signsense-progress-bar">
            <div className="signsense-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="signsense-game-container">
        {/* Pause Overlay */}
        {isPaused && (
          <div className="signsense-paused-overlay">
            <div className="signsense-paused-content">
              <div className="signsense-pause-icon">⏸️</div>
              <div className="signsense-pause-title">Game Paused</div>
              
              <div className="signsense-pause-buttons">
                <button
                  className="signsense-pause-button-resume"
                  onClick={handlePause}
                >
                  Resume
                </button>
                <button
                  className="signsense-pause-button-restart"
                  onClick={handleRestart}
                >
                  Restart
                </button>
                <button
                  className="signsense-pause-button-exit"
                  onClick={handleExit}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="signsense-layout">
          <div className="signsense-video-container">
            <video
              src={currentQuestion.video}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              loading="lazy"
              poster="/Loading/Loading.png"
              ref={setVideoRef}
              onError={handleVideoError}
              onLoadedData={handleVideoLoad}
              className="signsense-video"
            >
              Your browser does not support the video tag.
            </video>
            {showAnswer && (
              <div className="signsense-correct-answer">
                {/* Use i18n translation for correct answer text, fallback to English if not found */}
                {t(`words.${currentQuestion.textOptions[0]}`) || currentQuestion.textOptions[0]}
              </div>
            )}
          </div>

          <div className="signsense-content">
            <div className="signsense-text-display">
              {/* Use i18n translation for displayed text, fallback to English if not found */}
              {t(`words.${currentQuestion.displayedText}`) || currentQuestion.displayedText}
            </div>

            <div className="signsense-buttons">
              <button
                className={`signsense-button ${selectedAnswer === true ? 'signsense-button-selected' : ''} ${selectedAnswer !== null && currentQuestion.correctAnswer === true ? 'signsense-button-correct' : ''} ${selectedAnswer === true && currentQuestion.correctAnswer === false ? 'signsense-button-wrong' : ''}`}
                onClick={() => handleAnswerSelect(true)}
              >
                TRUE
              </button>
              <button
                className={`signsense-button ${selectedAnswer === false ? 'signsense-button-selected' : ''} ${selectedAnswer !== null && currentQuestion.correctAnswer === false ? 'signsense-button-correct' : ''} ${selectedAnswer === false && currentQuestion.correctAnswer === true ? 'signsense-button-wrong' : ''}`}
                onClick={() => handleAnswerSelect(false)}
              >
                FALSE
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.5; }
        }

        .signsense-game-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          min-height: 100vh;
        }

        .signsense-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          min-height: 100vh;
          color: #fff;
          font-size: 1.2rem;
        }

        .signsense-header {
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

        .signsense-pause-button {
          position: absolute;
          top: 50%;
          left: 0.5rem;
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

        .signsense-pause-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .signsense-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .signsense-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .signsense-stat-label {
          font-size: 0.75rem;
          color: #ffe0fa;
          font-weight: 500;
        }

        .signsense-stat-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
        }

        .signsense-timer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .signsense-timer {
          font-size: 1.2rem;
          font-weight: 900;
          color: #43cea2;
          text-shadow: 0 0 10px #43cea2;
          transition: all 0.3s ease;
        }

        .signsense-timer-warning {
          color: #ff6b6b;
          text-shadow: 0 0 10px #ff6b6b;
          animation: blink 1s infinite;
        }

        .signsense-timer-label {
          font-size: 0.75rem;
          color: #ffe0fa;
          font-weight: 500;
        }

        .signsense-progress-container {
          width: 100%;
        }

        .signsense-progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #ffe0fa;
        }

        .signsense-progress-bar {
          width: 100%;
          height: 6px;
          background-color: rgba(255,255,255,0.18);
          border-radius: 3px;
          margin-bottom: 0.5rem;
          overflow: hidden;
        }

        .signsense-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
          transition: width 0.3s ease;
        }

        .signsense-game-container {
          background: rgba(255,255,255,0.1);
          border-radius: 1.5rem;
          padding: 2rem;
          max-width: 1000px;
          width: 100%;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          position: relative;
        }

        .signsense-paused-overlay {
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

        .signsense-paused-content {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 0.8rem;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          min-width: 250px;
        }

        .signsense-pause-icon {
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
        }

        .signsense-pause-title {
          color: #ffe0fa;
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .signsense-pause-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          align-items: center;
        }

        .signsense-pause-button-resume,
        .signsense-pause-button-restart,
        .signsense-pause-button-exit {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          color: #fff;
          border: none;
          border-radius: 0.6rem;
          padding: 0.8rem 1.5rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0.3rem;
          min-width: 100px;
        }

        .signsense-pause-button-restart {
          background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
          color: #3a2373;
        }

        .signsense-pause-button-exit {
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
        }

        .signsense-layout {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          width: 100%;
        }

        .signsense-video-container {
          flex: 0 0 auto;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .signsense-video {
          max-width: 340px;
          height: auto;
          border-radius: 1rem;
          background-color: #000;
          object-fit: contain;
        }

        .signsense-correct-answer {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          z-index: 10;
        }

        .signsense-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 300px;
        }

        .signsense-text-display {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          text-align: center;
          margin-bottom: 4rem;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 0.8rem;
          border: 2px solid rgba(255,255,255,0.2);
        }

        .signsense-buttons {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .signsense-button {
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 0.8rem;
          padding: 1rem 2rem;
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .signsense-button-selected {
          background: linear-gradient(135deg, #ffb6e6 0%, #a18cd1 100%);
          border-color: #ffb6e6;
        }

        .signsense-button-correct {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          border-color: #43cea2;
        }

        .signsense-button-wrong {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          border-color: #ff6b6b;
        }

        @media (max-width: 768px) {
          .signsense-game-wrapper {
            padding: 1rem;
            padding-top: 2rem;
          }
          
          .signsense-header {
            max-width: 100%;
            padding: 0.6rem 1rem;
            padding-left: 3rem;
            border-radius: 1rem;
            margin-bottom: 1rem;
          }
          
          .signsense-pause-button {
            width: 2.2rem;
            height: 2.2rem;
            font-size: 1rem;
            min-height: 44px;
          }
          
          .signsense-stats {
            margin-bottom: 0.4rem;
            font-size: 0.85rem;
          }
          
          .signsense-stat-label,
          .signsense-timer-label {
            font-size: 0.7rem;
          }
          
          .signsense-stat-value {
            font-size: 0.95rem;
          }
          
          .signsense-timer {
            font-size: 1.1rem;
          }
          
          .signsense-progress-label {
            font-size: 0.8rem;
            margin-bottom: 0.4rem;
          }
          
          .signsense-progress-bar {
            height: 5px;
            margin-bottom: 0.4rem;
          }
          
          .signsense-game-container {
            padding: 1.5rem;
            border-radius: 1.2rem;
            max-width: 100%;
          }
          
          .signsense-layout {
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
          }
          
          .signsense-video-container {
            flex: none;
            width: 100%;
            justify-content: center;
          }
          
          .signsense-video {
            max-width: 100%;
            width: 100%;
            height: auto;
            border-radius: 0.8rem;
          }
          
          .signsense-correct-answer {
            font-size: 1rem;
            top: 8px;
          }
          
          .signsense-content {
            flex: none;
            width: 100%;
            min-height: auto;
            justify-content: flex-start;
          }
          
          .signsense-text-display {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            padding: 0.8rem;
            border-radius: 0.6rem;
          }
          
          .signsense-buttons {
            gap: 1rem;
            margin-bottom: 1rem;
            flex-direction: column;
            align-items: center;
          }
          
          .signsense-button {
            width: 100%;
            max-width: 200px;
            padding: 0.8rem 1.5rem;
            font-size: 1.1rem;
            min-height: 48px;
            min-width: 120px;
          }
          
          .signsense-paused-content {
            min-width: 200px;
            padding: 1.2rem;
            border-radius: 0.6rem;
          }
          
          .signsense-pause-icon {
            font-size: 2rem;
            margin-bottom: 0.6rem;
          }
          
          .signsense-pause-title {
            font-size: 1rem;
            margin-bottom: 1.2rem;
          }
          
          .signsense-pause-buttons {
            gap: 0.6rem;
          }
          
          .signsense-pause-button-resume,
          .signsense-pause-button-restart,
          .signsense-pause-button-exit {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
            min-width: 80px;
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default SignSenseGame; 