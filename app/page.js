'use client'
import { useState, useEffect } from 'react';
import HomePage from './HomePage/Page';
import AuthPage from './AuthPage/Page';
import DashboardPage from './Dashboard/Page';
import { appwriteAuth  } from '../lib/appwrite';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const currentUser = await appwriteAuth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    } catch (error) {
      console.error('Error checking current user:', error);
      setCurrentPage('home');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await appwriteAuth.logout();
    setUser(null);
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg sm:text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'home' && (
        <HomePage 
          onNavigate={setCurrentPage}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      )}

      {currentPage === 'auth' && (
        <AuthPage 
          onNavigate={setCurrentPage}
          onLogin={handleLogin}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      )}

      {currentPage === 'dashboard' && user && (
        <DashboardPage 
          user={user}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      )}
    </>
  );
};

export default App;
