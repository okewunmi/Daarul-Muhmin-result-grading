export const MessageAlert = ({ message, type }) => {
  if (!message) return null;
  
  return (
    <div className={`mb-4 p-3 rounded-lg text-sm sm:text-base ${
      type === 'success'
        ? 'bg-green-600 bg-opacity-20 text-green-300 border border-green-500'
        : 'bg-red-600 bg-opacity-20 text-red-300 border border-red-500'
    }`}>
      {message}
    </div>
  );
};

