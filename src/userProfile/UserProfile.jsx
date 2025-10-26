import React, { useState, useEffect } from 'react';
import { auth } from '../library/firebase';
import { getUserProfile, updateUserProfile, syncLevelTitles } from './firebaseUtils';
import { lessonStructure } from '../lessons/lessonStructure';
import ProfilePictureUpload from './ProfilePictureUpload';
import { useLanguage } from '../Languages/i18n2lang.jsx';
import TitleSelector from './TitleSelector';
import Loader from '../components/Loader';

const UserProfile = ({ onBackToAuth }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [editForm, setEditForm] = useState({
    displayName: '',
    preferences: {
      theme: 'static',
      language: 'en'
    }
  });

  // Avatar selection state
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // Simple avatar options
  const avatars = [
    { id: 'a1', path: '/Avatars/a1.png' },
    { id: 'a2', path: '/Avatars/a2.png' },
    { id: 'a3', path: '/Avatars/a3.png' },
    { id: 'a4', path: '/Avatars/a4.png' },
    { id: 'a5', path: '/Avatars/a5.png' },
    { id: 'a6', path: '/Avatars/a6.png' },
    { id: 'a7', path: '/Avatars/a7.png' },
    { id: 'a8', path: '/Avatars/a8.png' },
  ];

  const { language, switchLanguage } = useLanguage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userProfile = await getUserProfile(currentUser.uid);
        if (userProfile) {
          setProfile(userProfile);
          setEditForm({
            displayName: userProfile.displayName || '',
            preferences: userProfile.preferences || {
              theme: 'static',
              language: 'en'
            }
          });
          // Sync level-based titles
          await syncLevelTitles(currentUser.uid);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Sync context language with profile preference
    if (profile?.preferences?.language && profile.preferences.language !== language) {
      switchLanguage(profile.preferences.language);
    }
    // eslint-disable-next-line
  }, [profile]);

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    try {
      await updateUserProfile(user.uid, {
        displayName: editForm.displayName,
        preferences: editForm.preferences
      });
      
      setProfile(prev => ({
        ...prev,
        displayName: editForm.displayName,
        preferences: editForm.preferences
      }));
      
      setEditingProfile(false);
      
      // Force page reload to update background
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const calculateStats = () => {
    if (!profile?.lessonProgress) {
      return {
        totalLessonsCompleted: 0,
        totalSignsLearned: 0
      };
    }

    // Calculate lessons completed (subcategories)
    let totalLessonsCompleted = 0;
    let totalSignsLearned = 0;
    
    Object.entries(lessonStructure).forEach(([categoryId, category]) => {
      Object.entries(category.subCategories).forEach(([subCategoryId, subCategory]) => {
        const subProgress = profile.lessonProgress[categoryId]?.[subCategoryId];
        if (subProgress?.completed) {
          totalLessonsCompleted++;
          totalSignsLearned += subCategory.content.length;
        } else if (subProgress?.contents) {
          // Count individual completed signs even if subcategory not fully completed
          const completedContents = Object.values(subProgress.contents).filter(content => content.completed).length;
          totalSignsLearned += completedContents;
        }
      });
    });

    return {
      totalLessonsCompleted,
      totalSignsLearned
    };
  };

  const getGameActivity = () => {
    if (!profile?.gameActivity) {
      return {
        signFlip: 0,
        signQuest: 0,
        signSense: 0
      };
    }
    
    return {
      signFlip: profile.gameActivity.signFlip || 0,
      signQuest: profile.gameActivity.signQuest || 0,
      signSense: profile.gameActivity.signSense || 0
    };
  };

  const calculateProgress = () => {
    if (!profile?.lessonProgress) return { total: 0, completed: 0, percentage: 0 };
    
    let total = 0;
    let completed = 0;
    
    Object.entries(lessonStructure).forEach(([categoryId, category]) => {
      Object.entries(category.subCategories).forEach(([subCategoryId, subCategory]) => {
        total += subCategory.content.length;
        const subProgress = profile.lessonProgress[categoryId]?.[subCategoryId];
        if (subProgress?.completed) {
          // If subcategory is fully completed, count all signs
          completed += subCategory.content.length;
        } else if (subProgress?.contents) {
          // Count individual completed signs even if subcategory not fully completed
          const completedContents = Object.values(subProgress.contents).filter(content => content.completed).length;
          completed += completedContents;
        }
      });
    });
    
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const getRecentActivity = () => {
    if (!profile?.gameHistory || Object.keys(profile.gameHistory).length === 0) return [];
    
    // Convert object to array and sort by timestamp
    const gameHistoryArray = Object.values(profile.gameHistory)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5) // Get the 5 most recent games
      .map(game => ({
        ...game,
        date: new Date(game.timestamp).toLocaleDateString()
      }));
    
    return gameHistoryArray;
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setEditForm(prev => ({
      ...prev,
      preferences: { ...prev.preferences, language: lang }
    }));
    switchLanguage(lang);
  };

  // Handle avatar selection
  const handleAvatarSelect = (avatarPath) => {
    setSelectedAvatar(avatarPath);
  };

  // Handle avatar update
  const handleAvatarUpdate = async () => {
    if (!selectedAvatar || !user) return;
    
    try {
      await updateUserProfile(user.uid, {
        profilePicture: selectedAvatar
      });
      
      setProfile(prev => ({
        ...prev,
        profilePicture: selectedAvatar
      }));
      
      setShowAvatarSelection(false);
      setSelectedAvatar(null);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };



  if (loading) {
    return <Loader isLoading={loading} delay={1000} />;
  }

  if (!user || !profile) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-error">Problem</div>
        <button 
          className="user-profile-back-btn" 
          onClick={() => {
            auth.signOut();
            onBackToAuth();
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  const progress = calculateProgress();
  const stats = calculateStats();
  const gameActivity = getGameActivity();
  const recentActivity = getRecentActivity();

  return (
    <div className="user-profile-main-container">
      {/* Left: Profile Info */}
      <div className="user-profile-left">
        <div className="user-profile-avatar">
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" className="user-profile-avatar-img" />
          ) : (
            <div className="user-profile-avatar-placeholder">
              {profile.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="user-profile-info">
          <h1 className="user-profile-name">{profile.displayName || user.email}</h1>
          <p className="user-profile-email">{user.email}</p>
        </div>
        <button className="user-profile-logout-btn" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
      {/* Right: Tabs Navigation + Tab Content */}
      <div className="user-profile-right">
        <div className="user-profile-tabs-container">
          {['overview', 'progress', 'achievements', 'settings'].map(tab => (
            <button
              key={tab}
              className={`user-profile-tab ${activeTab === tab ? 'user-profile-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="user-profile-content">
          {activeTab === 'overview' && (
            <div className="user-profile-overview">
              {/* Stats Cards */}
              <div className="user-profile-stats-grid">
                <div className="user-profile-stat-card">
                  <h3 className="user-profile-stat-number">{stats.totalLessonsCompleted}</h3>
                  <p className="user-profile-stat-label">Lessons Completed</p>
                </div>
                <div className="user-profile-stat-card">
                  <h3 className="user-profile-stat-number">{stats.totalSignsLearned}</h3>
                  <p className="user-profile-stat-label">Signs Learned</p>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="user-profile-progress-card">
                <h3 className="user-profile-section-title">Learning Progress</h3>
                <div className="user-profile-progress-bar-container">
                  <div className="user-profile-progress-bar">
                    <div 
                      className="user-profile-progress-fill"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <p className="user-profile-progress-text">
                    {progress.completed} of {progress.total} signs completed ({progress.percentage}%)
                  </p>
                </div>
              </div>

              {/* Game Activity */}
              <div className="user-profile-activity-card">
                <h3 className="user-profile-section-title">Game Activity</h3>
                <div className="user-profile-activity-list">
                  <div className="user-profile-activity-item">
                    <span className="user-profile-activity-icon">
                      <img src="/SVGIcons/games/signFlip.svg" alt="Sign Flip" style={{ width: 24, height: 24, display: 'block' }} />
                    </span>
                    <div className="user-profile-activity-content">
                      <p className="user-profile-activity-title">Sign Flip</p>
                      <p className="user-profile-activity-details">
                        Played {gameActivity.signFlip} times
                      </p>
                    </div>
                  </div>
                  <div className="user-profile-activity-item">
                    <span className="user-profile-activity-icon">
                      <img src="/SVGIcons/games/signQuest.svg" alt="Sign Quest" style={{ width: 24, height: 24, display: 'block' }} />
                    </span>
                    <div className="user-profile-activity-content">
                      <p className="user-profile-activity-title">Sign Quest</p>
                      <p className="user-profile-activity-details">
                        Played {gameActivity.signQuest} times
                      </p>
                    </div>
                  </div>
                  <div className="user-profile-activity-item">
                    <span className="user-profile-activity-icon">
                      <img src="/SVGIcons/games/signSense.svg" alt="Sign Sense" style={{ width: 24, height: 24, display: 'block' }} />
                    </span>
                    <div className="user-profile-activity-content">
                      <p className="user-profile-activity-title">Sign Sense</p>
                      <p className="user-profile-activity-details">
                        Played {gameActivity.signSense} times
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="user-profile-progress-tab">
              <h3 className="user-profile-section-title">Detailed Progress</h3>
              <div className="user-profile-categories-grid">
                {Object.entries(lessonStructure).map(([categoryId, category]) => {
                  const categoryProgress = profile.lessonProgress?.[categoryId] || {};
                  const completedSubCategories = Object.values(categoryProgress).filter(sub => sub.completed).length;
                  const totalSubCategories = Object.keys(category.subCategories).length;
                  const categoryPercentage = totalSubCategories > 0 ? Math.round((completedSubCategories / totalSubCategories) * 100) : 0;
                  const isExpanded = expandedCategories.has(categoryId);

                  return (
                    <div key={categoryId} className="user-profile-category-card">
                      <div className="user-profile-category-header">
                        <span className="user-profile-category-icon">
                          {categoryId === 'fundamentals' ? (
                            <img src="/SVGIcons/Category/fundamentals.svg" alt="Fundamentals" style={{ width: 32, height: 32, display: 'block' }} />
                          ) : categoryId === 'everydayWords' ? (
                            <img src="/SVGIcons/Category/everydayWords.svg" alt="Everyday Words" style={{ width: 32, height: 32, display: 'block' }} />
                          ) : categoryId === 'additionalBasics' ? (
                            <img src="/SVGIcons/Category/addtionalBasics.svg" alt="Additional Basics" style={{ width: 32, height: 32, display: 'block' }} />
                          ) : (
                            typeof category.icon === 'string' && category.icon.endsWith('.svg') ? (
                              <img src={category.icon} alt={category.title} style={{ width: 32, height: 32, display: 'block' }} />
                            ) : (
                              category.icon
                            )
                          )}
                        </span>
                        <h4 className="user-profile-category-title">{category.title}</h4>
                      </div>
                      <div className="user-profile-category-progress">
                        <div className="user-profile-category-progress-bar">
                          <div 
                            className="user-profile-category-progress-fill"
                            style={{ width: `${categoryPercentage}%` }}
                          />
                        </div>
                        <p className="user-profile-category-progress-text">
                          {completedSubCategories}/{totalSubCategories} sections
                        </p>
                      </div>
                      <button 
                        className="user-profile-view-button"
                        onClick={() => toggleCategoryExpansion(categoryId)}
                      >
                        {isExpanded ? 'Hide' : 'View'}
                      </button>
                      {isExpanded && (
                        <div className="user-profile-subcategories-container">
                          {Object.entries(category.subCategories).map(([subCategoryId, subCategory]) => {
                            const subProgress = categoryProgress[subCategoryId] || {};
                            const contentsProgress = subProgress.contents || {};
                            const completedContents = Object.values(contentsProgress).filter(content => content.completed).length;
                            const subPercentage = subCategory.content.length > 0 ? Math.round((completedContents / subCategory.content.length) * 100) : 0;
                            return (
                              <div key={subCategoryId} className="user-profile-subcategory-card">
                                <div className="user-profile-subcategory-header">
                                  <h5 className="user-profile-subcategory-title">{subCategory.title}</h5>
                                </div>
                                <div className="user-profile-subcategory-progress">
                                  <div className="user-profile-subcategory-progress-bar">
                                    <div 
                                      className="user-profile-subcategory-progress-fill"
                                      style={{ width: `${subPercentage}%` }}
                                    />
                                  </div>
                                  <div className="user-profile-subcategory-progress-bottom">
                                    <p className="user-profile-subcategory-progress-text">
                                      {completedContents}/{subCategory.content.length} signs
                                    </p>
                                    <span className="user-profile-subcategory-status">
                                      {completedContents === subCategory.content.length ? '✅ Completed' : 
                                       completedContents > 0 ? '⏳ In Progress' : '🔒 Locked'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="user-profile-category-card user-profile-its-a-sign-lesson-card">
                  <span className="user-profile-its-a-sign-lesson-text">IT'S A SIGN</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="user-profile-achievements-tab">
              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="user-profile-achievements-grid">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="user-profile-achievement-card">
                      <h4 className="user-profile-achievement-title">{achievement.title}</h4>
                      <p className="user-profile-achievement-desc">{achievement.description}</p>
                      <span className="user-profile-achievement-date">{achievement.earnedAt && new Date(achievement.earnedAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="user-profile-no-achievements">
                  <TitleSelector />
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="user-profile-settings-tab">
              <h3 className="user-profile-section-title">Account Settings</h3>
               
              {/* Profile Picture Section */}
              <div className="user-profile-picture-section">
                <h4 className="user-profile-subsection-title">Profile Picture</h4>
                <ProfilePictureUpload
                  userId={user.uid}
                  currentPicture={profile.profilePicture}
                  onPictureUpdate={(newPicture) => {
                    setProfile(prev => ({ ...prev, profilePicture: newPicture }));
                  }}
                />
                <button 
                  className="user-profile-choose-avatar-btn"
                  onClick={() => setShowAvatarSelection(true)}
                >
                  Choose Avatar
                </button>
              </div>
               
              {editingProfile ? (
                <div className="user-profile-edit-form">
                  <div className="user-profile-form-group">
                    <label className="user-profile-label">Display Name</label>
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                      className="user-profile-input"
                      placeholder="Enter display name"
                    />
                  </div>
                  
                  <div className="user-profile-form-group">
                    <label className="user-profile-label">Background</label>
                    <select
                      value={editForm.preferences.theme}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, theme: e.target.value }
                      }))}
                      className="user-profile-select"
                    >
                      <option value="static">Static</option>
                      <option value="dynamic">Dynamic</option>
                    </select>
                  </div>
                  {/* Language Switcher */}
                  <div className="user-profile-form-group">
                    <label className="user-profile-label">Language</label>
                    <select
                      value={editForm.preferences.language}
                      onChange={handleLanguageChange}
                      className="user-profile-select"
                    >
                      <option value="en">English</option>
                      <option value="fil">Filipino</option>
                    </select>
                  </div>
                  

                  
                  <div className="user-profile-button-group">
                    <button className="user-profile-save-button" onClick={handleProfileUpdate}>
                      Save Changes
                    </button>
                    <button className="user-profile-cancel-button" onClick={() => setEditingProfile(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="user-profile-settings-display">
                  <div className="user-profile-setting-item">
                    <span className="user-profile-setting-label">Display Name:</span>
                    <span className="user-profile-setting-value">{profile.displayName || 'Not set'}</span>
                  </div>
                  <div className="user-profile-setting-item">
                    <span className="user-profile-setting-label">Background:</span>
                    <span className="user-profile-setting-value">{profile.preferences?.theme || 'static'}</span>
                  </div>
                  <div className="user-profile-setting-item">
                    <span className="user-profile-setting-label">Language:</span>
                    <span className="user-profile-setting-value">{profile.preferences?.language === 'fil' ? 'Filipino' : 'English'}</span>
                  </div>

                  <button className="user-profile-edit-button" onClick={() => setEditingProfile(true)}>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarSelection && (
        <div className="avatar-selection-overlay">
          <div className="avatar-selection-modal">
            <div className="avatar-selection-header">
              <h2 className="avatar-selection-title">Choose Your Avatar</h2>
              <p className="avatar-selection-subtitle">Select an avatar to represent you</p>
            </div>
            
            <div className="avatar-selection-grid">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  className={`avatar-option ${selectedAvatar === avatar.path ? 'avatar-option-selected' : ''}`}
                  onClick={() => handleAvatarSelect(avatar.path)}
                >
                  <img 
                    src={avatar.path} 
                    alt={`Avatar ${avatar.id}`} 
                    className="avatar-option-img"
                  />
                </button>
              ))}
            </div>
            

            
            <div className="avatar-actions">
              <button
                className="avatar-back-button"
                onClick={() => {
                  setShowAvatarSelection(false);
                  setSelectedAvatar(null);
                }}
              >
                Cancel
              </button>
              <button
                className={`avatar-confirm-button ${selectedAvatar ? 'avatar-confirm-active' : ''}`}
                onClick={handleAvatarUpdate}
                disabled={!selectedAvatar}
              >
                Update Avatar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .user-profile-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .user-profile-loading {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
        }

        .user-profile-error {
          color: #ff4d6d;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 1rem;
        }

        .user-profile-back-btn {
          padding: 0.7rem 2rem;
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-profile-back-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        .user-profile-main-container {
          display: flex;
          flex-direction: row;
          gap: 2.5rem;
          align-items: flex-start;
          justify-content: center;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
        }

        .user-profile-left {
          flex: 0 0 320px;
          max-width: 340px;
          background: rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2rem 1.5rem;
          box-shadow: 0 4px 24px rgba(58,35,115,0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .user-profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #ff6fa1;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-profile-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-profile-avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff6fa1 0%, #a18cd1 100%);
          color: #fff;
          font-size: 3rem;
          font-weight: 800;
        }

        .user-profile-info {
          text-align: center;
          width: 100%;
        }

        .user-profile-name {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .user-profile-email {
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
          margin: 0;
          word-break: break-all;
        }

        .user-profile-logout-btn {
          padding: 0.7rem 2rem;
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }

        .user-profile-logout-btn:active {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        .user-profile-right {
          flex: 1;
          min-width: 0;
        }

        .user-profile-tabs-container {
          display: flex;
          background: rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 0.5rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .user-profile-tab {
          flex: 1;
          padding: 0.8rem 1.2rem;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .user-profile-tab:active {
          color: #fff;
          background: rgba(255,255,255,0.1);
        }

        .user-profile-tab-active {
          background: linear-gradient(90deg, #ff6fa1 0%, #a18cd1 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(255, 111, 161, 0.3);
        }

        .user-profile-content {
          background: rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          min-height: 400px;
        }

        /* Overview Tab Styles */
        .user-profile-overview {
          display: flex;
          flex-direction: column;
          gap: 2rem;
    
        }

        .user-profile-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .user-profile-stat-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 100%;
          min-width: 0;
        }

        .user-profile-stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #ff6fa1;
          margin: 0 0 0.5rem 0;
        }

        .user-profile-stat-label {
          font-size: 1rem;
          color: #e0e6f7;
          margin: 0;
        }

        .user-profile-progress-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-profile-section-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
          margin: 0 0 1rem 0;
        }

        .user-profile-progress-bar-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-profile-progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          overflow: hidden;
        }

        .user-profile-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6fa1 0%, #a18cd1 100%);
          border-radius: 6px;
          transition: width 0.3s ease;
        }

        .user-profile-progress-text {
          font-size: 1rem;
          color: #e0e6f7;
          margin: 0;
        }

        .user-profile-activity-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-profile-activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .user-profile-activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .user-profile-activity-icon {
          font-size: 1.5rem;
        }

        .user-profile-activity-content {
          flex: 1;
        }

        .user-profile-activity-title {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 0.25rem 0;
        }

        .user-profile-activity-details {
          font-size: 0.9rem;
          color: #bfc6e0;
          margin: 0;
        }

        /* Progress Tab Styles */
        .user-profile-progress-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .user-profile-categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .user-profile-category-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-profile-category-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .user-profile-category-icon {
          font-size: 2rem;
        }

        .user-profile-category-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #fff;
          margin: 0;
        }

        .user-profile-category-progress {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-profile-category-progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .user-profile-category-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6fa1 0%, #a18cd1 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .user-profile-category-progress-text {
          font-size: 0.9rem;
          color: #bfc6e0;
          margin: 0;
        }

        .user-profile-view-button {
          padding: 0.6rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          color: #ff6fa1;
          border: 1px solid #ff6fa1;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 1rem;
          align-self: flex-start;
        }

        .user-profile-view-button:active {
          background: rgba(255, 111, 161, 0.1);
          transform: scale(1.05);
        }

        .user-profile-subcategories-container {
          margin-top: 0.75rem;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .user-profile-subcategory-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          padding: 0.6rem;
          margin-bottom: 0.4rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-profile-subcategory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
        }

        .user-profile-subcategory-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .user-profile-subcategory-status {
          font-size: 0.75rem;
          font-weight: 500;
          color: #bfc6e0;
        }

        .user-profile-subcategory-progress {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .user-profile-subcategory-progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .user-profile-subcategory-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .user-profile-subcategory-progress-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-profile-subcategory-progress-text {
          font-size: 0.7rem;
          color: #bfc6e0;
          margin: 0;
        }

        /* Achievements Tab Styles */
        .user-profile-achievements-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .user-profile-achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .user-profile-achievement-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-profile-achievement-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .user-profile-achievement-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #fff;
          margin: 0 0 0.5rem 0;
        }

        .user-profile-achievement-description {
          font-size: 1rem;
          color: #e0e6f7;
          margin: 0;
        }

        .user-profile-achievement-desc {
          font-size: 0.9rem;
          color: #bfc6e0;
          margin: 0.5rem 0 0.25rem 0;
        }

        .user-profile-achievement-date {
          font-size: 0.8rem;
          color: #bfc6e0;
          margin-top: 0.5rem;
        }

        .user-profile-no-achievements {
          text-align: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-profile-no-achievements-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .user-profile-no-achievements-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
          margin: 0 0 1rem 0;
        }

        .user-profile-no-achievements-text {
          font-size: 1rem;
          color: #bfc6e0;
          margin: 0;
        }

        /* Settings Tab Styles */
        .user-profile-settings-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .user-profile-picture-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-profile-subsection-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #fff;
          margin: 0 0 1rem 0;
        }

        .user-profile-settings-display {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .user-profile-setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .user-profile-setting-label {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        .user-profile-setting-value {
          font-size: 1rem;
          color: #e0e6f7;
        }

        .user-profile-edit-button {
          padding: 0.8rem 1.5rem;
          background: linear-gradient(135deg, #ff6fa1 0%, #3a2373 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          align-self: flex-start;
        }

        .user-profile-edit-button:active {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        .user-profile-edit-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .user-profile-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-profile-label {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        .user-profile-input {
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 1rem;
          color: #fff;
          outline: none;
        }

        .user-profile-input:focus {
          border-color: #ff6fa1;
          box-shadow: 0 0 0 2px rgba(255, 111, 161, 0.2);
        }

        .user-profile-select {
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 1rem;
          color: #fff;
          outline: none;
        }

        .user-profile-select:focus {
          border-color: #ff6fa1;
          box-shadow: 0 0 0 2px rgba(255, 111, 161, 0.2);
        }

        .user-profile-select option {
          background: #3a2373;
          color: #fff;
          padding: 0.5rem;
        }

        .user-profile-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: #fff;
          cursor: pointer;
        }

        .user-profile-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #ff6fa1;
        }

        .user-profile-button-group {
          display: flex;
          gap: 1rem;
        }

        .user-profile-save-button {
          padding: 0.8rem 1.5rem;
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-profile-save-button:active {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(67, 206, 162, 0.3);
        }

        .user-profile-cancel-button {
          padding: 0.8rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-profile-cancel-button:active {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .user-profile-category-card.user-profile-its-a-sign-lesson-card {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 180px;
          background: linear-gradient(135deg, #ff6fa1 0%, #7b4397 100%);
          border-radius: 1rem;
          border: 1.5px solid #f472b6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          cursor: pointer;
        }
        .user-profile-category-card.user-profile-its-a-sign-lesson-card::before {
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
          animation: shine-move 4s cubic-bezier(.4,0,.2,1) infinite;
          opacity: 0.85;
          transition: opacity 0.6s cubic-bezier(.4,0,.2,1);
        }
        @keyframes shine-move {
          0%   { background-position: -150% 0, center; opacity: 0; }
          5%   { opacity: 0.85; }
          95%  { opacity: 0.85; }
          100% { background-position: 150% 0, center; opacity: 0; }
        }
        .user-profile-its-a-sign-lesson-text {
          font-size: 2.2rem;
          font-weight: 900;
          color: #fff;
          text-align: center;
          letter-spacing: 1px;
        }

        @media (max-width: 700px) {
          .user-profile-main-container {
            flex-direction: column;
            gap: 1.5rem;
            padding: 1rem;
          }

          .user-profile-left {
            flex: none;
            max-width: 100%;
            width: 100%;
          }

          .user-profile-right {
            width: 100%;
          }

          .user-profile-tabs-container {
            flex-wrap: wrap;
            
          }

          .user-profile-tab {
            min-width: 120px;
          }

          .user-profile-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.8rem;
          }

          .user-profile-stat-number {
            font-size: 1.8rem;
          }

          .user-profile-stat-label {
            font-size: 0.85rem;
          }

          .user-profile-categories-grid {
            grid-template-columns: 1fr;
          }

          .user-profile-achievements-grid {
            grid-template-columns: 1fr;
          }

          .user-profile-button-group {
            flex-direction: column;
          }

          .user-profile-category-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

                    .user-profile-subcategory-progress-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .user-profile-progress-card {
            padding: 1rem;
          }

          .user-profile-section-title {
            font-size: 1.2rem;
            margin-bottom: 0.8rem;
          }

          .user-profile-progress-text {
            font-size: 0.9rem;
          }

          .user-profile-content {
            padding: 1rem;
          }
        }

        /* Avatar Selection Styles */
        .user-profile-choose-avatar-btn {
          margin-top: 1rem;
          padding: 0.7rem 1.5rem;
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-profile-choose-avatar-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 111, 161, 0.3);
        }

        @media (max-width: 700px) {
          .user-profile-choose-avatar-btn {
            margin-top: 0.8rem;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            width: 80%;
            margin-left: auto;
            margin-right: auto;
            display: block;
          }
        }

        .avatar-selection-overlay {
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
          padding: 1rem;
        }

        .avatar-selection-modal {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .avatar-selection-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .avatar-selection-title {
          color: #fff;
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
        }

        .avatar-selection-subtitle {
          color: #bfc6e0;
          font-size: 1rem;
          margin: 0;
        }

        .avatar-selection-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .avatar-option {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-option:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 111, 161, 0.5);
          transform: scale(1.05);
        }

        .avatar-option-selected {
          background: rgba(255, 111, 161, 0.2);
          border-color: #ff6fa1;
          box-shadow: 0 0 20px rgba(255, 111, 161, 0.3);
        }

        .avatar-option-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
        }

        .avatar-preview {
          text-align: center;
          margin-bottom: 2rem;
        }

        .avatar-preview-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          border-radius: 50%;
          border: 3px solid #ff6fa1;
        }

        .avatar-preview-text {
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          margin: 0.5rem 0 0 0;
        }

        .avatar-actions {
          display: flex;
          gap: 1rem;
          width: 100%;
        }

        .avatar-back-button {
          flex: 1;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 2px solid #a18cd1;
          background: transparent;
          color: #a18cd1;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .avatar-back-button:hover {
          background: rgba(161, 140, 209, 0.1);
          border-color: #ff6fa1;
          color: #ff6fa1;
        }

        .avatar-confirm-button {
          flex: 1;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .avatar-confirm-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .avatar-confirm-active {
          background: linear-gradient(90deg, #ff6fa1 0%, #3a2373 100%);
          border-color: #ff6fa1;
          color: #fff;
          box-shadow: 0 4px 16px rgba(255, 111, 161, 0.3);
        }

        .avatar-confirm-active:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(255, 111, 161, 0.4);
        }

        @media (max-width: 600px) {
          .avatar-selection-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.8rem;
          }

          .avatar-option-img {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 50%;
          }

          .avatar-preview-img {
            width: 70px;
            height: 70px;
          }
        }
     
      `}</style>
    </div>
  );
};

export default UserProfile; 