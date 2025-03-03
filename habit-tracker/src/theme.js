import { useTheme } from './context/ThemeContext';

// For components that can't use hooks
export const theme = {
  colors: {
    primaryGradient: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)',
    background: 'linear-gradient(135deg, #2b3a67 0%, #1a2233 100%)',
    secondary: '#10B981',
    accent: '#3B82F6',
    text: '#FFFFFF',
    glassWhite: 'rgba(182, 86, 214, 0.1)',
    borderWhite: 'rgba(255, 255, 255, 0.1)',
    sidebar: 'rgba(255, 255, 255, 0.1)',
    card: 'rgba(255, 255, 255, 0.1)'
  }
};

// For components using hooks
export const useAppTheme = () => {
  const { currentTheme } = useTheme();
  return currentTheme.colors;
};
