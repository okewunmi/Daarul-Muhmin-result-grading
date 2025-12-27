const DashboardPage = ({ user, onLogout, onNavigate, isDark, setIsDark }) => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'grades', label: 'Grades', icon: BarChart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'}`}>
      {/* Header */}
      <header className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white">
                  Daarul Muhmin Institute
                </h1>
                <p className="text-xs sm:text-sm text-gray-300">Student Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg transition-all hover:scale-110`}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="sm:hidden bg-gray-800 bg-opacity-50 border-b border-gray-700">
        <div className="flex justify-around">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
                activeTab === item.id
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden sm:block w-64 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeTab === item.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className={`${isDark ? 'bg-gray-800 bg-opacity-50' : 'bg-white'} backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-8`}>
              {activeTab === 'home' && (
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Welcome, {user.name}!
                  </h2>
                  <p className={`text-lg sm:text-xl mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {user.arabicName}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <div className={`p-4 sm:p-6 rounded-lg ${isDark ? 'bg-blue-600 bg-opacity-20' : 'bg-blue-50'} border ${isDark ? 'border-blue-500' : 'border-blue-200'}`}>
                      <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Enrolled Courses</h3>
                      <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>6</p>
                    </div>
                    
                    <div className={`p-4 sm:p-6 rounded-lg ${isDark ? 'bg-green-600 bg-opacity-20' : 'bg-green-50'} border ${isDark ? 'border-green-500' : 'border-green-200'}`}>
                      <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Average Grade</h3>
                      <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>85%</p>
                    </div>
                    
                    <div className={`p-4 sm:p-6 rounded-lg ${isDark ? 'bg-purple-600 bg-opacity-20' : 'bg-purple-50'} border ${isDark ? 'border-purple-500' : 'border-purple-200'}`}>
                      <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Attendance</h3>
                      <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>92%</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'grades' && (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    My Grades
                  </h2>
                  <div className={`${isDark ? 'bg-yellow-600 bg-opacity-20' : 'bg-yellow-50'} border ${isDark ? 'border-yellow-500' : 'border-yellow-200'} rounded-lg p-4 text-center`}>
                    <p className={`text-base sm:text-lg ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      📊 Grade view coming soon...
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    My Profile
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                      <p className={`p-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>{user.name}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Arabic Name</label>
                      <p className={`p-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`} dir="rtl">{user.arabicName}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                      <p className={`p-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Settings
                  </h2>
                  <div className={`${isDark ? 'bg-blue-600 bg-opacity-20' : 'bg-blue-50'} border ${isDark ? 'border-blue-500' : 'border-blue-200'} rounded-lg p-4 text-center`}>
                    <p className={`text-base sm:text-lg ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      ⚙️ Settings panel coming soon...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};


export default DashboardPage;