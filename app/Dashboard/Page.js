const DashboardPage = ({ user, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-semibold">{user.fullName}</h2>
              {user.arabicName && (
                <p className="text-sm text-gray-400" dir="rtl">{user.arabicName}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.fullName}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Courses</h3>
              <span className="text-3xl">📚</span>
            </div>
            <p className="text-3xl font-bold text-green-500">0</p>
            <p className="text-gray-400 text-sm mt-2">Enrolled courses</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Assignments</h3>
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-3xl font-bold text-yellow-500">0</p>
            <p className="text-gray-400 text-sm mt-2">Pending submissions</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Progress</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-blue-500">0%</p>
            <p className="text-gray-400 text-sm mt-2">Overall completion</p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <p className="text-lg">{user.fullName}</p>
            </div>

            {user.arabicName && (
              <div>
                <label className="text-gray-400 text-sm">Arabic Name</label>
                <p className="text-lg" dir="rtl">{user.arabicName}</p>
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <label className="text-gray-400 text-sm">Student ID</label>
              <p className="text-lg font-mono text-sm">{user.$id}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Browse Courses</h3>
            <p className="text-gray-400">Explore available courses and enroll</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">View Schedule</h3>
            <p className="text-gray-400">Check your class timetable</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;