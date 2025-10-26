import React, { useState } from 'react';

// Question count options
const questionCountOptions = [
  { count: 10, label: 'Quick Test', time: '~2 min', color: '#43cea2' },
  { count: 20, label: 'Short Quiz', time: '~4 min', color: '#ff6fa1' },
  { count: 30, label: 'Medium Quiz', time: '~6 min', color: '#a18cd1' },
  { count: 40, label: 'Long Quiz', time: '~8 min', color: '#fbc2eb' },
  { count: 50, label: 'Full Test', time: '~10 min', color: '#667eea' }
];

const SignSenseSetup = ({ onStartGame, onBack }) => {
  const [selectedCount, setSelectedCount] = useState(null);

  return (
    <div className="signsense-setup-wrapper">
      <h1 className="signsense-setup-title">Sign Sense</h1>
      <p className="signsense-setup-subtitle">Test Your Sign Recognition Skills</p>
      <div className="signsense-setup-description">
        Watch the video and decide if it matches the displayed text. 
        Choose <strong>True</strong> if the video matches the text, or <strong>False</strong> if it doesn't.
      </div>
      <div className="signsense-options-container">
        {questionCountOptions.map((option) => (
          <div
            key={option.count}
            className={`signsense-option-card ${selectedCount === option.count ? 'signsense-option-selected' : ''}`}
            style={{ '--option-color': option.color, position: 'relative' }}
            onClick={() => setSelectedCount(option.count)}
          >
            <div className="signsense-option-count">{option.count}</div>
            <div className="signsense-option-label">{option.label}</div>
            <div className="signsense-option-time">{option.time}</div>
            {selectedCount === option.count && (
              <div className="signsense-start-overlay">
                <button
                  className="signsense-start-overlay-button"
                  onClick={e => { e.stopPropagation(); onStartGame(selectedCount); }}
                >
                  Start
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="signsense-button-container">
        <button
          className="signsense-back-button"
          onClick={onBack}
        >
          Back
        </button>
      </div>
      <style>{`
        .signsense-setup-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          min-height: 100vh;
        }
        .signsense-setup-title {
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
        .signsense-setup-subtitle {
          color: #ffe0fa;
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 2rem;
          text-align: center;
        }
        .signsense-setup-description {
          color: #fff;
          font-size: 1rem;
          text-align: center;
          max-width: 600px;
          margin-bottom: 3rem;
          line-height: 1.6;
        }
        .signsense-options-container {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 2rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .signsense-option-card {
          background: rgba(255,255,255,0.1);
          border-radius: 2rem;
          padding: 2rem 1.5rem;
          min-width: 180px;
          max-width: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 2px solid rgba(255,255,255,0.3);
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .signsense-option-card:hover {
          box-shadow: 0 8px 32px #a18cd144;
          transform: scale(1.04);
        }
        .signsense-option-selected {
          background: linear-gradient(135deg, var(--option-color) 0%, #3a2373 100%);
          border-color: var(--option-color);
          box-shadow: 0 8px 32px color-mix(in srgb, var(--option-color) 25%, transparent);
        }
        .signsense-option-count {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }
        .signsense-option-label {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .signsense-option-time {
          font-size: 0.9rem;
          color: #ffe0fa;
          font-weight: 500;
        }
        .signsense-button-container {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 3rem;
        }
        .signsense-back-button {
          padding: 0.8rem 2rem;
          border-radius: 1.2rem;
          border: none;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(255, 111, 161, 0.3);
          transition: all 0.3s ease;
        }
        .signsense-back-button:hover {
          box-shadow: 0 6px 24px rgba(255, 111, 161, 0.4);
          transform: scale(1.05);
        }
        .signsense-start-overlay {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: auto;
          background: transparent;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          border-radius: 0 0 2rem 2rem;
          z-index: 2;
          padding-bottom: 1.2rem;
        }
        .signsense-start-overlay-button {
          width: 90px;
          height: 36px;
          padding: 0;
          border-radius: 1.2rem;
          border: none;
          background: linear-gradient(135deg, #a18cd1 0%, #6f51a1 100%);
          color: #fff;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(161, 140, 209, 0.3);
          transition: background 0.2s, transform 0.15s;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .signsense-start-overlay-button:hover {
          background: linear-gradient(135deg, #c471f5 0%, #a18cd1 100%);
          color: #3a2373;
          transform: scale(1.07);
          box-shadow: 0 6px 24px rgba(161, 140, 209, 0.28);
        }
        @media (max-width: 768px) {
          .signsense-setup-wrapper {
            padding: 1rem;
          }
          .signsense-setup-title {
            font-size: 2rem;
          }
          .signsense-setup-subtitle {
            font-size: 1rem;
          }
          .signsense-setup-description {
            font-size: 0.9rem;
            margin-bottom: 2rem;
          }
          .signsense-options-container {
            gap: 1rem;
            margin-top: 1rem;
          }
          .signsense-option-card {
            min-width: 140px;
            max-width: 160px;
            padding: 1.5rem 1rem;
          }
          .signsense-option-count {
            font-size: 2rem;
          }
          .signsense-option-label {
            font-size: 1rem;
          }
          .signsense-option-time {
            font-size: 0.8rem;
          }
          .signsense-button-container {
            margin-top: 2rem;
            gap: 0.8rem;
          }
          .signsense-back-button {
            padding: 0.7rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SignSenseSetup; 