import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components"; // Import ThemeProvider
import { AuthProvider } from './context/AuthContext'; // Ensure this path is correct
import { theme } from './theme'; // Import your theme
import App from "./App";

// AuthInitializer Component
const AuthInitializer = ({ children }) => {
  React.useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      // Call login logic directly in your component
    }
  }, []);

  return children;
};

// Get the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render App inside AuthProvider and ThemeProvider
root.render(
  <AuthProvider>
    <ThemeProvider theme={theme}> {/* Wrap with ThemeProvider */}
      <AuthInitializer>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthInitializer>
    </ThemeProvider>
  </AuthProvider>
);