// 'use client'
// import { useState } from 'react';
// import { BookOpen , Sun, Moon} from 'lucide-react';
// import { AuthToggle } from '../../components/auth/AuthToggle';
// import { LoginForm, RegisterForm } from '../../components/auth/AuthForm';
// import { AuthForm } from '../../components/auth/AuthForm';
// import { MessageAlert } from '../../components/common/MessageAlert';
// import {adminUserManagement } from '../../lib/appwrite';

// const AuthPage = ({ onNavigate, onLogin, isDark, setIsDark }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     arabicName: '',
//     confirmPassword: ''
//   });

//   const handleSubmit = async () => {
//     if (isLogin) {
//       await handleLogin();
//     } else {
//       await handleRegister();
//     }
//   };

//   const handleLogin = async () => {
//     setLoading(true);
//     setMessage({ text: '', type: '' });

//     if (!formData.email || !formData.password) {
//       setMessage({ text: 'Please fill in all fields', type: 'error' });
//       setLoading(false);
//       return;
//     }

//     const result = await adminUserManagement.login(formData.email, formData.password);
    
//     setLoading(false);
    
//     if (result.success) {
//       setMessage({ text: result.message, type: 'success' });
//       setTimeout(() => {
//         onLogin(result.user);
//       }, 1000);
//     } else {
//       setMessage({ text: result.message, type: 'error' });
//     }
//   };

//   const handleRegister = async () => {
//     setLoading(true);
//     setMessage({ text: '', type: '' });

//     if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
//       setMessage({ text: 'Please fill in all required fields', type: 'error' });
//       setLoading(false);
//       return;
//     }

//     const result = await adminUserManagement.createUser(
//       formData.name,
//       formData.arabicName,
//       formData.email,
//       formData.password,
//       formData.confirmPassword,
//       'self-registration'
//     );
    
//     setLoading(false);
    
//     if (result.success) {
//       setMessage({ text: result.message, type: 'success' });
//       setTimeout(() => {
//         setIsLogin(true);
//         setFormData({
//           email: formData.email,
//           password: '',
//           name: '',
//           arabicName: '',
//           confirmPassword: ''
//         });
//         setMessage({ text: 'Please login with your credentials', type: 'success' });
//       }, 1500);
//     } else {
//       setMessage({ text: result.message, type: 'error' });
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleKeyPress = (e, action) => {
//     if (e.key === 'Enter') {
//       action();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4 py-8">
//       <div className="max-w-md w-full">
//         <div className="flex justify-between items-center mb-6">
//           <button
//             onClick={() => onNavigate('HomePage')}
//             className="text-gray-300 hover:text-white transition-colors flex items-center text-sm sm:text-base"
//           >
//             ← Back to Home
//           </button>
          
//           <button
//             onClick={() => setIsDark(!isDark)}
//             className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg transition-all hover:scale-110`}
//           >
//             {isDark ? <Sun size={20} /> : <Moon size={20} />}
//           </button>
//         </div>

//         <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8">
//           <div className="text-center mb-6 sm:mb-8">
//             <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-green-600 flex items-center justify-center">
//               <BookOpen className="text-white" size={32} />
//             </div>
//             <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
//               Daarul Muhmin Institute
//             </h2>
//             <p className="text-gray-300 text-xs sm:text-sm">
//               معهد دار المؤمن
//             </p>
//           </div>

//           <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />

//           <MessageAlert message={message.text} type={message.type} />

//           {isLogin ? (
//             <LoginForm 
//               data={formData}
//               loading={loading}
//               onChange={handleChange}
//               onSubmit={handleSubmit}
//               onKeyPress={handleKeyPress}
//             />
//           ) : (
//             <RegisterForm
//               data={formData}
//               loading={loading}
//               onChange={handleChange}
//               onSubmit={handleSubmit}
//               onKeyPress={handleKeyPress}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


// export default AuthPage;

'use client'
import { useState } from 'react';
import { BookOpen, Sun, Moon, Eye, EyeOff } from 'lucide-react';

const AuthPage = ({ onNavigate, onLogin, isDark, setIsDark }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    arabicName: '',
    confirmPassword: ''
  });

  const handleSubmit = async () => {
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!formData.email || !formData.password) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      setLoading(false);
      return;
    }

    // Simulated login for demo
    setTimeout(() => {
      setMessage({ text: 'Login successful!', type: 'success' });
      setLoading(false);
    }, 1000);
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage({ text: 'Please fill in all required fields', type: 'error' });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      setLoading(false);
      return;
    }

    // Simulated registration for demo
    setTimeout(() => {
      setMessage({ text: 'Registration successful!', type: 'success' });
      setLoading(false);
      setTimeout(() => {
        setIsLogin(true);
        setFormData({
          email: formData.email,
          password: '',
          name: '',
          arabicName: '',
          confirmPassword: ''
        });
        setMessage({ text: 'Please login with your credentials', type: 'success' });
      }, 1500);
    }, 1000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => onNavigate?.('HomePage')}
            className="text-gray-300 hover:text-white transition-colors flex items-center text-sm sm:text-base"
          >
            ← Back to Home
          </button>
          
          <button
            onClick={() => setIsDark?.(!isDark)}
            className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg transition-all hover:scale-110`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-green-600 flex items-center justify-center">
              <BookOpen className="text-white" size={32} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Daarul Muhmin Institute
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              معهد دار المؤمن
            </p>
          </div>

          {/* Auth Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'error' 
                ? 'bg-red-500 bg-opacity-20 text-red-300 border border-red-500' 
                : 'bg-green-500 bg-opacity-20 text-green-300 border border-green-500'
            }`}>
              {message.text}
            </div>
          )}

          {/* Forms */}
          {isLogin ? (
            // Login Form
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          ) : (
            // Register Form
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Arabic Name (Optional)</label>
                <input
                  type="text"
                  value={formData.arabicName}
                  onChange={(e) => handleChange('arabicName', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="أدخل اسمك بالعربية"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;