import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCartStore, useWishlistStore } from '../../store/shopStore';
import { ProductCard } from '../../components/ui/ProductCard';
import { getProductsByCategory, searchProducts, getProductById } from '../../data/mockProducts';

export const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Shopping Cart</h1>
      <p className="text-muted-foreground mb-10 text-lg">Review items before checkout.</p>
      
      {items.length === 0 ? (
        <div className="h-64 border border-dashed border-black/20 dark:border-white/20 rounded-3xl flex items-center justify-center bg-black/5 dark:bg-white/5 backdrop-blur-xl">
          <p className="text-muted-foreground font-medium text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-6 p-6 border border-black/5 dark:border-white/10 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-xl hover:shadow-xl transition-all">
                <div className="w-24 h-24 bg-black/5 dark:bg-white/10 rounded-2xl flex-shrink-0 relative overflow-hidden">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply absolute inset-0 p-2" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg line-clamp-1">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">Sold by {item.vendor}</p>
                  <p className="font-bold text-xl">{item.price}</p>
                </div>
                <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-1 rounded-xl">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center font-bold transition-colors">-</button>
                  <span className="font-semibold w-6 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center font-bold transition-colors">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm ml-4 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors">Remove</button>
              </div>
            ))}
          </div>
          <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl rounded-3xl p-8 h-fit sticky top-24 shadow-sm">
            <h3 className="font-bold text-xl mb-6">Order Summary</h3>
            <div className="flex justify-between mb-4"><span className="text-muted-foreground font-medium">Subtotal</span><span className="font-semibold">Rs. {getCartTotal().toFixed(2)}</span></div>
            <div className="flex justify-between mb-6 pb-6 border-b border-black/10 dark:border-white/10"><span className="text-muted-foreground font-medium">Shipping</span><span className="font-semibold">Rs. 50.00</span></div>
            <div className="flex justify-between font-bold text-2xl mb-8"><span>Total</span><span>Rs. {(getCartTotal() + 50).toFixed(2)}</span></div>
            <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-md">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const CategoryPage = () => {
  const { id } = useParams();
  const [activeFilters, setActiveFilters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const title = id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Category';

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(id)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching category", err);
        setLoading(false);
      });
  }, [id]);

  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filteredProducts = useMemo(() => {
    if (activeFilters.length === 0) return products;
    
    return products.filter(p => {
      return activeFilters.some(filter => {
        if (filter === 'Under Rs. 5000') return p.price < 5000;
        if (filter === 'Rs. 5000 - Rs. 15000') return p.price >= 5000 && p.price <= 15000;
        if (filter === 'Over Rs. 15000') return p.price > 15000;
        return true;
      });
    });
  }, [products, activeFilters]);

  return (
    <div className="flex gap-8 max-w-7xl mx-auto p-6 font-sans">
      <aside className="w-64 space-y-6 hidden md:block">
        <div>
          <h3 className="font-bold mb-3">Filters for {title}</h3>
          <div className="space-y-2">
            {['Under Rs. 5000', 'Rs. 5000 - Rs. 15000', 'Over Rs. 15000'].map(label => (
              <label key={label} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                <input 
                  type="checkbox" 
                  className="rounded cursor-pointer"
                  checked={activeFilters.includes(label)}
                  onChange={() => toggleFilter(label)}
                /> 
                {label}
              </label>
            ))}
          </div>
        </div>
      </aside>
      <main className="flex-1">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">No products match your selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  );
};

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    searchProducts(query)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching search results", err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
      <p className="text-muted-foreground mb-8">Showing {products.length} results</p>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, items, updateQuantity, removeFromCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center p-24">
        <div className="animate-spin w-12 h-12 border-4 border-black dark:border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-24 text-muted-foreground text-xl">Product not found.</div>;
  }

  const cartProduct = {
    id: product.id,
    name: product.title,
    price: `Rs. ${product.price.toFixed(2)}`,
    vendor: product.category,
    image: product.image
  };

  const cartItem = items.find(item => item.id === product.id);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto p-8 font-sans">
      <div className="grid md:grid-cols-2 gap-16">
        <div className="aspect-square bg-white rounded-[40px] border border-black/5 dark:border-white/10 p-12 flex items-center justify-center shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
          <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" />
        </div>
        
        <div className="space-y-8 py-4 flex flex-col justify-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-sm font-semibold mb-6 capitalize backdrop-blur-md border border-black/10 dark:border-white/10">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">{product.title}</h1>
            <p className="text-3xl font-semibold text-foreground/80">Rs. {product.price.toFixed(2)}</p>
          </div>
          
          <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl rounded-3xl p-8">
            <h3 className="font-bold text-lg mb-3">Product Description</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="pt-4">
            {cartItem ? (
              <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-2 w-full max-w-sm">
                <button 
                  onClick={() => cartItem.quantity > 1 ? updateQuantity(product.id, cartItem.quantity - 1) : removeFromCart(product.id)} 
                  className="w-14 h-14 flex items-center justify-center rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors font-bold text-xl cursor-pointer"
                >-</button>
                <span className="font-bold text-xl">{cartItem.quantity}</span>
                <button 
                  onClick={() => updateQuantity(product.id, cartItem.quantity + 1)} 
                  className="w-14 h-14 flex items-center justify-center rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors font-bold text-xl cursor-pointer"
                >+</button>
              </div>
            ) : (
              <button 
                onClick={() => addToCart(cartProduct)} 
                className="w-full sm:w-auto px-12 py-5 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg text-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const VendorStorefront = () => {
  const dummyProducts = [1,2,3,4].map(i => ({ id: `vendor-${i}`, name: `Audio Product ${i}`, vendor: 'AudioHub', price: 'Rs. 199.99' }));
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="h-48 bg-primary/20 rounded-2xl mb-8 flex items-end p-8">
        <h1 className="text-4xl font-bold text-primary">AudioHub Official Store</h1>
      </div>
      <h3 className="text-xl font-bold mb-6">All Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {dummyProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

export const CheckoutPage = () => {
  const { getCartTotal } = useCartStore();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto p-8 grid md:grid-cols-3 gap-12 font-sans">
      <div className="md:col-span-2 space-y-8">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Checkout</h1>
        
        <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium" />
            <input type="text" placeholder="Last Name" className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium" />
            <input type="text" placeholder="Address" className="col-span-2 p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium" />
            <input type="text" placeholder="City" className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium" />
            <input type="text" placeholder="Postal Code" className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium" />
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Card Number" className="w-full p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="MM/YY" className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium" />
              <input type="text" placeholder="CVC" className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium" />
            </div>
          </div>
        </div>
        
        <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-md text-lg">Place Order (Rs. {(getCartTotal() + 50).toFixed(2)})</button>
      </div>
      
      <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl rounded-3xl p-8 h-fit sticky top-24 shadow-sm">
        <h3 className="font-bold text-xl mb-6">Summary</h3>
        <div className="flex justify-between mb-4"><span className="text-muted-foreground font-medium">Subtotal</span><span className="font-semibold">Rs. {getCartTotal().toFixed(2)}</span></div>
        <div className="flex justify-between mb-6 pb-6 border-b border-black/10 dark:border-white/10"><span className="text-muted-foreground font-medium">Shipping</span><span className="font-semibold">Rs. 50.00</span></div>
        <div className="flex justify-between font-bold text-2xl mb-2"><span>Total</span><span>Rs. {(getCartTotal() + 50).toFixed(2)}</span></div>
      </div>
    </motion.div>
  );
};

export const OrderHistory = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto p-8 font-sans">
    <h1 className="text-4xl font-bold tracking-tight mb-8">Order History</h1>
    <div className="space-y-6">
      {[1,2].map(i => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl hover:shadow-lg transition-all">
          <div className="mb-4 sm:mb-0">
            <p className="font-bold text-xl mb-1">Order #100{i}</p>
            <p className="text-sm text-muted-foreground font-medium">Placed on Oct 12, 2023</p>
          </div>
          <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
            <p className="font-bold text-xl mb-2">Rs. 129.99</p>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-full border border-emerald-500/20">Delivered</span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export const Wishlist = () => {
  const { items } = useWishlistStore();
  
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Your Wishlist</h1>
      {items.length === 0 ? (
        <div className="h-64 border border-dashed border-black/20 dark:border-white/20 rounded-3xl flex items-center justify-center bg-black/5 dark:bg-white/5 backdrop-blur-xl">
          <p className="text-muted-foreground font-medium text-lg">No items in your wishlist yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </motion.div>
  );
};

export const ProfilePage = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
    <div className="space-y-6 bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">JD</div>
        <div>
          <h2 className="text-xl font-bold">John Doe</h2>
          <p className="text-muted-foreground">john.doe@example.com</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-destructive/10 text-destructive rounded-md font-medium">Sign Out</button>
    </div>
  </div>
);
