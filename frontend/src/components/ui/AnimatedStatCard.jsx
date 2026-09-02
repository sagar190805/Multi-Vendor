import React, { useEffect, useRef, useState } from 'react';

function useCountUp(end, duration = 1500) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  return count;
}

export function AnimatedStatCard({ title, value, prefix = '', suffix = '', trend, trendUp = true, icon, color = 'primary' }) {
  const numericValue = parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
  const count = useCountUp(numericValue);

  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-purple-500/10 text-purple-500',
    amber: 'bg-amber-500/10 text-amber-500',
  };

  return (
    <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 rounded-[28px] backdrop-blur-xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-muted-foreground font-semibold text-sm">{title}</p>
        {icon && (
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colorMap[color] || colorMap.primary}`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-black tracking-tight mb-2">
        {prefix}{count.toLocaleString('en-IN')}{suffix}
      </p>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-bold ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
          <span>{trendUp ? '↑' : '↓'} {trend}</span>
        </div>
      )}
    </div>
  );
}
