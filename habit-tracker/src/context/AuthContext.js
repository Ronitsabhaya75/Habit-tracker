import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../components/firebase';
import { verifyToken, getUserProfile } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verify token with backend
          const { user: backendUser } = await verifyToken();
          setUser(backendUser);
        } catch (error) {
          console.error('Error verifying token:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUserData = async () => {
    if (auth.currentUser) {
      try {
        const { user: backendUser } = await getUserProfile();
        setUser(backendUser);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  const value = {
    user,
    loading,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;