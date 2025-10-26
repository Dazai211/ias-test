import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProgress } from '../library/firebase';
import { auth } from '../library/firebase';
import { lessonStructure } from '../lessons/lessonStructure';
import { useTranslation } from '../Languages/useTranslation';

// Card data for Lessons
const lessonCards = [
  {
    title: 'Fundamentals',
    button: 'Start Learning',
    icon: '🔤',
    gradient: 'linear-gradient(135deg, #2d1e4a 0%, #3a2676 60%, #7b4397 100%)',
    id: 'fundamentals',
  },
  {
    title: 'Everyday Words',
    button: 'Start Learning',
    icon: '🗣️',
    gradient: 'linear-gradient(135deg, #2d1e4a 0%, #3a2676 60%, #7b4397 100%)',
    id: 'everydayWords',
  },
  {
    title: 'Additional Basics',
    button: 'Start Learning',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #2d1e4a 0%, #3a2676 60%, #7b4397 100%)',
    id: 'additionalBasics',
  },
];

const Lessons = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userProgress = await getUserProgress(user.uid);
        setProgress(userProgress || {});
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Helper: Calculate dynamic progress for a main category based on completed contents
  const getMainCategoryProgress = (categoryId) => {
    const structure = lessonStructure[categoryId];
    if (!structure) return 0;
    const subCategories = Object.values(structure.subCategories);
    let totalContents = 0;
    let completedContents = 0;
    const categoryProgressData = progress[categoryId] || {};
    subCategories.forEach(subCat => {
      totalContents += subCat.content.length;
    });
    Object.entries(structure.subCategories).forEach(([subId, subCat]) => {
      const subProgress = categoryProgressData[subId]?.contents || {};
      subCat.content.forEach(item => {
        if (subProgress[item.id]?.completed) completedContents++;
      });
    });
    return totalContents > 0 ? completedContents / totalContents : 0;
  };

  // Helper: Lock logic
  let previousCompleted = true;

  const handleCardClick = (idx) => {
    const categoryIds = lessonCards.map(card => card.id);
    navigate(`/lessons/${categoryIds[idx]}`);
  };

  return (
    <div className="lessons-main-container">
      {/* Left: Header */}
      <div className="lessons-header-section">
        <div className="lessons-title">
          FSL Mastery Zone
        </div>
        <div className="lessons-sub">
          Choose a lesson to begin your sign language journey. Each lesson is uniquely designed to help you grow!
        </div>
      </div>
      {/* Right: Cards */}
      <div className="lessons-cards-container">
        {[...lessonCards, { isSignBox: true }].map((card, idx) => {
          const isCompleted = getMainCategoryProgress(card.id) === 1;
          const isLocked = !previousCompleted && idx !== 0;
          if (!isCompleted) previousCompleted = false;
          const dynamicProgress = getMainCategoryProgress(card.id);

          if (card.isSignBox) {
            return (
              <div
                key="sign-box"
                className="lessons-card sign-box"
              >
                <div className="sign-box-content">
                  IT'S A SIGN
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`lessons-card ${hoveredCard === idx ? 'lessons-card-hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Category Title */}
              <div className="lessons-category-title">
                {t(`lessons.${card.id}.title`) || card.title}
              </div>
              {/* Completed badge */}
              {isCompleted && (
                <span className="lessons-completed-badge">
                  Completed
                </span>
              )}
              {/* Card Row */}
              <div className="lessons-card-row">
                {/* Percentage only (no progress bar) */}
                <span className="lessons-progress-percentage">{Math.round(dynamicProgress * 100)}%</span>
                {/* Button */}
                <button
                  className={`lessons-card-btn ${hoveredButton === idx ? 'lessons-card-btn-hovered' : ''} ${isLocked ? 'lessons-card-btn-locked' : ''}`}
                  onMouseEnter={() => setHoveredButton(idx)}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={isLocked}
                  onClick={() => handleCardClick(idx)}
                >
                  {isLocked ? <span role="img" aria-label="locked">🔒 </span> : null}
                  {t(`lessons.${card.id}.button`) || card.button}
                </button>
              </div>
              {/* Bottom border progress bar */}
              <div className="lessons-progress-bar-container">
                <div 
                  className="lessons-progress-bar-fill"
                  style={{ width: `${Math.round(dynamicProgress * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .lessons-main-container {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-start;
          gap: 80px;
          width: 100%;
          min-height: 80vh;
          padding: 4rem 1rem 2rem 1rem;
          box-sizing: border-box;
        }

        .lessons-header-section {
          min-width: 280px;
          max-width: 400px;
          width: 100%;
          margin-bottom: 0;
        }

        .lessons-title {
          font-size: 2.6rem;
          font-weight: 900;
          color: #fff;
          text-shadow: 0 2px 16px #43cea2cc, 0 1px 0 #185a9d;
          letter-spacing: 2px;
          margin-top: 5.5rem;
          margin-bottom: 1.2rem;
          text-align: left;
        }

        .lessons-sub {
          text-align: center;
          color: #b3c7f7;
          font-size: 1.1rem;
          font-weight: 500;
          opacity: 0.95;
          text-shadow: 0 1px 6px #0006;
          margin-top: 1.5rem;
          margin-bottom: 2rem;
          line-height: 1.5;
          max-width: 90%;
        }

        .lessons-cards-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          justify-items: center;
          align-items: stretch;
          margin-top: 0;
          margin-bottom: 3rem;
          width: 100%;
          max-width: 800px;
        }

        .lessons-card {
          background: linear-gradient(135deg, #2d1e4a 0%, #3a2676 60%, #7b4397 100%), rgba(255,255,255,0.08);
          border-radius: 16px;
          width: 100%;
          max-width: 370px;
          min-width: 0;
          min-height: 130px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          position: relative;
          box-shadow: 0 2px 16px 0 rgba(31, 38, 135, 0.10);
          border: 1.5px solid rgba(255,255,255,0.18);
          color: #fff;
          padding: 0 0 0.4rem 0;
          overflow: visible;
          z-index: 1;
          background-blend-mode: overlay;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s, border 0.18s;
          margin: 0 auto;
        }

        .lessons-card-hovered {
          box-shadow: 0 8px 32px 0 rgba(162, 89, 247, 0.25), 0 0 24px 4px #a259f788;
          border: 2.5px solid #a259f7;
          transform: scale(1.045);
        }

        .sign-box {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 900;
          font-size: 1.5rem;
          letter-spacing: 0.04em;
          color: #fff;
          box-shadow: 0 0 32px 8px #ff6fa188;
          border: 2px solid #fff2;
          height: 100%;
          width: 100%;
          min-height: 140px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #ff6fa1 0%, #7b4397 100%);
        }

        .sign-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 2;
          border-radius: inherit;
          background:
            linear-gradient(
              110deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.10) 45%,
              rgba(255,255,255,0.7) 49%,
              rgba(255,255,255,0.95) 50%,
              rgba(255,255,255,0.7) 51%,
              rgba(255,255,255,0.10) 55%,
              rgba(255,255,255,0) 100%
            ),
            radial-gradient(
              ellipse at 50% 60%,
              rgba(255,255,255,0.10) 0%,
              rgba(255,255,255,0.0) 80%
            );
          background-size: 300% 100%, 100% 100%;
          background-position: -150% 0, center;
          filter: blur(1.2px);
          animation: shine-move 6s cubic-bezier(.4,0,.2,1) infinite;
          opacity: 0.85;
          transition: opacity 0.6s cubic-bezier(.4,0,.2,1);
        }

        @keyframes shine-move {
          0%   { background-position: -150% 0, center; opacity: 0; }
          5%   { opacity: 0.85; }
          95%  { opacity: 0.85; }
          100% { background-position: 150% 0, center; opacity: 0; }
        }

        .sign-box-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .lessons-category-title {
          font-weight: 900;
          font-size: 1.15rem;
          text-align: left;
          color: #fff;
          margin: 1rem 1.5rem 0.4rem 1.5rem;
          letter-spacing: 0.01em;
          text-shadow: 0 2px 8px #0008;
        }

        .lessons-completed-badge {
          position: absolute;
          top: 18px;
          right: 24px;
          background: #FFD700;
          color: #7b4397;
          border-radius: 8px;
          padding: 0.18rem 0.7rem;
          font-weight: 900;
          font-size: 0.85rem;
          box-shadow: 0 2px 8px #43cea255;
          border: 2px solid #fff;
          opacity: 0.92;
          letter-spacing: 0.08em;
          font-family: monospace;
          z-index: 3;
          display: inline-block;
          text-transform: uppercase;
        }

        .lessons-card-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 1.5rem;
          min-height: 70px;
        }

        .lessons-progress-percentage {
          font-weight: 700;
          font-size: 1rem;
          color: #FFD700;
          background: rgba(179, 199, 247, 0.10);
          border-radius: 9px;
          padding: 0.2rem 1.2rem;
          margin-right: 16px;
          letter-spacing: 0.01em;
          box-shadow: 0 2px 8px #FFD70022;
          display: inline-block;
          min-width: 56px;
          text-align: center;
        }

        .lessons-card-btn {
          margin-top: 0.6rem;
          padding: 0.6rem 1.2rem;
          border-radius: 1.2rem;
          border: none;
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 2px 8px #3a267633;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          outline: none;
          min-width: 120px;
        }

        .lessons-card-btn:hover:not(.lessons-card-btn-locked) {
          background: linear-gradient(90deg, #ffb6e6 0%, #a18cd1 100%);
          color: #3a2373;
          transform: scale(1.07);
          box-shadow: 0 6px 24px #a044ff33;
        }

        .lessons-card-btn-locked {
          opacity: 0.5;
          cursor: not-allowed;
        }



        .lessons-progress-bar-container {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 6px;
          background: rgba(179, 199, 247, 0.18);
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
          overflow: hidden;
          z-index: 2;
        }

        .lessons-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD700 0%, #FFB200 100%);
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
          transition: width 0.6s;
        }



        /* Non-conflicting animations using opacity only */
        .lessons-header-section {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }

        .lessons-cards-container {
          opacity: 0;
          animation: fadeIn 1s ease-out 0.2s forwards;
        }

        .lessons-card {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }

        .lessons-card:nth-child(1) { animation-delay: 0.3s; }
        .lessons-card:nth-child(2) { animation-delay: 0.4s; }
        .lessons-card:nth-child(3) { animation-delay: 0.5s; }
        .lessons-card:nth-child(4) { animation-delay: 0.6s; }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 700px) {
          .lessons-main-container {
            flex-direction: column;
            gap: 2.5rem;
            align-items: center;
            padding: 3rem 0.5rem 1.2rem 0.5rem;
          }

          .lessons-header-section {
            min-width: 0;
            max-width: 100%;
            width: 100%;
            margin-bottom: 1.5rem;
          }

          .lessons-title {
            font-size: clamp(1.9rem, 6vw, 2.2rem);
            text-align: center;
             margin-top: 0;
          }

          .lessons-sub {
            text-align: center;
            font-size: clamp(1rem, 3vw, 1.1rem);
              margin-top: 0rem;
          margin-bottom: 0rem;
          }

          .lessons-cards-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            max-width: 100%;
            padding-left: 1.2rem;
            padding-right: 1.2rem;
          }

          .lessons-card {
            margin: 0.5rem auto;
            max-width: 90vw;
            width: 100%;
          }

          .sign-box {
            font-size: clamp(0.8rem, 4vw, 1.1rem);
            min-height: 60px;
            height: 100%;
          }

          .sign-box-content {
            font-size: 0.9rem;
          }

          .lessons-category-title {
            text-align: center;
            margin: 1rem 0.5rem 0.4rem 0.5rem;
            font-size: clamp(1rem, 4vw, 1.15rem);
          }

          .lessons-card-row {
            flex-direction: column;
            align-items: stretch;
            padding: 0 0.5rem;
            min-height: 60px;
            gap: 0.5rem;
          }

          .lessons-completed-badge {
            font-size: 0.55rem;
            padding: 0.08rem 0.32rem;
            top: 8px;
            right: 8px;
          }

          .sign-box {
            min-height: 40px !important;
            font-size: 0.8rem !important;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }

          .sign-box-content {
            font-size: 0.8rem !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .lessons-card-btn {
            font-size: 1.08rem !important;
            padding: 0.85rem 0 !important;
            min-width: 100% !important;
            border-radius: 1.4rem !important;
            margin-top: 0.7rem !important;
            margin-bottom: 0.3rem !important;
            height: 48px !important;
            box-shadow: 0 4px 18px #a044ff22 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Lessons;