import React from 'react';

const TYPE_STYLES = {
  approved: { dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  rejected: { dot: 'bg-red-500', badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
  flagged: { dot: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  login: { dot: 'bg-blue-500', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  payout: { dot: 'bg-purple-500', badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  config: { dot: 'bg-black/30 dark:bg-white/30', badge: 'bg-black/5 dark:bg-white/10 text-muted-foreground border-black/10 dark:border-white/10' },
};

export function AuditLog({ entries }) {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-black/5 dark:bg-white/10" />
      <div className="space-y-0">
        {entries.map((entry, i) => {
          const style = TYPE_STYLES[entry.type] || TYPE_STYLES.config;
          return (
            <div key={i} className="relative flex gap-4 py-3 group hover:bg-black/[0.015] dark:hover:bg-white/[0.015] rounded-xl px-2 transition-colors">
              <div className="relative z-10 flex items-start pt-1 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full border-2 border-background ${style.dot}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm">{entry.actor}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${style.badge}`}>{entry.action}</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium line-clamp-1">{entry.detail}</p>
                <p className="text-xs text-muted-foreground/60 font-medium mt-0.5">{entry.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
