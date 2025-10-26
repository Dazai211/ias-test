// Export all userProfile components and utilities
export { default as UserProfile } from './UserProfile';
export { default as ProfilePictureUpload } from './ProfilePictureUpload';
export { default as EnhancedAuthForm } from './EnhancedAuthForm';

// Export Firebase utilities
export {
  getUserProfile,
  updateUserProfile,
  createInitialUserProfile,
  addGameResult,
  addAchievement,
  updateLearningProgress,
  markSubCategoryCompleted,
  updateGameActivity
} from './firebaseUtils'; 