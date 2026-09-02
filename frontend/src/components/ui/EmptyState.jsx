import React from 'react';

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-3xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-muted-foreground mb-6">
          {icon}
        </div>
      )}
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      {description && <p className="text-muted-foreground font-medium mb-8 max-w-sm">{description}</p>}
      {action && action}
    </div>
  );
}
