
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkPk13VgFAqCeatoXEozYf-Vrx3FA1pVY",
  authDomain: "event-management-app-c7d2c.firebaseapp.com",
  projectId: "event-management-app-c7d2c",
  storageBucket: "event-management-app-c7d2c.firebasestorage.app",
  messagingSenderId: "762643014132",
  appId: "1:762643014132:web:3e04be38e5982ee08159a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logoutUser = () => {
  return signOut(auth);
};

// Enhanced helper functions for Firestore Timestamp
export const formatTimestamp = (timestamp: Timestamp | undefined | null): string => {
  if (!timestamp) return '';
  
  try {
    if (typeof timestamp === 'object' && 'toDate' in timestamp) {
      return timestamp.toDate().toLocaleString();
    } else if (typeof timestamp === 'string') {
      return timestamp;
    } else {
      console.error("Invalid timestamp format:", timestamp);
      return 'Invalid date';
    }
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return 'Invalid date';
  }
};

// Format timestamp specifically for display in event cards
export const formatEventDate = (timestamp: Timestamp | string | undefined | null): string => {
  if (!timestamp) return '';
  
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  
  try {
    if (typeof timestamp === 'object' && 'toDate' in timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      console.error("Invalid timestamp format:", timestamp);
      return 'Invalid date';
    }
  } catch (error) {
    console.error("Error formatting event date:", error);
    return 'Invalid date';
  }
};

export default app;
