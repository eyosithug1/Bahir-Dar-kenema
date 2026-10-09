import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import toast from 'react-hot-toast';

function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [accountRole, setAccountRole] = useState('client');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (accountRole === 'admin') {
      const normalizedKey = adminKey.trim();
      if (normalizedKey !== 'BDK2026' && normalizedKey !== 'admin123' && normalizedKey !== 'AdminPassword123!') {
        setError('Invalid Admin Security Passcode. Use "BDK2026"');
        return;
      }
    }

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: accountRole
      });
      
      toast.success(accountRole === 'admin' ? '🎉 Admin account registered!' : 'Account created successfully!');
      
      if (accountRole === 'admin' || result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bdk-dark via-bdk-bg to-bdk-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-black text-bdk-accent mb-1">BDK</h1>
            <p className="text-bdk-light text-sm font-bold">Bahir Dar Kenema FC</p>
          </Link>
        </div>

        {/* Card */}
        <div className="card-glass p-8 rounded-3xl border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Create Account</h2>

          {/* Account Type Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => { setAccountRole('client'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                accountRole === 'client'
                  ? 'bg-bdk-accent text-bdk-dark shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Fan / Supporter
            </button>
            <button
              type="button"
              onClick={() => { setAccountRole('admin'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                accountRole === 'admin'
                  ? 'bg-bdk-accent text-bdk-dark shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Administrator ⚙
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/60 text-red-200 px-4 py-3 rounded-xl mb-6 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-300">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Abebe"
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-bdk-accent"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-300">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Kebede"
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-bdk-accent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-bdk-accent"
                disabled={isLoading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-300">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0911000000"
                className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-bdk-accent"
                disabled={isLoading}
              />
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-bdk-accent"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-bdk-accent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Admin Key Input (Conditional) */}
            {accountRole === 'admin' && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-400/40 rounded-xl">
                <label className="block text-xs font-black text-yellow-300 mb-1">
                  Admin Passcode (Security Key)
                </label>
                <input
                  type="text"
                  value={adminKey}
                  onChange={(e) => { setAdminKey(e.target.value); setError(''); }}
                  placeholder="Enter passcode (e.g. BDK2026)"
                  className="w-full px-3.5 py-2 bg-black/40 border border-yellow-400/50 rounded-lg text-sm text-yellow-200 placeholder-yellow-500/60 focus:outline-none"
                />
                <p className="text-[10px] text-yellow-300/80 mt-1">Default security passcode: <strong className="font-mono">BDK2026</strong></p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg mt-4 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : (accountRole === 'admin' ? 'Create Admin Account & Open Dashboard' : 'Create Fan Account')}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-3 text-gray-400 text-xs">Already have an account?</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl block text-center transition"
          >
            Log In Instead
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
