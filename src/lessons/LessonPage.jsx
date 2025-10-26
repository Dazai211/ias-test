import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonStructure } from './lessonStructure';
import testVideo from '../assets/FSLVideos/Test/test.mp4';
import { updateContentProgress, getUserProgress } from '../library/firebase';
import { markSubCategoryCompleted } from '../userProfile/firebaseUtils';
import { auth } from '../library/firebase';
import { useTranslation } from '../Languages/useTranslation';

const LessonPage = () => {
  const { categoryId, subCategoryId, contentId } = useParams();
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoRef, setVideoRef] = useState(null);
  const [speedStates, setSpeedStates] = useState({
    slow: false,
    slower: false,
    slowest: false
  });
  const [videoLoading, setVideoLoading] = useState(true);

  // Get the content data
  const category = lessonStructure[categoryId];
  if (!category) return <div>Category not found</div>;
  const subCategory = category.subCategories[subCategoryId];
  if (!subCategory) return <div>Sub-category not found</div>;
  
  const content = subCategory.content;
  const currentContent = content.find(item => item.id === contentId);
  if (!currentContent) return <div>Content not found</div>;

  const { t } = useTranslation();
  const displayContentTitle = t(`lessons.${categoryId}.subCategories.${subCategoryId}.content.${contentId}`) || currentContent.title;
  const displayContentDescription = t(`lessons.${categoryId}.subCategories.${subCategoryId}.content.${contentId}.description`) || currentContent.description;

  // Video control functions
  const handleVideoError = () => {
    console.error('Video error occurred');
    setVideoLoading(false);
  };

  const handleVideoLoad = () => {
    // Video loaded successfully
    setVideoLoading(false);
  };

  // Mark content as completed when opened and check if subcategory should be completed
  useEffect(() => {
    async function completeAndCheckSubcategory() {
      if (auth.currentUser) {
        await updateContentProgress(auth.currentUser.uid, categoryId, subCategoryId, contentId);
        // Fetch progress for all contents in this subcategory
        const userProgress = await getUserProgress(auth.currentUser.uid);
        const subProgress = userProgress?.[categoryId]?.[subCategoryId]?.contents || {};
        // Check if all contents are completed
        const allCompleted = content.every(item => subProgress[item.id]?.completed);
        if (allCompleted) {
          await markSubCategoryCompleted(auth.currentUser.uid, categoryId, subCategoryId);
        }
      }
    }
    completeAndCheckSubcategory();
  }, [categoryId, subCategoryId, contentId]);

  // Reset video loading state when content changes
  useEffect(() => {
    setVideoLoading(true);
  }, [contentId]);

  const handleBackClick = () => {
    navigate(`/lessons/${categoryId}/${subCategoryId}`);
  };

  const handlePreviousClick = () => {
    const currentIndex = content.findIndex(item => item.id === contentId);
    if (currentIndex > 0) {
      const previousContent = content[currentIndex - 1];
      navigate(`/lessons/${categoryId}/${subCategoryId}/${previousContent.id}`);
    }
  };

  const handleNextClick = async () => {
    const currentIndex = content.findIndex(item => item.id === contentId);
    // If last content, mark subcategory as completed
    if (currentIndex === content.length - 1) {
      if (auth.currentUser) {
        await markSubCategoryCompleted(auth.currentUser.uid, categoryId, subCategoryId);
      }
    }
    if (currentIndex < content.length - 1) {
      const nextContent = content[currentIndex + 1];
      navigate(`/lessons/${categoryId}/${subCategoryId}/${nextContent.id}`);
    }
  };

  const handleSpeedClick = (speedType) => {
    if (!videoRef) return;

    const speeds = {
      slow: 0.5,
      slower: 0.25,
      slowest: 0.1
    };

    // Reset all speed states
    const newSpeedStates = {
      slow: false,
      slower: false,
      slowest: false
    };

    // If the clicked button was already active, return to normal speed
    if (speedStates[speedType]) {
      videoRef.playbackRate = 1.0;
    } else {
      // Activate the clicked button and set the speed
      newSpeedStates[speedType] = true;
      videoRef.playbackRate = speeds[speedType];
    }

    setSpeedStates(newSpeedStates);
  };

  const currentIndex = content.findIndex(item => item.id === contentId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < content.length - 1;

  return (
    <div className="lesson-page-container">
      <div className="lesson-page-main">
        <div className="lesson-page-left">
          <div className="lesson-back-progress-row">
            <button
              className="lesson-back-btn"
              onClick={handleBackClick}
            >
              ← Back
            </button>
            <div className="lesson-progress-indicator">
              {currentIndex + 1} of {content.length}
            </div>
          </div>
          {displayContentDescription && (
            <p className="lesson-description">{displayContentDescription}</p>
          )}
        </div>
        <div className="lesson-page-right">
          <div className="lesson-content-container">
            <div className="lesson-video-container">
              <div className="lesson-navigation-row">
                <button
                  className={`lesson-nav-btn lesson-nav-btn-prev ${!hasPrevious ? 'lesson-nav-btn-disabled' : ''}`}
                  onClick={handlePreviousClick}
                  disabled={!hasPrevious}
                >
                  ←
                </button>
                <span className="lesson-content-title">{displayContentTitle}</span>
                <button
                  className={`lesson-nav-btn lesson-nav-btn-next ${!hasNext ? 'lesson-nav-btn-disabled' : ''}`}
                  onClick={handleNextClick}
                  disabled={!hasNext}
                >
                  →
                </button>
              </div>
              <div className="lesson-video-wrapper">
                <video 
                  ref={setVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  crossOrigin="anonymous"
                  loading="lazy"
                  poster="/Loading/Loading.png"
                  className="lesson-video"
                  src={currentContent.video || testVideo}
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoad}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="lesson-speed-btns">
                <button
                  className={`lesson-speed-btn ${speedStates.slow ? 'lesson-speed-btn-active' : ''}`}
                  onClick={() => handleSpeedClick('slow')}
                >
                  -1
                </button>
                <button
                  className={`lesson-speed-btn ${speedStates.slower ? 'lesson-speed-btn-active' : ''}`}
                  onClick={() => handleSpeedClick('slower')}
                >
                  -2
                </button>
                <button
                  className={`lesson-speed-btn ${speedStates.slowest ? 'lesson-speed-btn-active' : ''}`}
                  onClick={() => handleSpeedClick('slowest')}
                >
                  -3
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lesson-page-container {
          padding: 2rem;
        }

        .lesson-page-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
        }

        .lesson-page-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 0.5rem;
          gap: 1.5rem;
        }

        .lesson-page-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100%;
          margin-left: 1rem;
        }

        .lesson-back-progress-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .lesson-back-btn {
          background: linear-gradient(135deg, #43a1ff 0%, #185a9d 100%);
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
          box-shadow: 0 4px 15px rgba(67, 161, 255, 0.2);
          transition: all 0.2s;
        }

        .lesson-back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(67, 161, 255, 0.3);
        }

        .lesson-progress-indicator {
          background: #f8f9fa;
          color: #666;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          border: 1px solid #e0e0e0;
        }

        .lesson-description {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .lesson-content-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 0.5rem;
          min-height: 60vh;
          width: 100%;
        }

        .lesson-video-container {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 50%, rgba(240, 147, 251, 0.15) 100%);
          border-radius: 2rem;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          padding: 2.5rem 2rem;
          max-width: 480px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          min-width: 280px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .lesson-video-wrapper {
          max-width: 420px;
          width: 100%;
          border-radius: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          background: none;
          box-shadow: none;
        }

        .lesson-video {
          max-width: 100%;
          width: 100%;
          height: auto;
          border-radius: 1.5rem;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 1.1rem;
          margin: 0 auto;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(102, 126, 234, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .lesson-speed-btns {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          width: 100%;
        }

        .lesson-speed-btn {
          background: linear-gradient(135deg, #e0e7ef 100%);
          color: #185a9d;
          border: 2px solid #185a9d;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .lesson-speed-btn-active {
          background: linear-gradient(135deg, #43a1ff 0%, #185a9d 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(67, 161, 255, 0.2);
        }

        .lesson-navigation-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          width: 100%;
          margin-bottom: 1.5rem;
        }

        .lesson-nav-btn {
          background: linear-gradient(135deg, #43a1ff 0%, #185a9d 100%);
          color: white;
          border: none;
          padding: 0.5rem 1.2rem;
          margin-top: 0.2rem;
          vertical-align: middle;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(67, 161, 255, 0.2);
          min-width: unset;
        }

        .lesson-nav-btn:hover:not(.lesson-nav-btn-disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(67, 161, 255, 0.3);
        }

        .lesson-nav-btn-disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .lesson-content-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
          margin-bottom: 1rem;
          vertical-align: middle;
          margin-top: 0.2rem;
        }

        @media (max-width: 600px) {
          .lesson-video-container {
            max-width: 90vw;
            width: 90vw;
            min-width: 0;
            margin: 0 auto;
            padding: 0;
            border-radius: 20;
            box-shadow: none;
            
          }

          .lesson-video {
            max-width: 85vw;
            width: 85vw;
            height: auto;
            display: block;
          }

          .lesson-speed-btns {
            gap: 0.7rem !important;
            margin-top: 1rem !important;
            margin-bottom: 2.5rem !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .lesson-speed-btn {
            padding: 0.6rem 1.2rem !important;
            font-size: 0.95rem !important;
            border-radius: 6px !important;
          }

          .lesson-back-progress-row {
            flex-direction: column;
            align-items: center;
            gap: 0;
          }

          .lesson-back-btn {
            font-size: 0.95rem;
            padding: 0.5rem 1rem;
            border-radius: 7px;
          }

          .lesson-progress-indicator {
            font-size: 0.95rem;
            padding: 0.5rem 1rem;
            border-radius: 7px;
            min-width: 90px;
            margin-top: 0.8rem;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonPage; 