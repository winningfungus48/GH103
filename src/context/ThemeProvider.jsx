import React, { createContext, useContext, useEffect, useState } from 'react';

// Theme mode options:
// - 'light': always use light theme
// - 'dark': always use dark theme
// - 'system': follow OS/browser preference (prefers-color-scheme)
const ThemeContext = createContext();

const THEME_KEY = 'theme-mode';
const VALID_THEMES = ['light', 'dark', 'system'];

export const ThemeProvider = ({ children }) => {
  // theme: 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState('system');

  // On mount, initialize theme from localStorage or system preference
  useEffect(() => {
    let initialTheme = localStorage.getItem(THEME_KEY);
    if (!VALID_THEMES.includes(initialTheme)) {
      initialTheme = 'system';
    }
    if (initialTheme === 'system') {
      // Use OS/browser preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }
    setTheme(initialTheme);
    // Set data-theme attribute on <html>
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // When theme changes, persist to localStorage and update <html> attribute
  useEffect(() => {
    if (!theme) return;
    localStorage.setItem(THEME_KEY, theme);
    // If system, resolve to current system preference
    let appliedTheme = theme;
    if (theme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      appliedTheme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', appliedTheme);
  }, [theme]);

  // setTheme: accepts 'light', 'dark', or 'system'
  // UI toggle logic can call setTheme(mode) to change theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = () => useContext(ThemeContext); 