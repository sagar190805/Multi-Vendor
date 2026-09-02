import React from 'react';

export function QuickActionButton({ icon, label, description, color = 'default', onClick }) {
  const colorMap = {
    default: 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10',
    danger: 'bg-red-500/5 hover:bg-red-500/10 border border-red-500/10',
    success: 'bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10',
    primary: 'bg-primary/5 hover:bg-primary/10 border border-primary/10',
  };

  const iconColorMap = {
    default: 'bg-black/5 dark:bg-white/10 text-foreground',
    danger: 'bg-red-500/10 text-red-500',
    success: 'bg-emerald-500/10 text-emerald-500',
    primary: 'bg-primary/10 text-primary',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${colorMap[color]}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${iconColorMap[color]}`}>
        {icon}
      </div>
      <div className="text-left">
        <p className={`font-bold text-sm ${color === 'danger' ? 'text-red-600 dark:text-red-400' : color === 'success' ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>{label}</p>
        {description && <p className="text-xs text-muted-foreground font-medium mt-0.5">{description}</p>}
      </div>
    </button>
  );
}
