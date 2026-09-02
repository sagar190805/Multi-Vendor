import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { ShieldAlert, ListChecks, Tags, AlertCircle, BarChart3, Percent, ExternalLink } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export function AdminLayout() {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const navItems = [
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { name: 'Vendors', path: '/admin/vendors', icon: <ShieldAlert className="w-4 h-4 mr-2" /> },
    { name: 'Catalog', path: '/admin/catalog', icon: <ListChecks className="w-4 h-4 mr-2" /> },
    { name: 'Promotions', path: '/admin/promotions', icon: <Tags className="w-4 h-4 mr-2" /> },
    { name: 'Disputes', path: '/admin/disputes', icon: <AlertCircle className="w-4 h-4 mr-2" /> },
    { name: 'Commissions', path: '/admin/commissions', icon: <Percent className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/admin/analytics" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">
                  21
                </div>
                <span className="font-bold tracking-tight text-lg">Admin Console</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                {navItems.map((item) => (
                  <NavLink 
                    key={item.path} 
                    to={item.path}
                    className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white dark:bg-[#18181b] text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4 text-sm relative">
              <Link to="/store" className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold transition-colors text-sm bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl">
                Platform <ExternalLink className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 p-1.5 pl-3 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-black/5 dark:hover:border-white/10"
              >
                <span className="text-foreground font-bold hidden sm:block">{user?.email || 'super@admin.com'}</span>
                <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center text-foreground font-bold">A</div>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-black/5 dark:border-white/5 md:hidden">
                    <p className="font-bold text-sm truncate">{user?.email || 'super@admin.com'}</p>
                  </div>
                  <div className="p-2 md:hidden">
                    {navItems.map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => setIsDropdownOpen(false)} className="block px-3 py-2 text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
                        {item.name}
                      </Link>
                    ))}
                    <div className="h-px bg-black/5 dark:bg-white/5 my-2"></div>
                  </div>
                  <div className="p-2 border-t border-black/5 dark:border-white/5">
                    <button onClick={() => window.location.href = '/login'} className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
