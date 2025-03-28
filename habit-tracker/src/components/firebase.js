
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

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
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Important for Netlify
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Function to create or update user profile in Firestore
const createUserProfile = async (user) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  
  try {
    await setDoc(userRef, {
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      totalXP: 0,
      lastLogin: new Date(),
      createdAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
};

// Function to update user XP
const updateUserXP = async (userId, xpToAdd) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      totalXP: increment(xpToAdd),
      lastXPUpdate: new Date()
    });
  } catch (error) {
    console.error('Error updating user XP:', error);
  }
};

// Function to fetch leaderboard
const fetchLeaderboard = async () => {
  try {
    const leaderboardQuery = query(
      collection(db, 'users'), 
      orderBy('totalXP', 'desc'), 
      limit(10)
    );

    const querySnapshot = await getDocs(leaderboardQuery);
    
    return querySnapshot.docs.map((doc, index) => ({
      rank: index + 1,
      id: doc.id,
      name: doc.data().displayName || doc.data().email,
      xp: doc.data().totalXP || 0
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export { 
  app, 
  auth, 
  db, 
  googleProvider, 
  createUserProfile, 
  updateUserXP, 
  fetchLeaderboard 
};