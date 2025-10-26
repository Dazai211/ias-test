import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonStructure } from './lessonStructure';
import { getUserProgress } from '../library/firebase';
import { auth } from '../library/firebase';
import { useTranslation } from '../Languages/useTranslation';

const SubCategoryContent = () => {
  const { categoryId, subCategoryId } = useParams();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { t } = useTranslation();

  // Get the sub-category data
  const category = lessonStructure[categoryId];
  if (!category) return <div>Category not found</div>;
  const subCategory = category.subCategories[subCategoryId];
  if (!subCategory) return <div>Sub-category not found</div>;

  const content = subCategory.content;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userProgress = await getUserProgress(user.uid);
        setProgress(
          (userProgress[categoryId] && userProgress[categoryId][subCategoryId] && userProgress[categoryId][subCategoryId].contents) || {}
        );
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [categoryId, subCategoryId]);

  const handleCardClick = (contentId, isLocked) => {
    if (!isLocked) {
      navigate(`/lessons/${categoryId}/${subCategoryId}/${contentId}`);
    }
  };

  const handleBackClick = () => {
    navigate(`/lessons/${categoryId}`);
  };

  // Determine lock/completed state for each content
  let previousCompleted = true;

  const displayTitle = t(`lessons.${categoryId}.subCategories.${subCategoryId}.title`) || subCategory.title;
  const displayDescription = t(`lessons.${categoryId}.subCategories.${subCategoryId}.description`) || subCategory.description;

  return (
    <div className="subcategory-container">
      <div className="subcategory-header">
        {/* Back Button - Left, vertically centered */}
        <div className="subcategory-back-wrapper">
          <button
            className="subcategory-back-btn"
            onClick={handleBackClick}
          >
            ← Back
          </button>
        </div>
        {/* Title/Description - Right, stacked vertically */}
        <div className="subcategory-info">
          <h2 className="subcategory-title">{displayTitle}</h2>
          <p className="subcategory-description">{displayDescription}</p>
        </div>
      </div>
      
      <div className="subcategory-cards-container">
        {content.map((item, idx) => {
          const itemProgress = progress[item.id] || {};
          const isCompleted = !!itemProgress.completed;
          const isLocked = !previousCompleted && idx !== 0;
          if (!isCompleted) previousCompleted = false;
          
          // Use scalable translation for all categories/subcategories
          let displayTitle = t(`lessons.${categoryId}.subCategories.${subCategoryId}.content.${item.id}`) || item.title;
          return (
            <div
              key={item.id}
              className={`subcategory-content-card ${hoveredCard === item.id ? 'subcategory-content-card-hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(item.id, isLocked)}
            >
              {/* Card Title */}
              <div className="subcategory-card-title">{displayTitle}</div>
              {/* Card Description */}
              <div className="subcategory-card-description">{item.description}</div>
              {/* Completed Badge */}
              {isCompleted && (
                <span className="subcategory-completed-badge">
                  Completed
                </span>
              )}
              {/* Locked Badge */}
              {isLocked && (
                <span className="subcategory-locked-badge">
                  Locked
                </span>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .subcategory-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 0;
        }

        .subcategory-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          margin-top: 1rem;
          width: 100%;
        }

        .subcategory-back-wrapper {
          flex-shrink: 0;
        }

        .subcategory-back-btn {
          background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
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

        .subcategory-back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(67, 206, 162, 0.3);
        }

        .subcategory-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .subcategory-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #a78bfa;
        }

        .subcategory-description {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .subcategory-cards-container {
          display: grid;
          gap: 1.5rem;
          margin-top: 2rem;
          grid-template-columns: repeat(4, 1fr);
        }

        .subcategory-content-card {
          background: linear-gradient(135deg, #b993d6 0%, #fcb0c7 100%);
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(31, 38, 135, 0.10);
          border: 1px solid #e0e0e0;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          position: relative;
        }

        .subcategory-content-card-hovered {
          transform: translateY(-6px);
        }

        .subcategory-card-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #185a9d;
          margin-bottom: 0.5rem;
        }

        .subcategory-card-description {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .subcategory-completed-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #43cea2;
          color: black;
          border-radius: 8px;
          padding: 0.08rem 0.5rem;
          font-weight: 700;
          font-size: 0.75rem;
          box-shadow: 0 2px 8px #43cea255;
        }

        .subcategory-locked-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #888;
          color: white;
          border-radius: 8px;
          padding: 0.3rem 0.8rem;
          font-weight: 700;
          font-size: 0.95rem;
          opacity: 0.85;
          box-shadow: 0 2px 8px #8888;
        }

        @media (max-width: 600px) {
          .subcategory-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.7rem;
            margin-bottom: 1.2rem;
          }

          .subcategory-back-btn {
            padding: 0.5rem 1rem;
            font-size: 1rem;
            margin-bottom: 0.2rem;
          }

          .subcategory-info {
            align-items: center;
            text-align: center;
          }

          .subcategory-title {
            font-size: 1.2rem;
            margin-bottom: 0.2rem;
            text-align: center;
          }

          .subcategory-description {
            font-size: 0.95rem;
            margin-bottom: 0.7rem;
            text-align: center;
          }

          .subcategory-cards-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
          }

          .subcategory-content-card {
            min-width: 0;
            width: 100%;
            max-width: 100%;
            padding: 1rem;
            font-size: 0.98rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(31,38,135,0.08);
          }

          .subcategory-content-card > div:first-child {
            font-size: 1.05rem;
          }

          .subcategory-content-card > div:last-child {
            font-size: 0.92rem;
          }
        }

        @media (min-width: 601px) and (max-width: 900px) {
          .subcategory-cards-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 901px) and (max-width: 1200px) {
          .subcategory-cards-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default SubCategoryContent; 