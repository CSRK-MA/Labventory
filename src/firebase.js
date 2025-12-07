// src/firebase.js
// Firebase Configuration and Initialization

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
// Replace these placeholder values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy2YTRu1dBUEFBy-fU7RFbP1bLTHT3DPE",
  authDomain: "edutrack-106d2.firebaseapp.com",
  projectId: "edutrack-106d2",
  storageBucket: "edutrack-106d2.firebasestorage.app",
  messagingSenderId: "128822490928",
  appId: "1:128822490928:web:ed4f33035bebd579327af5"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const db = getFirestore(app);        // Firestore Database
export const auth = getAuth(app);           // Authentication
export const storage = getStorage(app);     // Cloud Storage

// Export the app instance
export default app;

// Collection names (centralized for easy management)
export const COLLECTIONS = {
  EQUIPMENT: 'equipment',
  CHEMICALS: 'chemicals',
  CHECKINOUT: 'checkInOut',
  MAINTENANCE: 'maintenance',
  USERS: 'users',
  LABS: 'labs',
  CATEGORIES: 'categories',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports'
};
