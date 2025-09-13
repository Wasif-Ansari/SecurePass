'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // Update document class and save preference
    document.documentElement.classList.toggle('light-theme', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        fixed top-6 right-6 z-50 w-14 h-14 rounded-full
        glass border-2 border-blue-400/30 
        flex items-center justify-center
        transition-all duration-300 hover:scale-110
        hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-400/20
        group
      `}
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <div 
          className={`
            absolute inset-0 transition-all duration-300
            ${isDark ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}
          `}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-yellow-400"
          >
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Moon Icon */}
        <div 
          className={`
            absolute inset-0 transition-all duration-300
            ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'}
          `}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-blue-400"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor"
              strokeWidth="2"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Tooltip */}
      <div className={`
        absolute -bottom-12 left-1/2 transform -translate-x-1/2
        px-3 py-1 bg-black/80 text-white text-xs rounded-lg
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        pointer-events-none whitespace-nowrap
      `}>
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </div>
    </button>
  );
}