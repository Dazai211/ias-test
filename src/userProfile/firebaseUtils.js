import { doc, getDoc, setDoc, updateDoc, collection, getDocs, increment, serverTimestamp, arrayUnion } from "firebase/firestore";
import { db } from "../library/firebase";
import { lessonStructure } from '../lessons/lessonStructure';
import { getLevelFromExp } from '../achievements/levelUtils';

// Utility: Get user profile
export async function getUserProfile(userId) {
  const userDoc = doc(db, "users", userId);
  const userSnap = await getDoc(userDoc);
  if (userSnap.exists()) {
    const profile = userSnap.data();
    
    // Migrate old gameHistory format if needed
    if (Array.isArray(profile.gameHistory)) {
      await migrateGameHistory(userId);
      // Fetch the updated profile after migration
      const updatedSnap = await getDoc(userDoc);
      return updatedSnap.data();
    }
    
    return profile;
  } else {
    return null;
  }
}

// Utility: Create or update user profile
export async function updateUserProfile(userId, profileData) {
  const userDoc = doc(db, "users", userId);
  await setDoc(userDoc, profileData, { merge: true });
}

// Utility: Create initial user profile
export async function createInitialUserProfile(userId, email, displayName = null, preferredLanguage = 'en') {
  const userDoc = doc(db, "users", userId);
  const initialProfile = {
    email: email,
    displayName: displayName || email.split('@')[0],
    lastLogin: new Date().toISOString(),
    profilePicture: null,
    preferences: {
      theme: 'static',
      language: preferredLanguage || 'en'
    },
    lessonProgress: {},
    achievements: [],
    gameHistory: {},
    gameProgress: {
      signQuest: 1, // Start with only Alphabet category unlocked
      signFlip: { easy: 1, normal: 0, hard: 0 },
      signSense: 1  // Start with only first category unlocked
    },
    gameActivity: {
      signFlip: 0,
      signQuest: 0,
      signSense: 0
    },
    exp: 0,
    unlockedTitles: [1],
    selectedTitle: 1,
    lastPlayed: new Date().toISOString()
  };
  
  await setDoc(userDoc, initialProfile);
  return initialProfile;
}

// Utility: Add game result (storage efficient - only keeps most recent per game)
export async function addGameResult(userId, gameData) {
  const userDoc = doc(db, "users", userId);
  const gameResult = {
    ...gameData,
    timestamp: new Date().toISOString()
  };
  
  const currentProfile = await getUserProfile(userId);
  const currentGameHistory = currentProfile?.gameHistory || {};
  
  // Only keep the most recent result for each game type
  const updatedGameHistory = {
    ...currentGameHistory,
    [gameData.gameName]: gameResult
  };
  
  await updateDoc(userDoc, {
    gameHistory: updatedGameHistory
  });
}

// ===== PROGRESSIVE GAME SYSTEM =====
// Utility: Unlock next game level/category
// This function increments the user's progress for a specific game
// Example: If signQuest was at level 2, it becomes level 3 (unlocking the 3rd category)
export async function unlockNextGameLevel(userId, gameName) {
  try {
    const userRef = doc(db, 'users', userId);
    
    if (gameName === 'signFlip') {
      // Handle SignFlip's nested structure
      const userDoc = await getDoc(userRef);
      const currentProgress = userDoc.data()?.gameProgress?.signFlip || { easy: 1, normal: 0, hard: 0 };
      
      // Determine which level to unlock next
      let newProgress = { ...currentProgress };
      
      if (currentProgress.easy < 80) {
        // Still unlocking Easy levels
        newProgress.easy = currentProgress.easy + 1;
      } else if (currentProgress.easy === 80 && currentProgress.normal === 0) {
        // All Easy levels completed, unlock Normal
        newProgress.normal = 1;
      } else if (currentProgress.normal < 80) {
        // Still unlocking Normal levels
        newProgress.normal = currentProgress.normal + 1;
      } else if (currentProgress.normal === 80 && currentProgress.hard === 0) {
        // All Normal levels completed, unlock Hard
        newProgress.hard = 1;
      } else if (currentProgress.hard < 80) {
        // Still unlocking Hard levels
        newProgress.hard = newProgress.hard + 1;
      }
      
      await updateDoc(userRef, {
        [`gameProgress.${gameName}`]: newProgress,
        updatedAt: new Date()
      });
    } else {
      // Handle other games with simple increment
      const userDoc = await getDoc(userRef);
      const currentProfile = userDoc.data();
      const currentGameProgress = currentProfile?.gameProgress || {};
      
      // Initialize gameProgress if it doesn't exist (for new users)
      if (!currentGameProgress[gameName]) {
        currentGameProgress[gameName] = 1;
      }
      
      // Increment the game's progress level
      const updatedGameProgress = {
        ...currentGameProgress,
        [gameName]: currentGameProgress[gameName] + 1
      };
      
      await updateDoc(userRef, {
        gameProgress: updatedGameProgress
      });
    }
  } catch (error) {
    console.error('Error unlocking next game level:', error);
  }
}

