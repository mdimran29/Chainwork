import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';

import { WalletButton } from '../components/WalletButton';
import { useWalletAuth } from '../hooks/useWalletAuth';
import { useAppKitAccount } from '@reown/appkit/react';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useAppKitAccount();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [walletMessage, setWalletMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const { authenticateWallet, isAuthenticating } = useWalletAuth();

  useEffect(() => {
    if (isConnected && address) {
      const shortAddress = `${address.toString().slice(0, 6)}...${address.toString().slice(-4)}`;
      setWalletMessage(`Connected: ${shortAddress}`);
      setErrors(prev => ({ ...prev, general: '' }));
    } else {
      setWalletMessage('');
    }
  }, [isConnected, address]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setErrors({});

    if (!isConnected || !address) {
      setErrors({ general: 'Please connect your wallet before logging in' });
      return;
    }
    if (!validateForm()) return;

    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (!response.data.token || !response.data.walletAddress) {
        setApiError('Invalid response from server. Please try again.');
        return;
      }

      if (response.data.walletAddress !== address.toString()) {
        setApiError('Connected wallet does not match your account wallet.');
        return;
      }

      const success = await authenticateWallet();
      if (!success) {
        setApiError('Invalid wallet signature. Please try again.');
        return;
      }

      localStorage.setItem('sol_token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      window.dispatchEvent(new Event('auth-change'));
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) setApiError('Invalid email or password');
        else if (error.response?.status === 404) setApiError('User not found. Please register first.');
        else if (error.response?.status === 500) setApiError('Server error. Please try again later.');
        else setApiError(error.response?.data?.message || 'Login failed. Please try again.');
      } else if (error instanceof Error) {
        setApiError(error.message || 'An unexpected error occurred');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] hero-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="ChainWork Logo"
              className="h-16 w-16 rounded-xl object-cover shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-extrabold gradient-text mb-1">ChainWork</h1>
          <p className="text-secondary-500 text-sm font-medium">Decentralized Freelance Marketplace</p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-secondary-900 mb-1">Welcome back</h2>
          <p className="text-sm text-secondary-500 mb-6">Sign in to your account to continue</p>

          {/* Wallet Section */}
          <div className="mb-5">
            {!isConnected ? (
              <div className="rounded-xl border border-primary-100 bg-primary-50 p-4 flex flex-col items-center gap-3">
                <p className="text-sm text-secondary-600 font-medium">Connect your wallet to proceed</p>
                <WalletButton />
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-accent-500 animate-pulse" />
                <span className="text-sm font-semibold text-accent-700">{walletMessage}</span>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {(apiError || errors.general) && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3" role="alert">
              <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-red-700">{apiError || errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-secondary-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isAuthenticating}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-secondary-200 bg-white'
                }`}
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-secondary-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isAuthenticating}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-secondary-200 bg-white'
                }`}
                autoComplete="current-password"
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || !isConnected}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 mt-2 ${
                isAuthenticating || !isConnected
                  ? 'bg-primary-300 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 btn-glow'
              }`}
              aria-busy={isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider + Register */}
          <div className="mt-6 pt-5 border-t border-secondary-100 text-center">
            <p className="text-sm text-secondary-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
