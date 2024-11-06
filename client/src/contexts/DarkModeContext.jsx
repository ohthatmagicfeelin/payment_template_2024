import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext(null);

export function DarkModeProvider({ children }) {
  // Initialize state based on localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // First check localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    // If no localStorage value, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save to localStorage whenever mode changes
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    // Toggle dark class on html element
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference (no localStorage value)
      if (!localStorage.getItem('darkMode')) {
        setIsDarkMode(e.matches);
      }
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Optional: Add method to reset to system preference
  const resetToSystemPreference = () => {
    localStorage.removeItem('darkMode');
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  return (
    <DarkModeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode,
      resetToSystemPreference 
    }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}; 