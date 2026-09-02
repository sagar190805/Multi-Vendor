import React from 'react';

export function Table({ children }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/10">
      {children}
    </thead>
  );
}

export function Th({ children }) {
  return (
    <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground whitespace-nowrap">
      {children}
    </th>
  );
}

export function Tbody({ children }) {
  return (
    <tbody className="divide-y divide-black/5 dark:divide-white/10">
      {children}
    </tbody>
  );
}

export function Tr({ children }) {
  return (
    <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
      {children}
    </tr>
  );
}

export function Td({ children, className = '' }) {
  return (
    <td className={`p-6 ${className}`}>
      {children}
    </td>
  );
}
