export const FeatureCard = ({ isDark, icon: Icon, title, description, colorClass }) => {
  return (
    <div className={`p-6 rounded-xl ${
      isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-white'
    } shadow-xl backdrop-blur-sm`}>
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${colorClass} flex items-center justify-center`}>
        <Icon className="text-white" size={32} />
      </div>
      <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h3>
      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
        {description}
      </p>
    </div>
  );
};