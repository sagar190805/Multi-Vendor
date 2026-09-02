import React from 'react';

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">{title}</h1>
        {subtitle && <p className="text-muted-foreground font-medium text-lg">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}
