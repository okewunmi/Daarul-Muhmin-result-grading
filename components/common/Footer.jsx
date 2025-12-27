export const Footer = ({ isDark, copyrightText }) => (
  <footer className={`container mx-auto px-4 py-6 sm:py-8 mt-16 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
    <p className={`text-center text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      {copyrightText}
    </p>
  </footer>
);
