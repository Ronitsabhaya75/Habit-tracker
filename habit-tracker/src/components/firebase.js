import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "get_your_own",
    authDomain: "get_your_own",
    projectId: "get_your_own",
    storageBucket: "get_your_own",
    messagingSenderId: "get_your_own",
    appId: "get_your_own",
    measurementId: "get-your-own"
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