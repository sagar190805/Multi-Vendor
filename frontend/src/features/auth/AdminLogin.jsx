import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      const role = userData.role;
      
      if (role?.includes('ADMIN')) {
        navigate('/admin/analytics');
      } else {
        setError('Access Denied. Admin privileges required.');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl bg-black/40 border border-white/10 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Admin Gateway</h2>
          <p className="text-white/60 mt-2">Authorized personnel only</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block text-white/80">Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              placeholder="admin@platform.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block text-white/80">Security Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </div>
  );
}

