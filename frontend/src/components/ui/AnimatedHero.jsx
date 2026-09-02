import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function AnimatedHero() {
  return (
    <div className="relative overflow-hidden bg-background pt-24 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-sm font-medium mb-8 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-black dark:bg-white mr-2 animate-pulse"></span>
            Introducing the Next-Gen Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl"
          >
            The global marketplace for <br className="hidden md:block" />
            <span className="text-black/60 dark:text-white/60 italic font-serif pr-2">
              everything
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            Discover thousands of premium products from independent vendors around the world.
            Curated quality, seamless checkout, and next-level shopping.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a href="#shop-section" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-md">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a href="/seller/onboarding" className="inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-8 py-3.5 text-sm font-semibold transition-all hover:bg-black/10 dark:hover:bg-white/10 active:scale-95">
              Become a Seller
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
