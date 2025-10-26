import React, { useState, useMemo, useEffect } from 'react';
import { alphabetQuizData } from './SignQuestData/alphabetQuiz';
import { numbersQuizData } from './SignQuestData/numbersQuiz';
import { commonQuestionsQuizData } from './SignQuestData/commonQuestionsQuiz';
import { simplePhrasesQuizData } from './SignQuestData/simplePhrasesQuiz';
import { greetingsQuizData } from './SignQuestData/greetingsQuiz';
import { daysMonthsQuizData } from './SignQuestData/daysMonthsQuiz';
import { colorsQuizData } from './SignQuestData/colorsQuiz';
import { familyQuizData } from './SignQuestData/familyQuiz';
import { objectsQuizData } from './SignQuestData/objectsQuiz';
import { animalsQuizData } from './SignQuestData/animalsQuiz';
import { foodDrinksQuizData } from './SignQuestData/foodDrinksQuiz';
import { emotionsQuizData } from './SignQuestData/emotionsQuiz';
import { basicActionsQuizData } from './SignQuestData/basicActionsQuiz';
import { questionWordsQuizData } from './SignQuestData/questionWordsQuiz';
import { placesQuizData } from './SignQuestData/placesQuiz';
import { timeWeatherQuizData } from './SignQuestData/timeWeatherQuiz';
import { bodyPartsQuizData } from './SignQuestData/bodyPartsQuiz';
import { transportationDirectionsQuizData } from './SignQuestData/transportationDirectionsQuiz';
import { pronounsQuizData } from './SignQuestData/pronounsQuiz';
import { commonVerbsQuizData } from './SignQuestData/commonVerbsQuiz';
import { oppositesQuizData } from './SignQuestData/oppositesQuiz';
import { shapesSizesQuizData } from './SignQuestData/shapesSizesQuiz';
import { householdItemsQuizData } from './SignQuestData/householdItemsQuiz';
import { communicationModesQuizData } from './SignQuestData/communicationModesQuiz';
import { clothingAccessoriesQuizData } from './SignQuestData/clothingAccessoriesQuiz';
import { paymentModesQuizData } from './SignQuestData/paymentModesQuiz';
import { socialRelationshipsQuizData } from './SignQuestData/socialRelationshipsQuiz';
import { emergencySignsQuizData } from './SignQuestData/emergencySignsQuiz';
import { prepositionsLocationsQuizData } from './SignQuestData/prepositionsLocationsQuiz';
import { basicCommandsQuizData } from './SignQuestData/basicCommandsQuiz';
import { useSignQuestTranslation } from '../../Languages/useSignQuestTranslation'; // Import the custom translation hook for SignQuest

