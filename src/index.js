import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; // Make sure this is correct
import App from "./App";

// AuthInitializer Component
const AuthInitializer = ({ children }) => {
  // You don't need to use AuthContext here
  React.useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      // Call login logic directly in your component
    }
  }, []);

  return children;
};

// Get the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render App inside AuthProvider
root.render(
  <AuthProvider>
    <AuthInitializer>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthInitializer>
  </AuthProvider>
);
