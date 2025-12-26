const DashboardPage = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
              <p className="text-gray-300">Student Dashboard</p>
            </div>
            <button
              onClick={onLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="bg-green-600 bg-opacity-20 border border-green-500 rounded-lg p-6 text-center">
            <p className="text-xl mb-2">🎉 Successfully logged in!</p>
            <p className="text-gray-300">Dashboard features coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;