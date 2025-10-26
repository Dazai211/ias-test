import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignQuestTranslation } from '../../Languages/useSignQuestTranslation';

// ===== PROGRESSIVE GAME SYSTEM =====
// This component now receives categories as props instead of managing them internally
// This allows the parent component (SignQuest.jsx) to control which categories are shown
const SignQuestCategories = ({ onCategorySelect, categories = [], loading = false }) => {
  const [hovered, setHovered] = useState(null);
  const [centeredIdx, setCenteredIdx] = useState(0);
  const [backHover, setBackHover] = useState(false);
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [infoHover, setInfoHover] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  // Hover state for the three buttons
  const [leftHover, setLeftHover] = useState(false);
  const [rightHover, setRightHover] = useState(false);
  const [startHover, setStartHover] = useState(false);

  const { t } = useSignQuestTranslation(); // Custom hook for SignQuest translations

  // On scroll, find the card closest to the center
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !cardRefs.current.length) return;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      let minDist = Infinity;
      let closestIdx = 0;
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(containerCenter - cardCenter);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });
      setCenteredIdx(closestIdx);
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      // Initial check
      handleScroll();
    }
    window.addEventListener('resize', handleScroll);
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleBack = () => navigate(-1);

  // Scroll left/right by one card
  const scrollByCard = (dir) => {
    if (!containerRef.current) return;
    const cardWidth = 130 + 32; // card + gap
    containerRef.current.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  return (
    <div className="signquest-categories-wrapper">
      <h2 className="signquest-title">Sign Quest</h2>
      <div className="signquest-subtitle-container">
        <div className="signquest-subtitle">Select a category to start:</div>
        <button 
          className={`signquest-info-btn ${infoHover ? 'signquest-info-btn-hover' : ''}`}
          onClick={() => setShowInfoOverlay(true)}
          onMouseEnter={() => setInfoHover(true)}
          onMouseLeave={() => setInfoHover(false)}
          aria-label="Game information"
        >
          !
        </button>
      </div>
      <div className="signquest-container">
        <div className="signquest-container-glow"></div>
        <div className="signquest-cards-container" ref={containerRef}>
          <div className="signquest-spacer" />
          {loading ? (
            <div className="signquest-loading">Loading...</div>
          ) : (
                         categories.map((category, i) => (
               <div
                 key={category.id}
                 ref={el => cardRefs.current[i] = el}
                 className={`signquest-card ${hovered === category.id ? 'signquest-card-hover' : ''} ${centeredIdx === i ? 'signquest-card-selected' : ''} ${!category.isUnlocked ? 'signquest-card-locked' : ''}`}
                 onMouseEnter={() => setHovered(category.id)}
                 onMouseLeave={() => setHovered(null)}
                 onClick={() => {
                   if (!containerRef.current || !cardRefs.current[i]) return;
                   const container = containerRef.current;
                   const card = cardRefs.current[i];
                   const containerRect = container.getBoundingClientRect();
                   const cardRect = card.getBoundingClientRect();
                   const scrollLeft = container.scrollLeft;
                   const containerCenter = containerRect.left + containerRect.width / 2;
                   const cardCenter = cardRect.left + cardRect.width / 2;
                   const diff = cardCenter - containerCenter;
                   container.scrollTo({ left: scrollLeft + diff, behavior: 'smooth' });
                 }}
               >
                <span className="signquest-card-icon">
                  {typeof category.icon === 'string' && category.icon.endsWith('.svg') ? (
                    <img src={category.icon} alt={category.name} style={{ width: 32, height: 32, display: 'block' }} />
                  ) : (
                    category.icon
                  )}
                </span>
                                 <span className="signquest-card-text">
                   {t('categories.' + category.name)}
                 </span>
                 {!category.isUnlocked && (
                   <div className="signquest-lock-overlay">
                     <span className="signquest-lock-icon">🔒</span>
                   </div>
                 )}
               </div>
            ))
          )}
          <div className="signquest-spacer" />
        </div>
      </div>
      {/* Enhanced button container */}
      <div className="signquest-button-container">
        <button
          className={`signquest-arrow-btn ${leftHover ? 'signquest-arrow-btn-hover' : ''}`}
          onClick={() => scrollByCard(-1)}
          aria-label="Scroll left"
          onMouseEnter={() => setLeftHover(true)}
          onMouseLeave={() => setLeftHover(false)}
        >
          &#60;
        </button>
        <button
          className={`signquest-start-btn ${startHover ? 'signquest-start-btn-hover' : ''}`}
          onClick={() => onCategorySelect(categories[centeredIdx]?.id)}
          onMouseEnter={() => setStartHover(true)}
          onMouseLeave={() => setStartHover(false)}
          disabled={loading || !categories[centeredIdx] || !categories[centeredIdx]?.isUnlocked}
        >
          Start
        </button>
        <button
          className={`signquest-arrow-btn ${rightHover ? 'signquest-arrow-btn-hover' : ''}`}
          onClick={() => scrollByCard(1)}
          aria-label="Scroll right"
          onMouseEnter={() => setRightHover(true)}
          onMouseLeave={() => setRightHover(false)}
        >
          &#62;
        </button>
      </div>
      <button
        className={`signquest-back-btn ${backHover ? 'signquest-back-btn-hover' : ''}`}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        onClick={handleBack}
      >
        Back
      </button>

      <style>{`
        .signquest-categories-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
        }

        .signquest-title {
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

        .signquest-subtitle {
          color: #ffe0fa;
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 0;
          margin-top: 0.8rem;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          opacity: 0.9;
        }

        .signquest-container {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 2rem;
          margin: 2rem auto 0 auto;
          max-width: calc(4.3 * 150px + 3 * 2.2rem + 4rem);
          width: fit-content;
          position: relative;
          overflow: hidden;
        }

        .signquest-container-glow {
          display: none;
        }

        .signquest-cards-container {
          display: flex;
          justify-content: flex-start;
          align-items: stretch;
          gap: 2.2rem;
          margin-top: 3rem;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 3rem;
          padding-top: 1rem;
          min-height: 220px;
          scrollbar-width: thin;
          scrollbar-color: #667eea #2d1e4a;
          max-width: calc(4.3 * 130px + 3 * 2.2rem);
          width: 100%;
          margin: 2rem auto 0 auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
        }

        .signquest-cards-container::-webkit-scrollbar {
          height: 8px;
        }

        .signquest-cards-container::-webkit-scrollbar-track {
          background: rgba(45, 30, 74, 0.2);
          border-radius: 4px;
        }

        .signquest-cards-container::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 4px;
        }

        .signquest-cards-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #764ba2, #f093fb);
        }

        .signquest-spacer {
          min-width: calc(50% - 65px);
          scroll-snap-align: center;
        }

        .signquest-card {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.8rem 1.2rem;
          margin: 0.75rem;
          min-width: 150px;
          max-width: 180px;
          flex: 0 0 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          scroll-snap-align: center;
        }

        .signquest-card-hover,
        .signquest-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.12);
          z-index: 2;
        }

        .signquest-card-selected {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
          z-index: 3;
        }

        .signquest-card-selected .signquest-card-icon img {
          transform: translateY(-40%) scale(1.3);
          box-shadow: 0 16px 40px 0 rgba(102, 126, 234, 0.6);
          filter: drop-shadow(0 0 18px #a18cd1) drop-shadow(0 4px 16px #f093fb);
          z-index: 10;
          transition: transform 0.45s cubic-bezier(.4,2,.3,1), box-shadow 0.45s, filter 0.45s;
        }
        .signquest-card-icon img {
          transition: transform 0.45s cubic-bezier(.4,2,.3,1), box-shadow 0.45s, filter 0.45s;
        }

        .signquest-card-icon {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .signquest-card-text {
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
          text-align: center;
          line-height: 1.2;
        }

        .signquest-button-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 3rem;
          background: linear-gradient(135deg, rgba(45, 30, 74, 0.9) 0%, rgba(74, 44, 122, 0.8) 100%);
          border-radius: 2.5rem;
          box-shadow: 0 8px 32px 0 rgba(45, 30, 74, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          padding: 1.5rem 3rem;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .signquest-arrow-btn {
          background: linear-gradient(135deg, #2d1e4a 0%, #4a2c7a 50%, #7b4397 100%);
          color: #fff;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          font-size: 1.6rem;
          font-weight: 900;
          box-shadow: 0 4px 16px rgba(45, 30, 74, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          cursor: pointer;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.2);
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .signquest-arrow-btn-hover,
        .signquest-arrow-btn:hover {
          background: linear-gradient(135deg, #4a2c7a 0%, #7b4397 50%, #667eea 100%);
          transform: scale(1.1);
          box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .signquest-start-btn {
          margin: 0 2.5rem;
          padding: 1rem 3rem;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          font-weight: 800;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 111, 161, 0.18);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          display: block;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          border: none;
          letter-spacing: 1px;
        }

        .signquest-start-btn-hover,
        .signquest-start-btn:hover {
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        .signquest-back-btn {
          margin-top: 3rem;
          padding: 0.9rem 2.5rem;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 111, 161, 0.18);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          display: block;
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          border: none;
        }

        .signquest-back-btn-hover,
        .signquest-back-btn:hover {
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        .signquest-loading {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
          padding: 2rem;
          width: 100%;
        }

        .signquest-start-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .signquest-card-locked {
          opacity: 0.5;
          filter: grayscale(0.8);
          cursor: not-allowed;
          position: relative;
        }

        .signquest-card-locked:hover {
          transform: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
        }

        .signquest-lock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .signquest-lock-icon {
          font-size: 2rem;
          color: #fff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        @keyframes pulse {
          0%, 100% { 
            box-shadow: 0 0 40px 12px rgba(102, 126, 234, 0.6), 0 20px 60px 0 rgba(240, 147, 251, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          }
          50% { 
            box-shadow: 0 0 50px 16px rgba(102, 126, 234, 0.8), 0 25px 70px 0 rgba(240, 147, 251, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glowPulse {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        @media (max-width: 480px) {
          .signquest-container {
            padding: 1rem !important;
            margin: 1rem auto 0 auto !important;
            max-width: calc(100vw - 2rem) !important;
            width: 100% !important;
          }
          .signquest-cards-container {
            gap: 1rem !important;
            margin-top: 1rem !important;
            padding-bottom: 1.5rem !important;
            min-height: 180px !important;
          }
          .signquest-card {
            min-width: 120px !important;
            max-width: 140px !important;
            flex: 0 0 130px !important;
            padding: 1.5rem 0.5rem !important;
            min-height: 120px !important;
          }
          .signquest-card-icon {
            font-size: 1.4rem !important;
          }
          .signquest-card-text {
            font-size: 1rem !important;
          }
          .signquest-button-container {
            padding: 0.75rem 1rem !important;
          }
          .signquest-arrow-btn {
            width: 40px !important;
            height: 40px !important;
            font-size: 1.3rem !important;
          }
          .signquest-start-btn {
            padding: 0.8rem 2rem !important;
            font-size: 1.05rem !important;
            border-radius: 1.5rem !important;
            margin: 0 1rem !important;
          }
          .signquest-back-btn {
            margin-top: 1.5rem !important;
            padding: 0.75rem 2rem !important;
            font-size: 1rem !important;
          }
                 }

         /* Info Overlay Styles */
                   .signquest-subtitle-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            margin-bottom: 0;
            margin-top: 0.8rem;
            position: relative;
          }

                   .signquest-info-btn {
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

         .signquest-info-btn-hover,
         .signquest-info-btn:hover {
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

         .signquest-overlay {
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

         .signquest-overlay-content {
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

         .signquest-overlay-title {
           color: #fff;
           font-size: 1.5rem;
           font-weight: 700;
           margin-bottom: 1rem;
           text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
         }

         .signquest-overlay-description {
           color: #ffe0fa;
           font-size: 1rem;
           line-height: 1.6;
           margin-bottom: 2rem;
           text-align: left;
         }

         .signquest-overlay-btn {
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

         .signquest-overlay-btn:hover {
           transform: scale(1.05);
           box-shadow: 0 6px 16px rgba(255, 111, 161, 0.4);
         }

         @media (max-width: 480px) {
           .signquest-overlay-content {
             padding: 1.5rem;
             margin: 1rem;
           }
           
           .signquest-overlay-title {
             font-size: 1.3rem;
           }
           
           .signquest-overlay-description {
             font-size: 0.9rem;
           }
         }
       `}</style>

       {/* Info Overlay */}
       {showInfoOverlay && (
         <div className="signquest-overlay" onClick={() => setShowInfoOverlay(false)}>
           <div className="signquest-overlay-content" onClick={(e) => e.stopPropagation()}>
             <div className="signquest-overlay-title">Sign Quest Game</div>
                           <div className="signquest-overlay-description">
                Practice and learn Filipino Sign Language (FSL) through interactive quizzes. 
                Choose a category and test your knowledge with multiple-choice questions. 
                Progress through levels by achieving 80% or higher score to unlock new categories.
                <br /><br />
                Each category focuses on different aspects of sign language, from basic alphabet 
                and numbers to more complex phrases and expressions.
              </div>
             <button 
               className="signquest-overlay-btn"
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

export default SignQuestCategories;