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
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const axios = (await import('axios')).default;
        const res = await axios.get(`http://localhost:8080/api/products?category=${id}`);
        const formatted = res.data.map(p => ({
          ...p,
          image: p.imageUrl || 'https://via.placeholder.com/300'
        }));
        setProducts(formatted);
      } catch (err) {
        console.error("Error fetching category", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
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
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const axios = (await import('axios')).default;
        const res = await axios.get(`http://localhost:8080/api/products?q=${encodeURIComponent(query)}`);
        const formatted = res.data.map(p => ({
          ...p,
          image: p.imageUrl || 'https://via.placeholder.com/300'
        }));
        setProducts(formatted);
      } catch (err) {
        console.error("Error fetching search results", err);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      fetchSearch();
    } else {
      setProducts([]);
      setLoading(false);
    }
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
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const { addToCart, items, updateQuantity, removeFromCart } = useCartStore();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const axios = (await import('axios')).default;
        const [prodRes, revRes] = await Promise.all([
          axios.get('http://localhost:8080/api/products'),
          axios.get(`http://localhost:8080/api/products/${id}/reviews`).catch(e => ({ data: [] }))
        ]);
        
        const p = prodRes.data.find(x => x.id === id);
        if (p) {
          setProduct({
            id: p.id,
            title: p.title,
            price: p.price,
            category: p.category,
            description: p.description,
            image: p.imageUrl || 'https://via.placeholder.com/300'
          });
        }
        setReviews(revRes.data || []);
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
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
      <div className="grid md:grid-cols-2 gap-16 mb-16">
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

      <div className="border-t border-black/5 dark:border-white/10 pt-16">
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground font-medium text-lg">No reviews yet. Check back later!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(r => (
              <div key={r.id} className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < r.rating ? 'fill-current' : 'text-black/10 dark:text-white/10'}`} />)}
                </div>
                <p className="font-medium text-lg mb-4">{r.comment}</p>
                <p className="text-sm text-muted-foreground font-semibold">By {r.author} on {new Date(r.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
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
  const { items, getCartTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center mt-12 border-2 border-dashed border-border rounded-3xl font-sans">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => window.location.href = '/'}>Continue Shopping</Button>
      </div>
    );
  }

  const [simulateFailure, setSimulateFailure] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const api = (await import('../../api/axiosInstance')).default;
      const orderData = {
        shippingAddress: address,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
      };
      // Step 1: Create Order & Reserve Stock
      const checkoutRes = await api.post('/customer/orders/checkout', orderData);
      const orderId = checkoutRes.data.orderId;

      // Step 2: Attempt Payment
      try {
        await api.post(`/customer/orders/${orderId}/pay`, { success: !simulateFailure });
        clearCart();
        setStep(4);
      } catch (paymentError) {
        alert("Payment failed! Your order was cancelled and the stock has been released.");
        // We stay on the payment step or could redirect to cart.
      }
    } catch (e) {
      console.error(e);
      alert(e.response?.data || 'Error creating order.');
    } finally {
      setLoading(false);
    }
  };


  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center mt-12 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl font-sans shadow-xl">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg mb-8">Your order has been placed and is being processed.</p>
        <Button size="lg" onClick={() => window.location.href = '/store/orders'}>Track Order</Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Checkout</h1>
      
      <div className="flex gap-4 mb-12">
        {['Address', 'Shipping', 'Payment'].map((label, i) => (
          <div key={i} className={`flex-1 pb-4 border-b-4 ${step > i ? 'border-primary text-foreground' : 'border-black/5 dark:border-white/10 text-muted-foreground'}`}>
            <p className="font-bold">Step {i + 1}</p>
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-8">
          {step === 1 && (
            <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 rounded-3xl backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6">1. Shipping Address</h2>
              
              {!localStorage.getItem('token') && (
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold">You are checking out as a guest.</p>
                    <p className="text-sm">Log in for a faster checkout experience.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.location.href='/auth'}>Login</Button>
                </div>
              )}

              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full shipping address..."
                className="w-full p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 h-32 font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-6"
              />
              <Button size="lg" className="w-full sm:w-auto" onClick={() => {
                if (!localStorage.getItem('token')) {
                  alert("Please log in to place an order.");
                  window.location.href = '/auth';
                  return;
                }
                address ? setStep(2) : alert('Address required');
              }}>Continue to Shipping</Button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 rounded-3xl backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6">2. Shipping Method</h2>
              <div className="space-y-4 mb-8">
                <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-transparent bg-black/5 dark:bg-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="w-5 h-5 accent-primary" />
                    <div>
                      <p className="font-bold">Standard Delivery</p>
                      <p className="text-sm text-muted-foreground">3-5 business days</p>
                    </div>
                  </div>
                  <p className="font-bold">Free</p>
                </label>
                <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-transparent bg-black/5 dark:bg-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="w-5 h-5 accent-primary" />
                    <div>
                      <p className="font-bold">Express Delivery</p>
                      <p className="text-sm text-muted-foreground">1-2 business days</p>
                    </div>
                  </div>
                  <p className="font-bold">Rs. 499</p>
                </label>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" onClick={() => setStep(3)}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 rounded-3xl backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6">3. Payment Method</h2>
              <div className="space-y-4 mb-8">
                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-transparent bg-black/5 dark:bg-white/5'}`}>
                  <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 accent-primary" />
                  <span className="font-bold">Credit / Debit Card (Mock)</span>
                </label>
                <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-transparent bg-black/5 dark:bg-white/5'}`}>
                  <input type="radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 accent-primary" />
                  <span className="font-bold">UPI / NetBanking (Mock)</span>
                </label>
                
                <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-red-500/20 bg-red-500/5 cursor-pointer">
                  <input type="checkbox" checked={simulateFailure} onChange={(e) => setSimulateFailure(e.target.checked)} className="w-5 h-5 accent-red-500" />
                  <span className="font-bold text-red-500">Test: Simulate Payment Failure</span>
                </label>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>Back</Button>
                <Button size="lg" className="flex-1" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order & Pay'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6 sticky top-24 backdrop-blur-xl">
            <h2 className="font-bold text-xl mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-black/5 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">Rs. {(parseFloat(item.price.replace(/[^0-9.-]+/g,"")) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-6 border-t border-black/5 dark:border-white/10 text-sm font-medium">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>Rs. {getCartTotal()}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shippingMethod === 'express' ? 'Rs. 499.00' : 'Free'}</span></div>
              <div className="flex justify-between text-xl font-bold text-foreground pt-4 border-t border-black/5 dark:border-white/10">
                <span>Total</span>
                <span>Rs. {(parseFloat(getCartTotal()) + (shippingMethod === 'express' ? 499 : 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null); // productId
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchOrders = async () => {
    try {
      const api = (await import('../../api/axiosInstance')).default;
      const res = await api.get('/customer/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const submitReview = async (productId) => {
    try {
      const api = (await import('../../api/axiosInstance')).default;
      await api.post('/customer/reviews', { productId, rating, comment });
      alert('Review submitted!');
      setReviewing(null);
      setComment('');
      setRating(5);
    } catch (e) {
      console.error(e);
      alert('Failed to submit review');
    }
  };

  const handleReturn = async (orderId) => {
    if (window.confirm("Are you sure you want to request a return for this order?")) {
      try {
        const api = (await import('../../api/axiosInstance')).default;
        await api.post(`/customer/orders/${orderId}/return`);
        alert('Return requested successfully.');
        fetchOrders(); // Refresh order list to show new status
      } catch (e) {
        console.error(e);
        alert('Failed to request return');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Order History</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="flex flex-col p-8 border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-black/5 dark:border-white/10 pb-4">
                <div className="mb-4 sm:mb-0">
                  <p className="font-bold text-xl mb-1">Order #{order.id.substring(0,8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <p className="font-bold text-xl mb-2">Rs. {order.totalAmount}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : order.status === 'RETURN_REQUESTED' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>{order.status}</span>
                    {order.status === 'DELIVERED' && (
                      <Button variant="outline" size="sm" onClick={() => handleReturn(order.id)}>
                        Request Return
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {order.items?.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{item.productTitle}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity} · Rs. {item.price}</p>
                    </div>
                    {order.status === 'DELIVERED' && (
                      <Button variant="outline" size="sm" onClick={() => setReviewing(item.productId)}>
                        Rate Item
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {/* Review Form Inline */}
              {order.items?.some(i => i.productId === reviewing) && (
                <div className="mt-6 p-6 bg-black/5 dark:bg-white/5 rounded-2xl">
                  <h4 className="font-bold mb-4">Write a Review</h4>
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-8 h-8 cursor-pointer ${i <= rating ? 'text-amber-400 fill-current' : 'text-black/10 dark:text-white/10'}`} onClick={() => setRating(i)} />
                    ))}
                  </div>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="How was the product?" className="w-full p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 mb-4 h-24 resize-none"></textarea>
                  <div className="flex gap-4">
                    <Button onClick={() => submitReview(reviewing)}>Submit Review</Button>
                    <Button variant="outline" onClick={() => setReviewing(null)}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

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
