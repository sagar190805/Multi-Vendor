import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await register(email, password, '000000000', role);
      const userRole = userData.role;
      
      if (userRole?.includes('ADMIN')) {
        navigate('/admin/analytics');
      } else if (userRole?.includes('SELLER')) {
        navigate('/seller/onboarding');
      } else {
        navigate('/store');
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl bg-card border border-border/50 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
          <p className="text-muted-foreground mt-2">Join the next generation marketplace</p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input/50 border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input/50 border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Account Type</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-2 rounded-lg border text-sm font-medium transition-all ${role === 'CUSTOMER' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border hover:bg-muted'}`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('SELLER')}
                className={`py-2 rounded-lg border text-sm font-medium transition-all ${role === 'SELLER' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border hover:bg-muted'}`}
              >
                Seller
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full mt-6 bg-primary text-primary-foreground font-medium py-2.5 rounded-lg transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            Sign Up
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <a href="/login" className="text-primary font-medium hover:underline">Sign in</a>
        </p>
      </motion.div>
    </div>
  );
}
