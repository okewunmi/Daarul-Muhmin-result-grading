"use client"
import { MessageAlert } from '../common/MessageAlert';

export const AuthForm = ({
  isLogin,
  formData,
  loading,
  message,
  onChange,
  onSubmit,
  onKeyPress
}) => {
  return (
    <>
      <MessageAlert message={message.text} type={message.type} />

      {isLogin ? (
        <LoginForm
          data={formData}
          loading={loading}
          onChange={onChange}
          onSubmit={onSubmit}
          onKeyPress={onKeyPress}
        />
      ) : (
        <RegisterForm
          data={formData}
          loading={loading}
          onChange={onChange}
          onSubmit={onSubmit}
          onKeyPress={onKeyPress}
        />
      )}
    </>
  );
};


const LoginForm = ({ data, loading, onChange, onSubmit, onKeyPress }) => (
  <div>
    <div className="mb-4">
      <label className="block text-gray-300 mb-2 text-sm sm:text-base">Email</label>
      <input
        type="email"
        required
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
        onKeyPress={(e) => onKeyPress(e, onSubmit)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="student@example.com"
        disabled={loading}
      />
    </div>

    <div className="mb-6">
      <label className="block text-gray-300 mb-2 text-sm sm:text-base">Password</label>
      <input
        type="password"
        required
        value={data.password}
        onChange={(e) => onChange('password', e.target.value)}
        onKeyPress={(e) => onKeyPress(e, onSubmit)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="••••••••"
        disabled={loading}
      />
    </div>

    <button
      onClick={onSubmit}
      disabled={loading}
      className="w-full py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </div>
);

const RegisterForm = ({ data, loading, onChange, onSubmit, onKeyPress }) => (
  <div>
    <div className="mb-4">
      <label className="block text-gray-300 mb-2 text-sm sm:text-base">
        Full Name <span className="text-red-400">*</span>
      </label>
      <input
        type="text"
        required
        value={data.name}
        onChange={(e) => onChange('name', e.target.value)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your name"
        disabled={loading}
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-300 mb-2 text-sm sm:text-base">
        Arabic Name (الاسم بالعربية) <span className="text-gray-500 text-sm">(Optional)</span>
      </label>
      <input
        type="text"
        value={data.arabicName || ''}
        onChange={(e) => onChange('arabicName', e.target.value)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="أدخل اسمك بالعربية"
        dir="rtl"
        disabled={loading}
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-300 mb-2 text-sm sm:text-base">
        Email <span className="text-red-400">*</span>
      </label>
      <input
        type="email"
        required
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="student@example.com"
        disabled={loading}
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-300 mb-2 text-sm sm:text-base">
        Password <span className="text-red-400">*</span>
      </label>
      <input
        type="password"
        required
        value={data.password}
        onChange={(e) => onChange('password', e.target.value)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="••••••••"
        disabled={loading}
      />
      <p className="text-gray-400 text-xs mt-1">Minimum 8 characters</p>
    </div>

    <div className="mb-6">
      <label className="block text-gray-300 mb-2 text-sm sm:text-base">
        Confirm Password <span className="text-red-400">*</span>
      </label>
      <input
        type="password"
        required
        value={data.confirmPassword}
        onChange={(e) => onChange('confirmPassword', e.target.value)}
        onKeyPress={(e) => onKeyPress(e, onSubmit)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="••••••••"
        disabled={loading}
      />
    </div>

    <button
      onClick={onSubmit}
      disabled={loading}
      className="w-full py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Creating Account...' : 'Create Account'}
    </button>
  </div>
);