'use client'
import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { AuthToggle } from '../../components/auth/AuthToggle';
import { AuthForm } from '../../components/auth/AuthForm';
import {adminUserManagement } from '../../lib/appwrite';

const AuthPage = ({ onNavigate, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
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

    // Validate inputs
    if (!formData.email || !formData.password) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      setLoading(false);
      return;
    }

    const result = await adminUserManagement.login(
      formData.email, 
      formData.password
    );
    
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

    // Validate inputs
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

    const result = await adminUserManagement.createUser(
      formData.name,
      formData.arabicName,
      formData.email,
      formData.password,
      formData.confirmPassword,
      'self-registration' // You can change this to track who created the account
    );
    
    setLoading(false);
    
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setTimeout(() => {
        setIsLogin(true);
        setFormData({
          email: formData.email, // Keep email for easy login
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => onNavigate('home')}
          className="mb-6 text-gray-300 hover:text-white transition-colors flex items-center"
        >
          ← Back to Home
        </button>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-600 flex items-center justify-center">
              <BookOpen className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Daarul Muhmin Institute
            </h2>
            <p className="text-gray-300 text-sm">
              معهد دار المؤمن
            </p>
          </div>

          <AuthToggle 
            isLogin={isLogin} 
            onToggle={setIsLogin}
          />

          <AuthForm
            isLogin={isLogin}
            formData={formData}
            loading={loading}
            message={message}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* <p className="text-center text-gray-400 mt-6 text-sm">
          For school administration access, please contact IT support
        </p> */}
      </div>
    </div>
  );
};

export default AuthPage;