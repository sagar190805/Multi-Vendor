import React from 'react';

export function StatCard({ title, value, trend, trendUp = true }) {
  return (
    <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 rounded-[32px] backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
      <p className="text-muted-foreground font-medium mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold">{value}</p>
        {trend && (
          <span className={`font-bold text-sm mb-1 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {trendUp ? '+' : '-'}{trend}
          </span>
        )}
      </div>
    </div>
  );
}
