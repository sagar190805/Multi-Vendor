import React from 'react';
import { CheckCircle2, Circle, Truck, Package, ClipboardList, Home } from 'lucide-react';

const STEPS = [
  { key: 'placed', label: 'Order Placed', icon: ClipboardList, desc: 'We received your order' },
  { key: 'packed', label: 'Packed', icon: Package, desc: 'Items packed and ready' },
  { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'On the way to you' },
  { key: 'delivered', label: 'Delivered', icon: Home, desc: 'Order completed' },
];

const STATUS_INDEX = { placed: 0, packed: 1, shipped: 2, delivered: 3 };

export function OrderTimeline({ status = 'shipped', orderId, date }) {
  const currentIdx = STATUS_INDEX[status] ?? 1;

  return (
    <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[28px] p-6 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-black text-base">{orderId}</p>
          {date && <p className="text-xs text-muted-foreground font-medium mt-0.5">{date}</p>}
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border capitalize
          ${status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
            status === 'shipped' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
          {status}
        </span>
      </div>

      <div className="relative flex items-start justify-between gap-2">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-black/5 dark:bg-white/10" style={{ marginLeft: '10%', marginRight: '10%' }}>
          <div
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-3
                ${done ? 'bg-primary text-primary-foreground shadow-md' : 'bg-black/5 dark:bg-white/10 text-muted-foreground'}`}>
                {done && i < currentIdx ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <p className={`text-xs font-bold text-center ${active ? 'text-foreground' : done ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                {step.label}
              </p>
              <p className="text-[10px] text-muted-foreground/60 text-center font-medium mt-0.5 hidden sm:block">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
