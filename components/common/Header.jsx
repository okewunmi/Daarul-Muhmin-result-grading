import { BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header = ({ isDark, onThemeToggle, instituteName, arabicName }) => {
  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-green-600' : 'bg-green-500'}`}>
            <BookOpen className="text-white" size={32} />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {instituteName}
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {arabicName}
            </p>
          </div>
        </div>
        
        <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
      </div>
    </header>
  );
};