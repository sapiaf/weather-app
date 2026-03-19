/**
 * useTheme.js
 * Hook for theme management with system preference detection and localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "weather_theme";

/**
 * Custom hook for managing light/dark theme
 * @returns {Object} { theme, toggleTheme, setTheme }
 *   - theme: 'light' | 'dark'
 *   - toggleTheme: function to toggle between light and dark
 *   - setTheme: function to set a specific theme
 */
export function useTheme() {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = useCallback(() => {
    // Check localStorage first
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    // Fall back to system preference
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }

    return "dark";
  }, []);

  const [theme, setThemeState] = useState(getInitialTheme);

  // Update theme and persist to localStorage
  const setTheme = useCallback((newTheme) => {
    if (newTheme !== "light" && newTheme !== "dark") {
      console.warn("Theme must be 'light' or 'dark'");
      return;
    }
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newTheme);
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      // Only apply system preference if user hasn't explicitly set a preference
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return { theme, toggleTheme, setTheme };
}
