import React from 'react';

export function VendorCard({ vendor, onApprove, onReject, onView }) {
  const initials = vendor.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-primary/10 text-primary', 'bg-blue-500/10 text-blue-500', 'bg-purple-500/10 text-purple-500', 'bg-emerald-500/10 text-emerald-500'];
  const color = colors[vendor.id % colors.length] || colors[0];

  return (
    <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[28px] p-6 backdrop-blur-xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${color}`}>
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-base line-clamp-1">{vendor.name}</h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">{vendor.email}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shrink-0">
          Pending KYC
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl">
          <p className="text-xs text-muted-foreground font-medium mb-1">Category</p>
          <p className="font-bold text-sm">{vendor.category}</p>
        </div>
        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl">
          <p className="text-xs text-muted-foreground font-medium mb-1">Applied</p>
          <p className="font-bold text-sm">{vendor.date}</p>
        </div>
        {vendor.location && (
          <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl">
            <p className="text-xs text-muted-foreground font-medium mb-1">Location</p>
            <p className="font-bold text-sm">{vendor.location}</p>
          </div>
        )}
        {vendor.type && (
          <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl">
            <p className="text-xs text-muted-foreground font-medium mb-1">Business Type</p>
            <p className="font-bold text-sm">{vendor.type}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onApprove?.(vendor.id)}
          className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          Approve
        </button>
        <button
          onClick={() => onReject?.(vendor.id)}
          className="py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
