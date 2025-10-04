'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'slug';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (theme) {
      // Critical step: Update the class on the HTML element
      document.documentElement.classList.remove('light', 'dark', 'slug');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
        if (prevTheme === 'light') return 'dark';
        if (prevTheme === 'dark') return 'slug';
        return 'light'; // Cycles from 'slug' back to 'light'
    });
  };

  if (!theme) return null; 

  // Determine which icon to show
  const icon = theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🐌';

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
      aria-label="Toggle theme mode"
    >
      {icon}
    </button>
  );
}