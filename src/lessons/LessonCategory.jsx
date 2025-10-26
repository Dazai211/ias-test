import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonStructure } from './lessonStructure';
import { getUserProgress, auth } from '../library/firebase';
import { useTranslation } from '../Languages/useTranslation';

const LessonCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const category = lessonStructure[categoryId];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userProgress = await getUserProgress(user.uid);
        setProgress(userProgress[categoryId] || {});
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [categoryId]);

  if (!category) {
    return <div>Category not found</div>;
  }

  const subCategories = Object.entries(category.subCategories);
  const { t } = useTranslation();

  const handleCardClick = (subCategoryId, isLocked) => {
    if (!isLocked) {
      navigate(`/lessons/${categoryId}/${subCategoryId}`);
    }
  };

  const handleBackClick = () => {
    navigate('/lessons');
  };

  let previousCompleted = true;

  const displayCategoryTitle = t(`lessons.${categoryId}.title`) || category.title;
  const displayCategoryDescription = t(`lessons.${categoryId}.description`) || category.description;

  return (
    <div className="lesson-category-container">
      <div className="lesson-category-header">
        {/* Back Button - Left */}
        <div className="lesson-category-back-wrapper">
          <button
            className="lesson-category-back-btn"
            onClick={handleBackClick}
          >
            ← Back
          </button>
        </div>
        {/* Title/Description/Stats - Right */}
        <div className="lesson-category-info">
          <h1 className="lesson-category-title">{displayCategoryTitle}</h1>
          <p className="lesson-category-description">{displayCategoryDescription}</p>
          <p className="lesson-category-stats">Total: {category.totalSigns} signs</p>
        </div>
      </div>

      <div className="lesson-category-content">
        <div className="lesson-category-grid">
          {subCategories.map(([subCategoryId, subCategory], idx) => {
            const contentCount = subCategory.content.length;
            const subProgress = progress[subCategoryId] || {};
            const isCompleted = !!subProgress.completed;
            const isLocked = !previousCompleted && idx !== 0;
            if (!isCompleted) previousCompleted = false;

            const displayTitle = t(`lessons.${categoryId}.subCategories.${subCategoryId}.title`) || subCategory.title;
            const displayDescription = t(`lessons.${categoryId}.subCategories.${subCategoryId}.description`) || subCategory.description;

            return (
              <a
                key={subCategoryId}
                onClick={e => {
                  if (isLocked) e.preventDefault();
                  else handleCardClick(subCategoryId, isLocked);
                }}
                className={`lesson-category-card ${isLocked ? 'lesson-category-card-locked' : 'lesson-category-card-unlocked'} ${isCompleted ? 'lesson-category-card-completed' : ''}`}
                style={{
                  pointerEvents: isLocked ? 'none' : 'auto'
                }}
              >
                <div className="lesson-category-card-overlay" />
                <span className="lesson-category-card-icon">
                  {typeof subCategory.icon === 'string' && subCategory.icon.endsWith('.svg') ? (
                    <img src={subCategory.icon} alt={displayTitle} style={{ width: 32, height: 32 }} />
                  ) : (
                    subCategory.icon
                  )}
                </span>
                <h3 className="lesson-category-card-title">
                  {displayTitle}
                </h3>
                <p className="lesson-category-card-description">
                  {displayDescription}
                </p>
                <p className="lesson-category-card-count">
                  {contentCount} items
                </p>
                {isLocked && (
                  <span className="lesson-category-card-lock-icon" title="Locked" role="img" aria-label="Locked">🔒</span>
                )}
                {isCompleted && !isLocked && (
                  <span className="lesson-category-card-complete-icon" title="Completed" role="img" aria-label="Completed">✅</span>
                )}
              </a>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .lesson-category-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 0;
        }

        .lesson-category-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          margin-top: 1rem;
          width: 100%;
        }

        .lesson-category-back-wrapper {
          flex-shrink: 0;
          margin-bottom: 1rem;
        }

        .lesson-category-back-btn {
          background: linear-gradient(135deg, #ff6fa1 0%, #fcb0c7 100%);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(67, 206, 162, 0.2);
          transition: all 0.2s;
        }

        .lesson-category-back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(67, 206, 162, 0.3);
        }

        .lesson-category-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .lesson-category-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #fcb0c7;
        }

        .lesson-category-description {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .lesson-category-stats {
          font-size: 1rem;
          font-weight: 500;
        }

        .lesson-category-content {
          padding: 1rem;
        }

        .lesson-category-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(1, 1fr);
        }

        .lesson-category-card {
          width: 100%;
          padding: 1rem;
          border-radius: 1rem;
          border: 1.5px solid #f472b6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          background: linear-gradient(135deg, #b993d6 0%, #fcb0c7 100%);
          cursor: pointer;
        }

        .lesson-category-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #8f5fd4 0%, #f672a7 100%);
          transform: translateY(100%);
          transition: transform 0.3s;
          pointer-events: none;
        }

        .lesson-category-card:hover .lesson-category-card-overlay {
          transform: translateY(0%);
        }

        .lesson-category-card-icon {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
          color: #000;
          transition: color 0.3s;
          position: relative;
          z-index: 10;
        }

        .lesson-category-card:hover .lesson-category-card-icon {
          color: #fff;
        }

        .lesson-category-card-title {
          font-weight: 600;
          font-size: 1rem;
          color: #000;
          transition: color 0.3s;
          position: relative;
          z-index: 10;
          margin-bottom: 0.25rem;
        }

        .lesson-category-card:hover .lesson-category-card-title {
          color: #fff;
        }

        .lesson-category-card-description {
          font-size: 0.875rem;
          color: #000;
          transition: color 0.3s;
          position: relative;
          z-index: 10;
          margin-bottom: 0.25rem;
        }

        .lesson-category-card:hover .lesson-category-card-description {
          color: #fff;
        }

        .lesson-category-card-count {
          font-size: 0.7rem;
          color: #000;
          transition: color 0.3s;
          position: relative;
          z-index: 10;
          margin-top: 0.25rem;
        }

        .lesson-category-card:hover .lesson-category-card-count {
          color: #fff;
        }

        .lesson-category-card-locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lesson-category-card-completed {
          box-shadow: 0 0 0 2px #f472b6;
        }

        .lesson-category-card-lock-icon,
        .lesson-category-card-complete-icon {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-size: 1.25rem;
          z-index: 20;
        }

        .lesson-category-card-lock-icon {
          color: #9ca3af;
        }

        .lesson-category-card-complete-icon {
          color: #10b981;
        }

        @media (min-width: 640px) {
          .lesson-category-header {
            flex-direction: row;
            align-items: center;
            text-align: left;
          }

          .lesson-category-back-wrapper {
            margin-bottom: 0;
          }

          .lesson-category-info {
            align-items: flex-start;
            text-align: left;
          }


          .lesson-category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 768px) {
          .lesson-category-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .lesson-category-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default LessonCategory;