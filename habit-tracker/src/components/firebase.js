/*
 Overview
This module configures and initializes Firebase authentication services for the Habit Tracker application. It sets up the Firebase app instance and provides authentication utilities with Google sign-in capabilities.

Key Features
1. Firebase Initialization
Configures the Firebase application with project-specific credentials

Initializes authentication services

Sets up Google authentication provider

2. Authentication Services
Provides auth instance for all authentication operations

Configures Google authentication provider with custom parameters

Exports both the auth instance and provider for use throughout the app
*/
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Important for Netlify
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };
export default app;