import React, { useEffect, useRef } from 'react';

export function ProgressBar({ value = 0, max = 100, color = 'primary', size = 'md', label, showValue = false, animate = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barRef = useRef(null);

  useEffect(() => {
    if (!animate || !barRef.current) return;
    barRef.current.style.width = '0%';
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    }, 100);
    return () => clearTimeout(t);
  }, [pct, animate]);

  const colorMap = {
    primary: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  const sizeMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-semibold text-muted-foreground">{label}</span>}
          {showValue && <span className="text-sm font-black tabular-nums">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <div
          ref={barRef}
          style={{ width: animate ? '0%' : `${pct}%`, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
          className={`h-full rounded-full ${colorMap[color] || colorMap.primary}`}
        />
      </div>
    </div>
  );
}
