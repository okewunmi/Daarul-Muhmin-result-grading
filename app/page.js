'use client'
import { useState, useEffect } from 'react';
import HomePage from './HomePage/Page';
import AuthPage from './AuthPage/Page';
import DashboardPage from './Dashboard/Page';
import { appwriteAuth  } from '../lib/appwrite';

export default function App() {
  const [currentPage, setCurrentPage] = useState('auth'); // 'auth', 'home', 'dashboard'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      // Check localStorage for saved user session
      const currentUser = await appwriteAuth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('auth');
      }
    } catch (error) {
      console.error('Error checking current user:', error);
      setCurrentPage('auth');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // Save user to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await appwriteAuth.logout();
    setUser(null);
    setCurrentPage('auth');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Render appropriate page based on currentPage state
  return (
    <>
      {currentPage === 'auth' && (
        <AuthPage 
          onNavigate={handleNavigate}
          onLogin={handleLogin}
        />
      )}

      {currentPage === 'home' && (
        <HomePage 
          onNavigate={handleNavigate}
          user={user}
        />
      )}

      {currentPage === 'dashboard' && user && (
        <DashboardPage 
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}