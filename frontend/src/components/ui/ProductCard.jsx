import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore, useWishlistStore } from '../../store/shopStore';

export const ProductCard = ({ product }) => {
  const { items, addToCart, updateQuantity, removeFromCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const id = product.id;
  const name = product.title || product.name;
  const price = product.price;
  const formattedPrice = typeof price === 'number' ? `Rs. ${price.toFixed(2)}` : price;
  const vendor = product.category || product.vendor || 'MarketStore';
  const image = product.image;
  
  const isWished = isInWishlist(id);

  const cartProduct = { id, name, price: formattedPrice, vendor, image };
  const cartItem = items.find(item => item.id === id);

  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative border border-border bg-card rounded-[20px] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col font-sans h-full"
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(224, 93, 54, 0.1), transparent 40%)`
        }}
      />
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.05), transparent 40%)`
        }}
      />
      
      <button 
        onClick={() => toggleWishlist(cartProduct)}
        className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center transition-colors hover:bg-background hover:scale-105 active:scale-95 shadow-sm"
      >
        <Heart className={`w-4 h-4 transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
      </button>
      
      <Link to={`/store/product/${id}`} className="block h-48 p-6 w-full bg-white relative z-10">
        {image ? (
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            src={image} 
            alt={name} 
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-md origin-center" 
          />
        ) : (
          <div className="w-full h-full bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground text-xs font-medium">No Image</div>
        )}
      </Link>
      
      <div className="p-5 flex-1 flex flex-col relative z-10 bg-card">
        <Link to={`/store/product/${id}`}>
          <h4 className="font-bold text-foreground text-base mb-1 line-clamp-2 leading-tight group-hover:text-primary transition-colors" title={name}>{name}</h4>
        </Link>
        <p className="text-xs text-muted-foreground font-medium mb-3 capitalize">{vendor}</p>
        <div className="mt-auto flex flex-col gap-3">
          <p className="font-extrabold text-xl tracking-tight">{formattedPrice}</p>
          
          {cartItem ? (
            <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-1 backdrop-blur-sm">
              <button 
                onClick={() => cartItem.quantity > 1 ? updateQuantity(id, cartItem.quantity - 1) : removeFromCart(id)} 
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-all cursor-pointer font-bold shadow-sm active:scale-95 text-base"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-base w-6 text-center">{cartItem.quantity}</span>
              <button 
                onClick={() => updateQuantity(id, cartItem.quantity + 1)} 
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-all cursor-pointer font-bold shadow-sm active:scale-95 text-base"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(cartProduct)}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to cart
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: isHovering ? `radial-gradient(80px circle at ${mousePosition.x}px ${mousePosition.y - 250}px, rgba(255,255,255,0.2), transparent)` : 'transparent'
                }}
              />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
