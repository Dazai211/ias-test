import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "../configs/ias-firebase-config";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Utility: Get user progress
export async function getUserProgress(userId) {
  const userDoc = doc(db, "users", userId);
  const userSnap = await getDoc(userDoc);
  if (userSnap.exists()) {
    return userSnap.data().lessonProgress || {};
  } else {
    return {};
  }
}

// Utility: Update content progress (mark content as completed)
export async function updateContentProgress(userId, categoryId, subCategoryId, contentId) {
  const userDoc = doc(db, "users", userId);
  const progressPath = `lessonProgress.${categoryId}.${subCategoryId}.contents.${contentId}`;
  await setDoc(userDoc, {
    lessonProgress: {
      [categoryId]: {
        [subCategoryId]: {
          contents: {
            [contentId]: { viewed: true, completed: true }
          }
        }
      }
    }
  }, { merge: true });
}

// Utility: Update subcategory progress (mark subcategory as completed)
export async function updateSubCategoryProgress(userId, categoryId, subCategoryId) {
  const userDoc = doc(db, "users", userId);
  const progressPath = `lessonProgress.${categoryId}.${subCategoryId}.completed`;
  await setDoc(userDoc, {
    lessonProgress: {
      [categoryId]: {
        [subCategoryId]: {
          completed: true
        }
      }
    }
  }, { merge: true });
} 