import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Add this import

const firebaseConfig = {
    apiKey: "get_your_own",
    authDomain: "get_your_own",
    projectId: "get_your_own",
    storageBucket: "get_your_own",
    messagingSenderId: "get_your_own",
    appId: "get_your_own",
    measurementId: "get_your_own"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export authentication
export const auth = getAuth(app);

export default app;