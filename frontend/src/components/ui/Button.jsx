import React from 'react';

const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-md',
  secondary: 'bg-black/5 dark:bg-white/10 text-foreground hover:bg-black/10 dark:hover:bg-white/20',
  outline: 'border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
};

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <button 
      className={`rounded-xl font-bold transition-all active:scale-95 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