// Utility: Add achievement
export async function addAchievement(userId, achievement) {
  const userDoc = doc(db, "users", userId);
  const achievementData = {
    ...achievement,
    earnedAt: new Date().toISOString()
  };
  
  const currentProfile = await getUserProfile(userId);
  const updatedAchievements = [...(currentProfile?.achievements || []), achievementData];
  
  await updateDoc(userDoc, {
    achievements: updatedAchievements
  });
}

// Utility: Update learning progress
export async function updateLearningProgress(userId, categoryId, subCategoryId, contentId, completed = true) {
  const userDoc = doc(db, "users", userId);
  await setDoc(userDoc, {
    lessonProgress: {
      [categoryId]: {
        [subCategoryId]: {
          contents: {
            [contentId]: { viewed: true, completed }
          }
        }
      }
    }
  }, { merge: true });
}

// Utility: Mark subcategory as completed
export async function markSubCategoryCompleted(userId, categoryId, subCategoryId) {
  const userDoc = doc(db, "users", userId);
  await setDoc(userDoc, {
    lessonProgress: {
      [categoryId]: {
        [subCategoryId]: {
          completed: true
        }
      }
    }
  }, { merge: true });

  // Unlock Title 1 for Fundamentals, Title 2 for Everyday Words if all subcategories are completed
  const userSnap = await getDoc(userDoc);
  if (!userSnap.exists()) return;
  const userData = userSnap.data();
  const progress = userData.lessonProgress || {};

  // Helper to check if all subcategories are completed
  function allSubcategoriesCompleted(catId) {
    const subCats = Object.keys(lessonStructure[catId]?.subCategories || {});
    return subCats.every(subId => progress[catId]?.[subId]?.completed);
  }

  // Title 1: Fundamentals
  if (categoryId === 'fundamentals' && allSubcategoriesCompleted('fundamentals')) {
    await updateDoc(userDoc, { unlockedTitles: arrayUnion(1) });
  }
  // Title 2: Everyday Words
  if (categoryId === 'everydayWords' && allSubcategoriesCompleted('everydayWords')) {
    await updateDoc(userDoc, { unlockedTitles: arrayUnion(2) });
  }
  // Title 3: Additional Basics
  if (categoryId === 'additionalBasics' && allSubcategoriesCompleted('additionalBasics')) {
    await updateDoc(userDoc, { unlockedTitles: arrayUnion(3) });
  }
  // Title 4: Additional Basics (second title for completing all categories)
  if (categoryId === 'additionalBasics' && allSubcategoriesCompleted('additionalBasics')) {
    // Check if all three main categories are completed
    const allCategoriesCompleted = allSubcategoriesCompleted('fundamentals') && 
                                 allSubcategoriesCompleted('everydayWords') && 
                                 allSubcategoriesCompleted('additionalBasics');
    if (allCategoriesCompleted) {
      await updateDoc(userDoc, { unlockedTitles: arrayUnion(4) });
    }
  }
}

