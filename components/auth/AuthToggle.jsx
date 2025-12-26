export const AuthToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 py-2 rounded-md transition-all ${
          isLogin
            ? 'bg-green-600 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        Login
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 py-2 rounded-md transition-all ${
          !isLogin
            ? 'bg-green-600 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        Register
      </button>
    </div>
  );
};