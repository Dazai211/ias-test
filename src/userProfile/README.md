# User Profile System

This folder contains the comprehensive user profile management system for the IT'S A SIGN FSL learning application.

## Components

### UserProfile.jsx
The main user profile component that provides:
- **Overview Tab**: User stats (lessons completed, signs learned) and game activity
- **Progress Tab**: Detailed progress tracking across all lesson categories
- **Achievements Tab**: User achievements and badges
- **Settings Tab**: Profile management, preferences, and account settings

### ProfilePictureUpload.jsx
A component for uploading and managing user profile pictures:
- Image upload with validation (type and size)
- Base64 storage for profile pictures
- Remove picture functionality
- Error handling and loading states

### EnhancedAuthForm.jsx
An enhanced authentication form that:
- Integrates with the UserProfile system
- Automatically creates user profiles on registration
- Supports email/password and Google OAuth
- Seamlessly transitions to profile view after login

## Firebase Utilities (firebaseUtils.js)

### User Profile Management
- `getUserProfile(userId)` - Retrieve user profile data
- `updateUserProfile(userId, profileData)` - Update user profile
- `createInitialUserProfile(userId, email, displayName)` - Create new user profile

### Learning Progress
- `updateLearningProgress(userId, categoryId, subCategoryId, contentId, completed)` - Track lesson progress
- `markSubCategoryCompleted(userId, categoryId, subCategoryId)` - Mark subcategory as completed

### Game Activity
- `updateGameActivity(userId, gameName)` - Increment game play count for specific game
- `addAchievement(userId, achievement)` - Award achievements

## User Profile Data Structure

```javascript
{
  email: string,
  displayName: string,
  lastLogin: string (ISO date),
  profilePicture: string (base64) | null,
  preferences: {
    theme: 'default' | 'dark' | 'light',
    notifications: boolean,
    language: string
  },
  lessonProgress: {
    [categoryId]: {
      [subCategoryId]: {
        completed: boolean,
        contents: {
          [contentId]: {
            viewed: boolean,
            completed: boolean
          }
        }
      }
    }
  },
  achievements: Array<{
    title: string,
    description: string,
    earnedAt: string (ISO date)
  }>,
  gameHistory: {
    [gameName]: {
      gameName: string,
      score: number,
      timestamp: string (ISO date)
    }
  },
  gameActivity: {
    signFlip: number,
    signQuest: number,
    signSense: number
  }
}
```

## Usage

### Basic Import
```javascript
import { UserProfile, EnhancedAuthForm } from '../userProfile';
```

### Creating a User Profile
```javascript
import { createInitialUserProfile } from '../userProfile';

// After user registration
await createInitialUserProfile(user.uid, user.email, user.displayName);
```

### Tracking Game Activity
```javascript
import { updateGameActivity } from '../userProfile';

await updateGameActivity(userId, 'Sign Quest');
```

### Tracking Learning Progress
```javascript
import { updateLearningProgress } from '../userProfile';

await updateLearningProgress(userId, 'fundamentals', 'alphabet', 'A', true);
```

## Integration

The userProfile system is integrated into the main application through:
- `WebAccountPage.jsx` - Uses EnhancedAuthForm for the account page
- Automatic profile creation on user registration
- Seamless transition between authentication and profile management
- Game activity tracking in all three games (SignFlip, SignQuest, SignSense)

## Features

### Overview Tab
- **Lessons Completed**: Real-time count of completed subcategories (calculated from lessonProgress)
- **Signs Learned**: Total number of individual signs completed (calculated from lessonProgress)
- **Game Activity**: Play count for each game (SignFlip, SignQuest, SignSense)

### Progress Tab
- Detailed progress tracking for all lesson categories
- Expandable subcategory progress with individual sign completion
- Real-time progress bars and completion status

### Achievements Tab
- Display earned achievements with descriptions
- Encouraging message for users without achievements yet

### Settings Tab
- Profile picture management
- Display name editing
- Theme and notification preferences
- Account management options

## Storage Optimization

The system is optimized for Firebase storage by:
- **Calculating stats on-demand** from lessonProgress data instead of storing redundant stats
- Using game activity counts instead of storing individual game results
- Storing only the most recent game result per game type (instead of full history)
- Updating existing data rather than creating new entries
- Efficient data structure for lesson progress tracking
- Automatic migration of old array-based gameHistory to new object-based format 