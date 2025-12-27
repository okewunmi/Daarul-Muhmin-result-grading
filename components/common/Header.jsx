import { BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Header = ({ isDark, onThemeToggle, instituteName, arabicName }) => (
  <header className="container mx-auto px-4 py-4 sm:py-6">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className={`p-2 rounded-lg ${isDark ? 'bg-green-600' : 'bg-green-500'}`}>
          <BookOpen className="text-white w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className={`text-base sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {instituteName}
          </h1>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {arabicName}
          </p>
        </div>
      </div>
      
      <button
        onClick={onThemeToggle}
        className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg transition-all hover:scale-110`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  </header>
);