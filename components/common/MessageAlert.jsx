
export const MessageAlert = ({ message, type }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-green-500 bg-opacity-20 border-green-500 text-green-300',
    error: 'bg-red-500 bg-opacity-20 border-red-500 text-red-300',
    info: 'bg-blue-500 bg-opacity-20 border-blue-500 text-blue-300'
  };

  return (
    <div className={`mb-4 p-3 rounded-lg border ${styles[type] || styles.info}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
};