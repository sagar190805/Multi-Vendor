import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, ShieldAlert, ArrowRight } from 'lucide-react';

export function PlatformSplash() {
  const navigate = useNavigate();
  const handlePortalSelect = (path) => navigate(path);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-primary/30">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay"></div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-20 h-20 mx-auto bg-primary text-white rounded-[24px] flex items-center justify-center text-4xl font-black mb-8 shadow-sm"
          >
            21
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
          >
            The Marketplace.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-medium"
          >
            Select your operating environment to begin.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => handlePortalSelect('/store')}
            className="group cursor-pointer p-10 rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.08] transition-colors duration-300 flex flex-col items-start relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-8 border border-white/10 group-hover:bg-blue-500/20 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors duration-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Buyer Storefront</h2>
            <p className="text-white/50 text-base mb-8 line-clamp-2">Enter the next-generation premium storefront experience.</p>
            <div className="mt-auto flex items-center gap-2 text-white/40 group-hover:text-white font-bold transition-colors">
              Enter Store <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => handlePortalSelect('/seller/dashboard')}
            className="group cursor-pointer p-10 rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.08] transition-colors duration-300 flex flex-col items-start relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-8 border border-white/10 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-colors duration-300">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Seller Dashboard</h2>
            <p className="text-white/50 text-base mb-8 line-clamp-2">Manage your inventory, fulfill orders, and scale your brand.</p>
            <div className="mt-auto flex items-center gap-2 text-white/40 group-hover:text-white font-bold transition-colors">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onClick={() => handlePortalSelect('/admin/analytics')}
            className="group cursor-pointer p-10 rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.08] transition-colors duration-300 flex flex-col items-start relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-8 border border-white/10 group-hover:bg-purple-500/20 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors duration-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">Admin Console</h2>
            <p className="text-white/50 text-base mb-8 line-clamp-2">Superuser access for catalog moderation and platform analytics.</p>
            <div className="mt-auto flex items-center gap-2 text-white/40 group-hover:text-white font-bold transition-colors">
              Access Console <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
