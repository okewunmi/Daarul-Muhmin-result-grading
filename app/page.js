// 'use client'
// import { useState } from 'react';
// import AuthPage from './AuthPage/Page';
// import DashboardPage from './Dashboard/Page';
// import HomePage from './HomePage/Page';
// import { appwriteAuth } from '../lib/appwrite';
// import { Toaster } from 'react-hot-toast';

// const App = () => {
//   const [currentPage, setCurrentPage] = useState('auth'); // 'auth' or 'dashboard'
//   const [user, setUser] = useState(null);
//   const [isDark, setIsDark] = useState(true);

//   const handleLogin = (userData) => {
//     setUser(userData);
//     setCurrentPage('dashboard');
//   };

//   const handleLogout = async () => {
//     const result = await appwriteAuth.logout();
//     if (result.success) {
//       setUser(null);
//       setCurrentPage('auth');
//     }
//   };

//   const handleNavigate = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <>
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: '#1f2937',
//             color: '#fff',
//             border: '1px solid #374151'
//           },
//           success: {
//             iconTheme: {
//               primary: '#10b981',
//               secondary: '#fff',
//             },
//           },
//           error: {
//             iconTheme: {
//               primary: '#ef4444',
//               secondary: '#fff',
//             },
//           },
//         }}
//       />

//       {currentPage === 'auth' && (
//         <AuthPage 
//           onNavigate={handleNavigate}
//           onLogin={handleLogin}
//           isDark={isDark}
//           setIsDark={setIsDark}
//         />
//       )}

//       {currentPage === 'dashboard' && user && (
//         <DashboardPage 
//           user={user}
//           onLogout={handleLogout}
//           isDark={isDark}
//           setIsDark={setIsDark}
//         />
//       )}
//     </>
//   );
// };

// export default App;


'use client'
import { useState } from 'react';
import AuthPage from './AuthPage/Page';
import DashboardPage from './Dashboard/Page';
import HomePage from './HomePage/Page';
import { appwriteAuth } from '../lib/appwrite';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); // Start with 'home'
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(true);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    const result = await appwriteAuth.logout();
    if (result.success) {
      setUser(null);
      setCurrentPage('home'); // Go back to home page after logout
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {currentPage === 'home' && (
        <HomePage
          onNavigate={handleNavigate}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      )}

      {currentPage === 'auth' && (
        <AuthPage 
          onNavigate={handleNavigate}
          onLogin={handleLogin}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      )}

      {currentPage === 'dashboard' && user && (
        <DashboardPage 
          user={user}
          onLogout={handleLogout}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      )}
    </>
  );
};

export default App;