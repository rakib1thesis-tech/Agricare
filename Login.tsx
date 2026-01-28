
import React, { useState } from 'react';
import { User } from '../types';
import { loginUser } from '../services/db';

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await loginUser(email, password);
      if (user) {
        onLogin(user);
      } else {
        alert("Account not found. Please sign up first.");
      }
    } catch (error: any) {
      alert("Login Error: " + (error.message || "Please check your credentials and connection."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-slate-100 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-100">
            <i className="fas fa-leaf text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">স্বাগতম (Welcome Back)</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage your fields across all browsers</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="you@farm.com.bd"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
            Sign In
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <button onClick={onSwitchToSignup} className="font-bold text-emerald-600 hover:text-emerald-500">Sign up for free</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
