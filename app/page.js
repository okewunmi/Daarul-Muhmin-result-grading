"use client"
import { useState, useEffect } from 'react';
import HomePage from './HomePage/Page';
import AuthPage from './AuthPage/Page';
import DashboardPage from './Dashboard/Page';
import { appwriteAuth } from '../lib/appwrite';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const currentUser = await appwriteAuth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    const result = await appwriteAuth.logout();
    if (result.success) {
      setUser(null);
      setCurrentPage('home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return user ? (
          <DashboardPage user={user} onLogout={handleLogout} />
        ) : (
          <HomePage onNavigate={setCurrentPage} />
        );
      case 'auth':
        return <AuthPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
};

export default App;