import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg ${
        isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'
      } shadow-lg transition-all hover:scale-110`}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};