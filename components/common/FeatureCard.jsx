export  const FeatureCard = ({ isDark, icon: Icon, title, description, colorClass }) => (
  <div className={`p-4 sm:p-6 rounded-xl ${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-white'} shadow-xl backdrop-blur-sm`}>
    <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full ${colorClass} flex items-center justify-center`}>
      <Icon className="text-white" size={24} />
    </div>
    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {title}
    </h3>
    <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
      {description}
    </p>
  </div>
);

