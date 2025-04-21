import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300
                 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 
                 focus:ring-gray-500 dark:focus:ring-gray-400"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle; 