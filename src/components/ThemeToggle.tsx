import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '',
  showLabel = false 
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center gap-2 p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
        isDark 
          ? 'bg-slate-800/90 text-amber-300 hover:text-amber-200 hover:bg-slate-700/80 border border-slate-700/80 shadow-xs' 
          : 'bg-slate-100 text-slate-700 hover:text-[#0000B7] hover:bg-slate-200/80 border border-slate-200/80 shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Sun Icon for Dark Mode (Click to switch to light) */}
        <Sun 
          className={`w-4 h-4 transition-all duration-300 transform ${
            isDark 
              ? 'rotate-0 scale-100 opacity-100 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' 
              : '-rotate-90 scale-0 opacity-0 absolute'
          }`} 
        />
        {/* Moon Icon for Light Mode (Click to switch to dark) */}
        <Moon 
          className={`w-4 h-4 transition-all duration-300 transform ${
            isDark 
              ? 'rotate-90 scale-0 opacity-0 absolute' 
              : 'rotate-0 scale-100 opacity-100 text-slate-700'
          }`} 
        />
      </div>

      {showLabel && (
        <span className="capitalize tracking-wide font-medium">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};
