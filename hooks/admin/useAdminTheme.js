"use client";
import { useEffect, useState } from "react";

export function useAdminTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("admin-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    // Apply theme changes to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setTheme = (theme) => {
    const isDark = theme === "dark";
    setIsDarkMode(isDark);
  };

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
  };
}
