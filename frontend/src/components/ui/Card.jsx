import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[32px] p-8 backdrop-blur-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="font-bold text-xl mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
