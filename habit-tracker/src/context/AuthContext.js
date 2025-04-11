import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../components/firebase';
import { authAPI } from '../api/api';

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
          // Get the token and verify with backend
          const token = await firebaseUser.getIdToken();
          const { user: backendUser } = await authAPI.verifyToken(token);
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
        const token = await auth.currentUser.getIdToken();
        const { user: backendUser } = await authAPI.getProfile(token);
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