// Utility: Update game activity (increment play count)
export async function updateGameActivity(userId, gameName) {
  const userDoc = doc(db, "users", userId);
  const currentProfile = await getUserProfile(userId);
  const currentGameActivity = currentProfile?.gameActivity || {
    signFlip: 0,
    signQuest: 0,
    signSense: 0
  };
  
  // Map game names to activity keys
  const gameKeyMap = {
    'Sign Flip': 'signFlip',
    'Sign Quest': 'signQuest', 
    'Sign Sense': 'signSense'
  };
  
  const gameKey = gameKeyMap[gameName];
  if (gameKey) {
    currentGameActivity[gameKey] = (currentGameActivity[gameKey] || 0) + 1;
  }
  
  await updateDoc(userDoc, {
    gameActivity: currentGameActivity,
    lastLogin: new Date().toISOString()
  });
}

// Utility: Add EXP and update lastPlayed
export async function addExpAndUpdateLastPlayed(userId, expGained) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    exp: increment(expGained),
    lastPlayed: serverTimestamp()
  });
}

// Utility: Unlock a title for a user (by level or other criteria)
export async function unlockTitleForLevel(userId, titleId) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    unlockedTitles: arrayUnion(titleId)
  });
}

// Utility: Migrate old array-based gameHistory to new object-based structure
export async function migrateGameHistory(userId) {
  const userDoc = doc(db, "users", userId);
  const userSnap = await getDoc(userDoc);
  
  if (!userSnap.exists()) return;
  
  const currentProfile = userSnap.data();
  
  // Check if gameHistory is an array (old format)
  if (Array.isArray(currentProfile.gameHistory)) {
    const oldGameHistory = currentProfile.gameHistory;
    const newGameHistory = {};
    
    // Convert array to object, keeping only the most recent result per game
    oldGameHistory.forEach(gameResult => {
      const gameName = gameResult.gameName;
      const existingGame = newGameHistory[gameName];
      
      // Keep the most recent game result for each game type
      if (!existingGame || new Date(gameResult.timestamp) > new Date(existingGame.timestamp)) {
        newGameHistory[gameName] = gameResult;
      }
    });
    
    // Update the profile with the new structure
    await updateDoc(userDoc, {
      gameHistory: newGameHistory
    });
    
    console.log(`Migrated gameHistory for user ${userId} from array to object format`);
  }
} 

export async function migrateUserProfilesForAchievements() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  for (const userDoc of usersSnapshot.docs) {
    const data = userDoc.data();
    const updates = {};
    if (data.exp === undefined) updates.exp = 0;
    if (data.unlockedTitles === undefined) updates.unlockedTitles = [1];
    if (data.selectedTitle === undefined) updates.selectedTitle = 1;
    if (data.lastPlayed === undefined) updates.lastPlayed = new Date().toISOString();
    if (Object.keys(updates).length > 0) {
      await updateDoc(userDoc.ref, updates);
    }
  }
} 

// Utility: Award EXP and unlock titles every 3 levels (for titles 5-15)
export async function syncLevelTitles(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const user = userSnap.data();
  const exp = user.exp || 0;
  const level = typeof getLevelFromExp === 'function' ? getLevelFromExp(exp) : 1;

  // Titles 5–15 are unlocked at levels 3, 6, 9, ..., 33
  const titlesToUnlock = [];
  for (let lvl = 3; lvl <= level; lvl += 3) {
    const titleId = 5 + (Math.floor(lvl / 3) - 1);
    if (titleId >= 5 && titleId <= 15) {
      titlesToUnlock.push(titleId);
    }
  }
  if (titlesToUnlock.length > 0) {
    await updateDoc(userRef, {
      unlockedTitles: arrayUnion(...titlesToUnlock)
    });
  }
}

export async function awardExpAndUnlockTitles(userId) {
  // Add 50 EXP and get the new EXP value
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const user = userSnap.data();
  const prevExp = user.exp || 0;
  const prevLevel = typeof getLevelFromExp === 'function' ? getLevelFromExp(prevExp) : 1;
  const newExp = prevExp + 50;
  const newLevel = typeof getLevelFromExp === 'function' ? getLevelFromExp(newExp) : 1;

  await updateDoc(userRef, {
    exp: newExp,
    lastPlayed: serverTimestamp()
  });

  // Sync all eligible titles for current level
  await syncLevelTitles(userId);
} 