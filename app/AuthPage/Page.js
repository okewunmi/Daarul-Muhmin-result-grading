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
import { AuthToggle } from '../../components/auth/AuthToggle';
import { LoginForm, RegisterForm } from '../../components/auth/AuthForm';
import { AuthForm } from '../../components/auth/AuthForm';
import { MessageAlert } from '../../components/common/MessageAlert';
import { adminUserManagement } from '../../lib/appwrite';

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

    const result = await adminUserManagement.login(formData.email, formData.password);
    
    setLoading(false);
    
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setTimeout(() => {
        onLogin(result.user);
      }, 1000);
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage({ text: 'Please fill in all required fields', type: 'error' });
      setLoading(false);
      return;
    }

    const result = await adminUserManagement.createUser(
      formData.name,
      formData.arabicName,
      formData.email,
      formData.password,
      formData.confirmPassword,
      'self-registration'
    );
    
    setLoading(false);
    
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
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
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="text-gray-300 hover:text-white transition-colors flex items-center text-sm sm:text-base"
          >
            ← Back to Home
          </button>
          
          <button
            onClick={() => setIsDark(!isDark)}
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

          <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />

          <MessageAlert message={message.text} type={message.type} />

          {isLogin ? (
            <LoginForm 
              data={formData}
              loading={loading}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onKeyPress={handleKeyPress}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          ) : (
            <RegisterForm
              data={formData}
              loading={loading}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onKeyPress={handleKeyPress}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default AuthPage;