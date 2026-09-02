import React from 'react';

const variantClasses = {
  default: 'bg-black/5 text-foreground dark:bg-white/10 border-black/10 dark:border-white/10',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  primary: 'bg-primary/10 text-primary border-primary/20',
};

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
