import React from 'react';

const SignFlipResults = ({ results, difficulty, onRestart, onNewGame, onBackToLevels }) => {
  const { score, totalPairs, percentage, timeLeft, win, completed } = results;

  const getCompletionMessage = () => {
    if (completed) {
      return "Matched all! You may proceed to the next level";
    } else {
      return "Match all pairs to go to the next level";
    }
  };

  return (
    <div className="sign-flip-results-container">
      <div className="sign-flip-results-card">
        <h1 className="sign-flip-results-title">Sign Flip Complete!</h1>
        <h2 className="sign-flip-results-score-title">Score</h2>
        <div className="sign-flip-results-score-circle">{score}</div>
        
        <p className="sign-flip-results-summary">
          You matched {score} out of {totalPairs} pairs!
        </p>
        
        {timeLeft !== null && (
          <p className="sign-flip-results-time">
            Time remaining: {timeLeft} seconds
          </p>
        )}
        
        <p className="sign-flip-results-completion-message">
          {getCompletionMessage()}
        </p>
        
        <div className="sign-flip-results-buttons">
          <button className="sign-flip-results-button" onClick={onRestart}>
            Try Again
          </button>
          <button className="sign-flip-results-button" onClick={onBackToLevels}>
            Back to Levels
          </button>
          <button className="sign-flip-results-button" onClick={onNewGame}>
            Back to Difficulty
          </button>
          <button className="sign-flip-results-button" onClick={() => window.history.back()}>
            Exit
          </button>
        </div>
      </div>

      <style>{`
        .sign-flip-results-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          min-height: 100vh;
        }

        .sign-flip-results-card {
          background: rgba(255,255,255,0.1);
          border-radius: 1.2rem;
          padding: 1.5rem;
          max-width: 380px;
          width: 100%;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          text-align: center;
          color: #fff;
        }

        .sign-flip-results-title {
          color: #fff;
          font-weight: 900;
          font-size: 1.5rem;
          margin-bottom: 0.3rem;
          text-align: center;
          letter-spacing: 1px;
        }

        .sign-flip-results-score-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffe0fa;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .sign-flip-results-score-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 900;
          color: #fff;
          margin: 0 auto 1rem auto;
          box-shadow: 0 4px 16px rgba(67, 206, 162, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.18);
        }

        .sign-flip-results-summary {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .sign-flip-results-time {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: #ffe0fa;
        }

        .sign-flip-results-completion-message {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          color: ${completed ? '#43cea2' : '#ff6fa1'};
          font-weight: 700;
        }

        .sign-flip-results-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 1.2rem;
        }

        .sign-flip-results-button {
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          padding: 0.7rem 1.2rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(255, 111, 161, 0.18);
          margin-bottom: 0.7rem;
          width: 180px;
        }

        .sign-flip-results-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }
      `}</style>
    </div>
  );
};

export default SignFlipResults; 