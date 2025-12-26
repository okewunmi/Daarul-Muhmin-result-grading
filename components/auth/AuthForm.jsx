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
      <label className="block text-gray-300 mb-2">Email</label>
      <input
        type="email"
        required
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
        onKeyPress={(e) => onKeyPress(e, onSubmit)}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="student@example.com"
        disabled={loading}
      />
    </div>

    <div className="mb-6">
      <label className="block text-gray-300 mb-2">Password</label>
      <input
        type="password"
        required
        value={data.password}
        onChange={(e) => onChange('password', e.target.value)}
        onKeyPress={(e) => onKeyPress(e, onSubmit)}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="••••••••"
        disabled={loading}
      />
    </div>

    <SubmitButton loading={loading} text="Login" onSubmit={onSubmit} />
  </div>
);

const RegisterForm = ({ data, loading, onChange, onSubmit, onKeyPress }) => (
  <div>
    <div className="mb-4">
      <label className="block text-gray-300 mb-2">
        Full Name <span className="text-red-400">*</span>
      </label>
      <input
        type="text"
        required
        value={data.name}
        onChange={(e) => onChange('name', e.target.value)}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your name"
        disabled={loading}
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-300 mb-2">
        Arabic Name (الاسم بالعربية) <span className="text-gray-500 text-sm">(Optional)</span>
      </label>
      <input
        type="text"
        value={data.arabicName || ''}
        onChange={(e) => onChange('arabicName', e.target.value)}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="أدخل اسمك بالعربية"
        dir="rtl"
        disabled={loading}
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-300 mb-2">
        Email <span className="text-red-400">*</span>
      </label>
      <input
        type="email"
        required
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="student@example.com"
        disabled={loading}
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-300 mb-2">
        Password <span className="text-red-400">*</span>
      </label>
      <input
        type="password"
        required
        value={data.password}
        onChange={(e) => onChange('password', e.target.value)}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="••••••••"
        disabled={loading}
      />
      <p className="text-gray-400 text-xs mt-1">Minimum 8 characters</p>
    </div>

    <div className="mb-6">
      <label className="block text-gray-300 mb-2">
        Confirm Password <span className="text-red-400">*</span>
      </label>
      <input
        type="password"
        required
        value={data.confirmPassword}
        onChange={(e) => onChange('confirmPassword', e.target.value)}
        onKeyPress={(e) => onKeyPress(e, onSubmit)}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="••••••••"
        disabled={loading}
      />
    </div>

    <SubmitButton loading={loading} text="Create Account" onSubmit={onSubmit} />
  </div>
);

const SubmitButton = ({ loading, text, onSubmit }) => (
  <button
    onClick={onSubmit}
    disabled={loading}
    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? `${text}...` : text}
  </button>
);