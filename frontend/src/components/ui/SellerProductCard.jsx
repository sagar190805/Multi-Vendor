import React from 'react';
import { Heart, ShoppingCart, Star, TrendingUp, AlertTriangle } from 'lucide-react';

export function SellerProductCard({ product, onEdit, onDelete, onStockChange }) {
  const stockStatus =
    product.stock === 0 ? { label: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' } :
    product.stock <= 10 ? { label: 'Low Stock', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' } :
    { label: 'In Stock', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };

  return (
    <div className="group bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[28px] overflow-hidden backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] bg-white dark:bg-white/5 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${stockStatus.bg} ${stockStatus.color} ${stockStatus.border}`}>
            {stockStatus.label}
          </span>
          {product.stock <= 10 && product.stock > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" /> Restock
            </span>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/5 dark:bg-white/10 text-muted-foreground border border-black/5 dark:border-white/10">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-sm line-clamp-2 leading-snug flex-1">{product.title}</h3>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <p className="font-black text-lg text-primary">₹{product.price.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-muted-foreground">{product.rating?.rate ?? '4.5'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-muted-foreground">Stock qty</p>
          <div className="flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => onStockChange?.(product.id, Math.max(0, product.stock - 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 font-bold text-sm transition-colors"
            >−</button>
            <span className="w-10 text-center font-black text-sm tabular-nums">{product.stock}</span>
            <button
              onClick={() => onStockChange?.(product.id, product.stock + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 font-bold text-sm transition-colors"
            >+</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit?.(product.id)}
            className="py-2.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(product.id)}
            className="py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
