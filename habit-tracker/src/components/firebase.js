import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD7JasyKV8fqTNKBiY8Jv4oyEPaBkVrIP0",
    authDomain: "habit-tracker-6ee53.firebaseapp.com",
    projectId: "habit-tracker-6ee53",
    storageBucket: "habit-tracker-6ee53.firebasestorage.app",
    messagingSenderId: "104092658271",
    appId: "1:104092658271:web:5b11f78599492587a109ea",
    measurementId: "G-2CTB5HKS9J"
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