import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export function SellerLogin() {
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
      } else if (role?.includes('SELLER') || role?.includes('CUSTOMER')) {
        // Even if they are just a CUSTOMER, we redirect to seller dashboard
        // because the backend now allows it and checks their Vendor status directly.
        navigate('/seller/dashboard');
      } else {
        navigate('/store');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#09090b]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 rounded-3xl bg-[#18181b] border border-white/10 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Seller Portal</h2>
          <p className="text-white/60 mt-3 font-medium">Log in to manage your storefront</p>
        </div>

        {error && (
          <div className="bg-red-500/15 text-red-400 p-4 rounded-xl text-sm mb-6 text-center font-bold border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-white/80 mb-2 block">Seller Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white font-medium placeholder:text-white/30"
              placeholder="seller@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-white/80 mb-2 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white font-medium placeholder:text-white/30"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full mt-8 bg-primary text-primary-foreground font-bold py-3.5 rounded-xl transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 text-base"
          >
            Access Dashboard
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-white/50 font-medium">
          Interested in selling? <a href="/seller/onboarding" className="text-primary hover:underline">Apply here</a>
        </p>
      </motion.div>
    </div>
  );
}
