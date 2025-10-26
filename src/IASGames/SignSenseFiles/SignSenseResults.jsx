import React from 'react';

const SignSenseResults = ({ results, onRestart, onBackToSetup }) => {
  const { score, totalQuestions, percentage } = results;

  const getMessage = () => {
    if (percentage >= 90) return "Excellent! You're a sign language master!";
    if (percentage >= 70) return "Great job! You have solid FSL knowledge!";
    if (percentage >= 50) return "Good work! Keep practicing to improve!";
    return "Keep learning! Practice makes perfect!";
  };

  return (
    <div className="signsense-results-wrapper">
      <div className="signsense-results-card">
        <h1 className="signsense-results-title">Sign Sense Complete!</h1>
        <h2 className="signsense-score-title">Score</h2>
        <div className="signsense-score-circle">{score}</div>
        <div className="signsense-percentage">{percentage}%</div>
        
        <p className="signsense-score-text">
          You got {score} out of {totalQuestions} questions correct!
        </p>
        
        <p className="signsense-message">
          {getMessage()}
        </p>
        
        <div className="signsense-button-container">
          <button className="signsense-button" onClick={onRestart}>
            Try Again
          </button>
          <button className="signsense-button" onClick={onBackToSetup}>
            New Game
          </button>
          <button className="signsense-button" onClick={() => window.history.back()}>
            Exit
          </button>
        </div>
      </div>

      <style>{`
        .signsense-results-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          min-height: 100vh;
        }

        .signsense-results-card {
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

        .signsense-results-title {
          color: #fff;
          font-weight: 900;
          font-size: 1.5rem;
          margin-bottom: 0.3rem;
          text-align: center;
          letter-spacing: 1px;
        }

        .signsense-score-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffe0fa;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .signsense-score-circle {
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

        .signsense-percentage {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.7rem;
          color: #ffe0fa;
          text-align: center;
        }

        .signsense-score-text {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .signsense-message {
          font-size: 1rem;
          margin-bottom: 2rem;
          color: #ffe0fa;
        }

        .signsense-button-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 1.2rem;
        }

        .signsense-button {
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

        .signsense-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        @media (max-width: 768px) {
          .signsense-results-wrapper {
            padding: 1rem;
            padding-top: 2rem;
          }
          
          .signsense-results-card {
            max-width: 100%;
            padding: 1.2rem;
            border-radius: 1rem;
          }
          
          .signsense-results-title {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
          }
          
          .signsense-score-title {
            font-size: 1rem;
            margin-bottom: 0.8rem;
          }
          
          .signsense-score-circle {
            width: 42px;
            height: 42px;
            font-size: 1rem;
            margin-bottom: 0.8rem;
          }
          
          .signsense-percentage {
            font-size: 0.9rem;
            margin-bottom: 0.6rem;
          }
          
          .signsense-score-text {
            font-size: 1.1rem;
            margin-bottom: 0.8rem;
          }
          
          .signsense-message {
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }
          
          .signsense-button-container {
            margin-top: 1rem;
            gap: 0.5rem;
          }
          
          .signsense-button {
            width: 100%;
            max-width: 280px;
            padding: 0.8rem 1rem;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default SignSenseResults; 