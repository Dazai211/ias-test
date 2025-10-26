import React, { useState } from 'react';

const SignQuestDetailedResults = ({ userAnswers, quizData, category, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [speedStates, setSpeedStates] = useState({
    slow: false,
    slower: false,
    slowest: false
  });

  const isCorrect = userAnswers[currentIdx] === quizData[currentIdx]?.correctAnswer;

  return (
    <div className="signquest-detailed-wrapper">
      <div className="signquest-detailed-header">
        <button className="signquest-detailed-back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="signquest-detailed-title">Sign Results</h1>
        <div className="signquest-detailed-spacer"></div>
      </div>
      
      <div className="signquest-detailed-card">
        <div className="signquest-detailed-content">
          <div className="signquest-question-counter">
            Question {currentIdx + 1} of {quizData.length}
          </div>
          
          <div className="signquest-answers">
            <div className="signquest-answer-item">
              <div className="signquest-answer-label">Your answer:</div>
              <div className={`signquest-user-answer ${isCorrect ? 'signquest-answer-correct' : 'signquest-answer-wrong'}`}>
                {userAnswers[currentIdx] || 'No answer'}
              </div>
            </div>
            
            <div className="signquest-answer-item">
              <div className="signquest-answer-label">Correct answer:</div>
              <div className="signquest-correct-answer">
                {quizData[currentIdx]?.correctAnswer}
              </div>
            </div>
          </div>
          
          <div className="signquest-navigation">
            <button 
              className="signquest-nav-button"
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
            >
              ←
            </button>
            <button 
              className="signquest-nav-button"
              onClick={() => setCurrentIdx(i => Math.min(quizData.length - 1, i + 1))}
              disabled={currentIdx === quizData.length - 1}
            >
              →
            </button>
          </div>
        </div>
        
        <div className="signquest-video-section">
          {quizData[currentIdx]?.video ? (
            <>
              <video
                ref={(el) => {
                  if (el) {
                    const speeds = { slow: 0.5, slower: 0.25, slowest: 0.1 };
                    if (speedStates.slow) el.playbackRate = speeds.slow;
                    else if (speedStates.slower) el.playbackRate = speeds.slower;
                    else if (speedStates.slowest) el.playbackRate = speeds.slowest;
                    else el.playbackRate = 1.0;
                  }
                }}
                src={quizData[currentIdx].video}
                className="signquest-detailed-video"
                autoPlay
                loop
                muted
              />
              <div className="signquest-speed-controls">
                <button
                  className={`signquest-speed-button ${speedStates.slow ? 'signquest-speed-active' : ''}`}
                  onClick={() => {
                    const newSpeedStates = { slow: false, slower: false, slowest: false };
                    if (speedStates.slow) {
                      // If already active, return to normal speed
                      setSpeedStates(newSpeedStates);
                    } else {
                      // Activate the clicked button
                      newSpeedStates.slow = true;
                      setSpeedStates(newSpeedStates);
                    }
                  }}
                >
                  -1
                </button>
                <button
                  className={`signquest-speed-button ${speedStates.slower ? 'signquest-speed-active' : ''}`}
                  onClick={() => {
                    const newSpeedStates = { slow: false, slower: false, slowest: false };
                    if (speedStates.slower) {
                      // If already active, return to normal speed
                      setSpeedStates(newSpeedStates);
                    } else {
                      // Activate the clicked button
                      newSpeedStates.slower = true;
                      setSpeedStates(newSpeedStates);
                    }
                  }}
                >
                  -2
                </button>
                <button
                  className={`signquest-speed-button ${speedStates.slowest ? 'signquest-speed-active' : ''}`}
                  onClick={() => {
                    const newSpeedStates = { slow: false, slower: false, slowest: false };
                    if (speedStates.slowest) {
                      // If already active, return to normal speed
                      setSpeedStates(newSpeedStates);
                    } else {
                      // Activate the clicked button
                      newSpeedStates.slowest = true;
                      setSpeedStates(newSpeedStates);
                    }
                  }}
                >
                  -3
                </button>
              </div>
            </>
          ) : (
            <div className="signquest-no-video">No video available</div>
          )}
        </div>
      </div>
      
      <style>{`
        .signquest-detailed-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: #fff;
          padding: 2rem;
        }

        .signquest-detailed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 800px;
          margin-bottom: 2rem;
        }

        .signquest-detailed-back-button {
          background: linear-gradient(135deg, #a18cd1 0%, #3a2373 100%);
          color: #fff;
          border: none;
          border-radius: 1rem;
          padding: 0.8rem 1.5rem;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .signquest-detailed-back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(161, 140, 209, 0.3);
        }

        .signquest-detailed-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0;
        }

        .signquest-detailed-spacer {
          width: 100px;
        }

        .signquest-detailed-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2rem;
          padding: 3rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          width: 100%;
          display: flex;
          flex-direction: row;
          gap: 3rem;
          align-items: center;
        }

        .signquest-detailed-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .signquest-question-counter {
          font-size: 1.3rem;
          font-weight: bold;
        }

        .signquest-answers {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .signquest-answer-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .signquest-answer-label {
          font-size: 1.1rem;
          color: #ffe0fa;
          margin-bottom: 0.5rem;
        }

        .signquest-user-answer,
        .signquest-correct-answer {
          font-size: 1.2rem;
          font-weight: bold;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
        }

        .signquest-answer-correct {
          color: #43cea2;
        }

        .signquest-answer-wrong {
          color: #ff6b6b;
        }

        .signquest-correct-answer {
          color: #43cea2;
        }

        .signquest-navigation {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .signquest-nav-button {
          background: linear-gradient(135deg, #a18cd1 0%, #3a2373 100%);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          font-weight: bold;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .signquest-nav-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(161, 140, 209, 0.3);
        }

        .signquest-nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .signquest-video-section {
          flex: 0 0 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .signquest-detailed-video {
          max-width: 350px;
          border-radius: 1rem;
          background: #000;
        }

        .signquest-speed-controls {
          display: flex;
          gap: 0.5rem;
        }

        .signquest-speed-button {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .signquest-speed-active {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
        }

        .signquest-speed-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(67, 206, 162, 0.2);
        }

        .signquest-no-video {
          color: #ffe0fa;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .signquest-detailed-wrapper {
            padding: 1rem !important;
            min-height: 100vh !important;
          }
          
          .signquest-detailed-header {
            flex-direction: column !important;
            gap: 1rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .signquest-detailed-back-button {
            align-self: center !important;
            padding: 0.6rem 1rem !important;
            font-size: 0.9rem !important;
            min-height: 44px !important;
          }
          
          .signquest-detailed-title {
            font-size: 1.8rem !important;
            text-align: center !important;
          }
          
          .signquest-detailed-card {
            flex-direction: column !important;
            padding: 1.5rem !important;
            border-radius: 1.5rem !important;
            gap: 2rem !important;
          }
          
          .signquest-detailed-content {
            gap: 1rem !important;
          }
          
          .signquest-question-counter {
            font-size: 1.1rem !important;
            text-align: center !important;
          }
          
          .signquest-answers {
            gap: 0.8rem !important;
          }
          
          .signquest-answer-label {
            font-size: 1rem !important;
            margin-bottom: 0.3rem !important;
          }
          
          .signquest-user-answer,
          .signquest-correct-answer {
            font-size: 1.1rem !important;
            padding: 0.4rem 0.8rem !important;
          }
          
          .signquest-navigation {
            margin-top: 1.5rem !important;
            gap: 0.8rem !important;
          }
          
          .signquest-nav-button {
            width: 3rem !important;
            height: 3rem !important;
            font-size: 1.4rem !important;
            min-height: 48px !important;
          }
          
          .signquest-video-section {
            flex: none !important;
            width: 100% !important;
            gap: 0.8rem !important;
          }
          
          .signquest-detailed-video {
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            border-radius: 0.8rem !important;
          }
          
          .signquest-speed-controls {
            gap: 0.3rem !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
          
          .signquest-speed-button {
            padding: 0.4rem 0.8rem !important;
            font-size: 0.8rem !important;
            min-height: 36px !important;
            min-width: 44px !important;
          }
          
          .signquest-no-video {
            font-size: 1rem !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SignQuestDetailedResults; 