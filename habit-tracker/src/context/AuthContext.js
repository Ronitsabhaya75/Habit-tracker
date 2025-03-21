import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
<<<<<<< HEAD
  const [user, setUser] = useState({ name: 'Guest' }); // Added user object for Dashboard compatibility

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData || { name: 'User' });
=======

  const login = () => {
    setIsAuthenticated(true);
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
<<<<<<< HEAD
    setUser(null);
=======
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
    localStorage.removeItem('isLoggedIn');
  };

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
=======
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
      {children}
    </AuthContext.Provider>
  );
};

<<<<<<< HEAD
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
=======

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
>>>>>>> b6fad21e19d8d1b5f44ee51762ca8efbcc9c63bf
