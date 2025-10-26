import React from 'react';

const SignQuestResults = ({ results, category, onRestart, onBackToCategories, onSignResults }) => {
  const { score, totalQuestions, percentage, userAnswers = [], quizData = [] } = results;

  const getProgressMessage = () => {
    if (percentage >= 80) {
      return "You may proceed to the next level";
    } else {
      const needed = 80 - percentage;
      return `Need ${needed}% more to unlock the next level`;
    }
  };

  return (
    <div className="signquest-results-wrapper">
      <div className="signquest-results-card">
        <h1 className="signquest-results-title">Quiz Complete!</h1>
        <h2 className="signquest-score-title">Score</h2>
        <div className="signquest-score-circle">{score}</div>
        <div className="signquest-percentage">{percentage}%</div>
        <p className="signquest-score-text">
          You got {score} out of {totalQuestions} questions correct!
        </p>
        <p className="signquest-message">
          {getProgressMessage()}
        </p>
        
        <div className="signquest-button-container">
          <button className="signquest-button" onClick={onRestart}>
            Try Again
          </button>
          <button className="signquest-button" onClick={onBackToCategories}>
            Back to Categories
          </button>
          <button className="signquest-button" onClick={() => onSignResults({ userAnswers, quizData, category })}>
            Sign Results
          </button>
          <button className="signquest-button" onClick={() => window.history.back()}>
            Exit
          </button>
        </div>
      </div>
      
      <style>{`
        .signquest-results-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          min-height: 100vh;
        }

        .signquest-results-card {
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

        .signquest-results-title {
          color: #fff;
          font-weight: 900;
          font-size: 1.5rem;
          margin-bottom: 0.3rem;
          text-align: center;
          letter-spacing: 1px;
        }

        .signquest-score-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffe0fa;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .signquest-score-circle {
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

        .signquest-percentage {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.7rem;
          color: #ffe0fa;
          text-align: center;
        }

        .signquest-score-text {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .signquest-message {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          color: ${percentage >= 80 ? '#43cea2' : '#ff6fa1'};
          font-weight: 700;
        }

        .signquest-button-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 1.2rem;
        }

        .signquest-button {
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

        .signquest-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        @media (max-width: 768px) {
          .signquest-results-wrapper {
            padding: 1rem !important;
            padding-top: 2rem !important;
          }
          
          .signquest-results-card {
            max-width: 100% !important;
            padding: 1.2rem !important;
            border-radius: 1rem !important;
          }
          
          .signquest-results-title {
            font-size: 1.3rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .signquest-score-title {
            font-size: 1rem !important;
            margin-bottom: 0.8rem !important;
          }
          
          .signquest-score-circle {
            width: 42px !important;
            height: 42px !important;
            font-size: 1rem !important;
            margin-bottom: 0.8rem !important;
          }
          
          .signquest-percentage {
            font-size: 0.9rem !important;
            margin-bottom: 0.6rem !important;
          }
          
          .signquest-score-text {
            font-size: 1.1rem !important;
            margin-bottom: 0.8rem !important;
          }
          
          .signquest-message {
            font-size: 0.9rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .signquest-button-container {
            margin-top: 1rem !important;
            gap: 0.5rem !important;
          }
          
          .signquest-button {
            width: 100% !important;
            max-width: 280px !important;
            padding: 0.8rem 1rem !important;
            font-size: 0.9rem !important;
            margin-bottom: 0.5rem !important;
            min-height: 44px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SignQuestResults; 