// Helper to shuffle an array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SignQuestGame = ({ category, onGameComplete, onBackToCategories }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [autoProceedTimer, setAutoProceedTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [videoTimerPaused, setVideoTimerPaused] = useState(false);
  const [videoRef, setVideoRef] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const { t } = useSignQuestTranslation(); // Use the translation hook for options/answers

  // Video control functions
  const handleVideoError = () => {
    console.error('Video error occurred');
    setVideoLoading(false);
  };

  const handleVideoLoad = () => {
    // Video loaded successfully
    setVideoLoading(false);
  };

  // Get quiz data based on category
  const getQuizData = () => {
    switch (category) {
      case 'alphabet':
        return alphabetQuizData;
      case 'numbers':
        return numbersQuizData;
      case 'commonQuestions':
        return commonQuestionsQuizData;
      case 'simplePhrases':
        return simplePhrasesQuizData;
      case 'greetings':
        return greetingsQuizData;
      case 'colors':
        return colorsQuizData;
      case 'family':
        return familyQuizData;
      case 'animals':
        return animalsQuizData;
      case 'daysMonths':
        return daysMonthsQuizData;
      case 'foodDrinks':
        return foodDrinksQuizData;
      case 'emotions':
        return emotionsQuizData;
      case 'basicActions':
        return basicActionsQuizData;
      case 'questionWords':
        return questionWordsQuizData;
      case 'places':
        return placesQuizData;
      case 'timeWeather':
        return timeWeatherQuizData;
      case 'bodyParts':
        return bodyPartsQuizData;
      case 'transportationDirections':
        return transportationDirectionsQuizData;
      case 'pronouns':
        return pronounsQuizData;
      case 'commonVerbs':
        return commonVerbsQuizData;
      case 'opposites':
        return oppositesQuizData;
      case 'shapesSizes':
        return shapesSizesQuizData;
      case 'householdItems':
        return householdItemsQuizData;
      case 'communicationModes':
        return communicationModesQuizData;
      case 'clothingAccessories':
        return clothingAccessoriesQuizData;
      case 'paymentModes':
        return paymentModesQuizData;
      case 'socialRelationships':
        return socialRelationshipsQuizData;
      case 'emergencySigns':
        return emergencySignsQuizData;
      case 'prepositionsLocations':
        return prepositionsLocationsQuizData;
      case 'basicCommands':
        return basicCommandsQuizData;
      default:
        return alphabetQuizData; // fallback to alphabet for now
    }
  };

  // Shuffle options for each question ONCE per game
  const shuffledQuizData = useMemo(() => {
    return getQuizData().map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    // eslint-disable-next-line
  }, [category]);

  const quizData = shuffledQuizData;
  const currentQuestion = quizData[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

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
    setTimeLeft(10);
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
    
    // Store user answer
    setUserAnswers(prev => [...prev, answer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setAutoProceedTimer(null);
      setTimeLeft(10);
      setTimerActive(true);
    } else {
      // Game completed
      const results = {
        score,
        totalQuestions: quizData.length,
        percentage: Math.round((score / quizData.length) * 100),
        userAnswers,
        quizData
      };
      onGameComplete(results);
    }
  };

  // Handler to restart the game
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowAnswer(false);
    setAutoProceedTimer(null);
    setTimeLeft(10);
    setTimerActive(true);
    setIsPaused(false);
    setUserAnswers([]);
    setVideoTimerPaused(false);
    setVideoLoading(true);
  };



  return (
    <div className="signquest-game-wrapper">
      <div className="signquest-header-container">
        {/* Pause Button, vertically centered with stats */}
        <button
          onClick={handlePause}
          className="signquest-pause-button"
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>

        <div className="signquest-stats-container">
          <div className="signquest-stat-item">
            <span className="signquest-stat-label">Question</span>
            <span className="signquest-stat-value">{currentQuestionIndex + 1} / {quizData.length}</span>
          </div>
          <div className="signquest-timer-container">
            <span className="signquest-timer-label">Time</span>
            <span className={`signquest-timer ${timeLeft <= 5 ? 'signquest-timer-warning' : ''}`}>{timeLeft}s</span>
          </div>
          <div className="signquest-stat-item">
            <span className="signquest-stat-label">Score</span>
            <span className="signquest-stat-value">{score}</span>
          </div>
        </div>
        
        <div className="signquest-progress-container">
          <div className="signquest-progress-label">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="signquest-progress-bar">
            <div className="signquest-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="signquest-game-container">
        {/* Pause Overlay */}
        {isPaused && (
          <div className="signquest-pause-overlay">
            <div className="signquest-pause-content">
              <div className="signquest-pause-icon">⏸️</div>
              <div className="signquest-pause-title">Game Paused</div>
              <div className="signquest-pause-buttons">
                <button
                  className="signquest-pause-btn signquest-pause-btn-resume"
                  onClick={() => setIsPaused(false)}
                >
                  Resume
                </button>
                <button
                  className="signquest-pause-btn signquest-pause-btn-restart"
                  onClick={handleRestart}
                >
                  Restart
                </button>
                <button
                  className="signquest-pause-btn signquest-pause-btn-back"
                  onClick={onBackToCategories}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="signquest-qa-row">
          <div className="signquest-video-col">
                         <video
               className="signquest-video"
               src={currentQuestion.video}
               autoPlay
               loop
               muted
               controls={false}
               preload="metadata"
               crossOrigin="anonymous"
               loading="lazy"
               poster="/Loading/Loading.png"
               ref={setVideoRef}
               onPlay={() => setVideoPlaying(true)}
               onPause={() => setVideoPlaying(false)}
               onError={handleVideoError}
               onLoadedData={handleVideoLoad}
             />
          </div>
          <div className="signquest-options-col">
            <div className="signquest-question">{currentQuestion.question}</div>
            <div className="signquest-options-container">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = showAnswer && option === currentQuestion.correctAnswer;
                const isWrong = showAnswer && isSelected && option !== currentQuestion.correctAnswer;
                return (
                  <button
                    key={option}
                    className={`signquest-option-button ${isSelected ? 'signquest-option-selected' : ''} ${isCorrect ? 'signquest-option-correct' : ''} ${isWrong ? 'signquest-option-wrong' : ''}`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showAnswer || isPaused}
                  >
                    {/* Use t() for Filipino translation, fallback to English if not found */}
                    {t('words.' + option)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .signquest-game-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          min-height: 100vh;
        }

        

        .signquest-header-container {
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

        .signquest-pause-button {
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

        .signquest-stats-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .signquest-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .signquest-stat-label {
          font-size: 0.75rem;
          color: #ffe0fa;
          font-weight: 500;
        }

        .signquest-stat-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
        }

        .signquest-timer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .signquest-timer-label {
          font-size: 0.7rem;
          color: #ffe0fa;
          font-weight: 500;
        }

        .signquest-timer {
          font-size: 1.2rem;
          font-weight: 900;
          color: #43cea2;
          text-shadow: 0 0 6px #43cea2;
          transition: all 0.3s ease;
        }

        .signquest-timer-warning {
          color: #ff6b6b;
          text-shadow: 0 0 6px #ff6b6b;
          animation: blink 1s infinite;
        }

        .signquest-progress-container {
          width: 100%;
        }

        .signquest-progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.3rem;
          font-size: 0.7rem;
          color: #ffe0fa;
        }

        .signquest-progress-bar {
          width: 100%;
          height: 6px;
          background-color: rgba(255,255,255,0.18);
          border-radius: 3px;
          margin-bottom: 0.5rem;
          overflow: hidden;
        }

        .signquest-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
          transition: width 0.3s ease;
        }

        .signquest-game-container {
          background: rgba(255,255,255,0.1);
          border-radius: 2rem;
          padding: 3rem;
          max-width: 800px;
          width: 100%;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          position: relative;
        }

        .signquest-pause-overlay {
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

        .signquest-pause-content {
          background: rgba(158, 200, 147, 0.1);
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .signquest-pause-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .signquest-pause-title {
          color: #ffe0fa;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .signquest-pause-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
          align-items: center;
        }

        .signquest-pause-btn {
          min-width: 140px;
          padding: 0.7rem 2.2rem;
          border-radius: 1rem;
          border: none;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(67, 206, 162, 0.18);
          transition: background 0.2s, transform 0.15s;
          display: block;
        }

        .signquest-pause-btn-resume {
          background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
          color: #fff;
        }

        .signquest-pause-btn-restart {
          background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
          color: #3a2373;
        }

        .signquest-pause-btn-back {
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
        }

        .signquest-qa-row {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 2.5rem;
          width: 100%;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .signquest-video-col {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .signquest-video {
          max-width: 340px;
          height: auto;
          border-radius: 1rem;
          background-color: #000;
          object-fit: contain;
        }

        .signquest-options-col {
          flex: 1 1 320px;
          min-width: 220px;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
        }

        .signquest-question {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 2rem;
          text-align: center;
        }

        .signquest-options-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .signquest-option-button {
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 1rem;
          padding: 0.7rem 1rem;
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .signquest-option-selected {
          background: linear-gradient(135deg, #ffb6e6 0%, #a18cd1 100%);
          border-color: #ffb6e6;
        }

        .signquest-option-correct {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          border-color: #43cea2;
        }

        .signquest-option-wrong {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          border-color: #ff6b6b;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .signquest-game-wrapper {
            padding: clamp(1rem, 4vw, 2rem) !important;
          }
          
          
          
          .signquest-game-container {
            border-radius: clamp(1rem, 3vw, 2rem) !important;
            padding: clamp(1.5rem, 4vw, 3rem) !important;
            max-width: min(800px, 95vw) !important;
          }
          
          .signquest-question {
            font-size: clamp(1.2rem, 4vw, 1.8rem) !important;
            margin-bottom: clamp(1rem, 3vw, 2rem) !important;
          }
          
          .signquest-video {
            max-width: min(340px, 90vw) !important;
            width: 100% !important;
            border-radius: clamp(0.5rem, 2vw, 1rem) !important;
          }
          
          .signquest-options-container {
            gap: clamp(1rem, 3vw, 1.5rem) !important;
            margin-bottom: clamp(1rem, 3vw, 2rem) !important;
          }
          
          .signquest-option-button {
            border-radius: clamp(0.5rem, 2vw, 1rem) !important;
            padding: clamp(0.5rem, 2vw, 0.7rem) clamp(0.8rem, 3vw, 1rem) !important;
            font-size: clamp(0.9rem, 3vw, 1.05rem) !important;
          }
          
          .signquest-header-container {
            border-radius: clamp(0.8rem, 2vw, 1.2rem) !important;
            padding: clamp(0.5rem, 2vw, 0.7rem) clamp(0.8rem, 3vw, 1.1rem) !important;
            margin-bottom: clamp(0.8rem, 2vw, 1.2rem) !important;
            max-width: min(520px, 95vw) !important;
            padding-left: clamp(2.5rem, 8vw, 3.5rem) !important;
          }
          
          .signquest-stats-container {
            font-size: clamp(0.8rem, 2.5vw, 0.95rem) !important;
            gap: clamp(0.5rem, 2vw, 1rem) !important;
          }
          
          .signquest-stat-item {
            min-width: 0 !important;
            flex: 1 !important;
          }
          
          .signquest-stat-label {
            font-size: clamp(0.6rem, 2vw, 0.75rem) !important;
            text-align: center !important;
          }
          
          .signquest-stat-value {
            font-size: clamp(0.9rem, 2.5vw, 1.05rem) !important;
            text-align: center !important;
          }
          
          .signquest-timer {
            font-size: clamp(1rem, 3vw, 1.2rem) !important;
          }
          
          .signquest-timer-label {
            font-size: clamp(0.6rem, 2vw, 0.7rem) !important;
            text-align: center !important;
          }
          
          .signquest-pause-button {
            left: clamp(0.3rem, 2vw, 0.5rem) !important;
            width: clamp(2rem, 6vw, 2.5rem) !important;
            height: clamp(2rem, 6vw, 2.5rem) !important;
            font-size: clamp(0.9rem, 3vw, 1.2rem) !important;
          }
          
          .signquest-qa-row {
            gap: clamp(1rem, 4vw, 2.5rem) !important;
            margin-bottom: clamp(1rem, 3vw, 2rem) !important;
          }
          
          .signquest-video-col {
            min-width: 280px !important;
            max-width: 100% !important;
          }
          
          .signquest-options-col {
            flex: 1 1 clamp(280px, 50vw, 420px) !important;
            min-width: 280px !important;
            max-width: 100% !important;
          }
          
          .signquest-pause-overlay {
            border-radius: clamp(0.5rem, 2vw, 1rem) !important;
          }
          
          .signquest-pause-content {
            padding: clamp(1.5rem, 4vw, 2rem) !important;
            border-radius: clamp(0.8rem, 2vw, 1rem) !important;
            max-width: min(400px, 90vw) !important;
            width: 100% !important;
          }
          
          .signquest-pause-icon {
            font-size: clamp(2rem, 8vw, 3rem) !important;
            margin-bottom: clamp(0.8rem, 2vw, 1rem) !important;
          }
          
          .signquest-pause-title {
            font-size: clamp(1.2rem, 4vw, 1.5rem) !important;
          }
          
          .signquest-pause-buttons {
            gap: clamp(0.8rem, 2vw, 1rem) !important;
            margin-top: clamp(1.2rem, 3vw, 1.5rem) !important;
          }
          
          .signquest-pause-btn {
            min-width: clamp(120px, 25vw, 140px) !important;
            padding: clamp(0.5rem, 2vw, 0.7rem) clamp(1.5rem, 4vw, 2.2rem) !important;
            border-radius: clamp(0.8rem, 2vw, 1rem) !important;
            font-size: clamp(0.9rem, 2.5vw, 1.05rem) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SignQuestGame; 