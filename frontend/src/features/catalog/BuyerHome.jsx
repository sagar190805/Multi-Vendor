import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../../components/ui/ProductCard';
import { getProducts } from '../../data/mockProducts';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function BuyerHome() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(data => {
        setTrendingProducts(data.slice(0, 25));
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-12 pb-24 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full bg-[#18181b] text-white rounded-[32px] p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Flash sale — up to 50% off</h2>
          <p className="text-white/70 text-lg font-medium">Across 200+ vendors, ends in 6 hours</p>
        </div>
        <button 
          onClick={() => window.location.href = '/store/search?q=all'}
          className="mt-8 sm:mt-0 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer relative z-10"
        >
          Shop now
        </button>
      </motion.div>

      <div>
        <h3 className="text-3xl font-bold tracking-tight mb-8">Trending near you</h3>
        {loading ? (
          <div className="flex justify-center p-24">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-8"
          >
            {trendingProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants} className="h-full">
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
