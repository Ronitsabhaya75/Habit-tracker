import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "get_your_own",
    authDomain: "get_your_own",
    projectId: "get_your_own",
    storageBucket: "get_your_own",
    messagingSenderId: "get_your_own",
    appId: "get_your_own",
    measurementId: "get-your-own"
  };

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const analytics = getAnalytics(app);

// Export authentication
export const auth = getAuth(app);

export default app;