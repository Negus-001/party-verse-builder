
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

// Helper function to format Firestore Timestamp to string
export const formatTimestamp = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) return '';
  return timestamp.toDate().toISOString();
};

export default app;
