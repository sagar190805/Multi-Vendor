import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Search, Heart, ShoppingCart, User, Menu } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../store/shopStore';

export function BuyerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
            <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none flex justify-center">
        <header className="w-full max-w-5xl pointer-events-auto flex items-center justify-between gap-6 px-4 py-3 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] supports-[backdrop-filter]:bg-white/60">
          
          <div className="flex items-center gap-6">
            <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors"><Menu className="w-5 h-5" /></button>
            <Link to="/store" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                21
              </div>
              <span className="text-lg font-semibold tracking-tight hidden sm:block">Marketplace</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-xl hidden md:flex items-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-muted-foreground mr-3" />
            <input 
              type="text" 
              placeholder="Search components, templates, or creators..." 
              className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder:text-muted-foreground/70"
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/store/search?q=${encodeURIComponent(e.target.value)}`);
              }}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/store/wishlist" className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/store/cart" className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <div className="relative ml-1">
              <button 
                onClick={() => {
                  const el = document.getElementById('buyer-dropdown');
                  if(el) el.classList.toggle('hidden');
                }}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center text-foreground text-xs font-bold">
                  {user ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
              </button>
              
              <div id="buyer-dropdown" className="hidden absolute top-full right-0 mt-4 w-56 bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
                {user ? (
                  <>
                    <div className="p-4 border-b border-black/5 dark:border-white/5">
                      <p className="font-bold text-sm truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Free Plan</p>
                    </div>
                    <div className="p-2">
                      <Link to="/store/profile" className="block px-3 py-2 text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">My Profile</Link>
                      <Link to="/store/orders" className="block px-3 py-2 text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">Orders</Link>
                      {(!user.role || (!user.role.includes('SELLER') && !user.role.includes('ADMIN'))) && (
                        <Link to="/seller/login" className="block px-3 py-2 mt-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg text-sm font-medium transition-colors">Become a Seller</Link>
                      )}
                      {(user.role === 'SELLER' || user.role?.includes('SELLER')) && (
                        <Link to="/seller/dashboard" className="block px-3 py-2 mt-1 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg text-sm font-medium transition-colors">Seller Dashboard</Link>
                      )}
                      {(user.role === 'ADMIN' || user.role?.includes('ADMIN')) && (
                        <Link to="/admin/analytics" className="block px-3 py-2 mt-1 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg text-sm font-medium transition-colors">Admin Console</Link>
                      )}
                    </div>
                    <div className="p-2 border-t border-black/5 dark:border-white/5">
                      <button onClick={logout} className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors">Sign Out</button>
                    </div>
                  </>
                ) : (
                  <div className="p-3 space-y-2">
                    <Link to="/login" className="block w-full text-center px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">Log In</Link>
                    <Link to="/register" className="block w-full text-center px-4 py-2.5 bg-black/5 dark:bg-white/5 text-foreground rounded-xl text-sm font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>
      
      <main className="flex-1 w-full flex flex-col pt-24">
                <div className="flex justify-center border-b border-black/5 dark:border-white/5 mb-8">
          <div className="flex gap-8 px-6 overflow-x-auto scrollbar-hide max-w-5xl w-full">
            {[
              { name: 'Home', path: '/store' },
              { name: 'Electronics', path: '/store/category/electronics' },
              { name: 'Fashion', path: '/store/category/fashion' },
              { name: 'Home Goods', path: '/store/category/home' },
              { name: 'Beauty', path: '/store/category/beauty' },
              { name: 'Sports', path: '/store/category/sports' }
            ].map(cat => (
              <NavLink 
                key={cat.name} 
                to={cat.path}
                end={cat.path === '/store'}
                className={({ isActive }) => `py-4 text-sm hover:text-foreground hover:border-black dark:hover:border-white border-b-2 transition-all whitespace-nowrap ${isActive ? 'font-semibold text-foreground border-black dark:border-white' : 'font-medium text-muted-foreground border-transparent'}`}
              >
                {cat.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
