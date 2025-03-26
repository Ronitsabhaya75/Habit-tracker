import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBw8ivhbvAaAbSuHfIgUkBMXyWdXCh6zL8",
  authDomain: "habit-tracker-758ec.firebaseapp.com",
  projectId: "habit-tracker-758ec",
  storageBucket: "habit-tracker-758ec.firebasestorage.app",
  messagingSenderId: "527300725104",
  appId: "1:527300725104:web:6828ab6eef03975c7fe7b5",
  measurementId: "G-CLYLS1FBZR"
}
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Important for Netlify
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };
export default app;