import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getProducts } from '../../data/mockProducts';
import { Plus, Search as SearchIcon, Package, LayoutGrid, LayoutList, Upload, IndianRupee } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { AnimatedStatCard } from '../../components/ui/AnimatedStatCard';
import { SellerProductCard } from '../../components/ui/SellerProductCard';
import { OrderTimeline } from '../../components/ui/OrderTimeline';

export const SellerOnboarding = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
    <div className="w-full max-w-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[32px] p-12 shadow-2xl backdrop-blur-xl">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Welcome to Seller Center</h1>
      <p className="text-muted-foreground mb-10 text-lg">Let's set up your storefront in 3 simple steps.</p>
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/5 dark:bg-white/10 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map(step => (
          <div key={step} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${step === 1 ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-white dark:bg-black border border-black/10 dark:border-white/10 text-muted-foreground'}`}>
            {step}
          </div>
        ))}
      </div>
      <div className="space-y-6">
        <input type="text" placeholder="Store Name" className="w-full p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium" />
        <textarea placeholder="Store Description" className="w-full p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-medium h-32 resize-none" />
        <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:opacity-90 transition-all active:scale-[0.98] shadow-md">Continue</button>
      </div>
    </div>
  </div>
);

export const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');

  React.useEffect(() => {
    getProducts().then(data => {
      const sellerProducts = data.slice(0, 12).map(p => ({
        ...p,
        stock: Math.floor(Math.random() * 60),
        sku: `SKU-${p.id}`
      }));
      setProducts(sellerProducts);
      setLoading(false);
    });
  }, []);

  const updateStock = (id, newStock) => {
    if (newStock < 0) return;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="My Products"
        subtitle={`${products.length} products · ${products.filter(p => p.stock <= 10).length} low stock`}
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-md w-52">
              <SearchIcon className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm font-medium"
              />
            </div>
            <div className="flex items-center bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-1 gap-0.5">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}>
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
            <Button size="sm" className="flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center p-24">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Package className="w-8 h-8" />} title="No products found." description="Try a different search or add a new product." />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => (
            <SellerProductCard
              key={p.id}
              product={p}
              onEdit={() => {}}
              onDelete={removeProduct}
              onStockChange={updateStock}
            />
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map(p => (
                <Tr key={p.id}>
                  <Td>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 flex-shrink-0 p-2 border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="font-bold text-sm line-clamp-1">{p.title}</p>
                        <p className="text-muted-foreground text-xs font-medium">{p.sku}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="font-bold text-emerald-600 dark:text-emerald-400">₹{p.price.toLocaleString('en-IN')}</Td>
                  <Td>
                    <div className="flex items-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-1 w-fit">
                      <button onClick={() => updateStock(p.id, p.stock - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 font-bold text-sm">−</button>
                      <span className="w-10 text-center font-black text-sm">{p.stock}</span>
                      <button onClick={() => updateStock(p.id, p.stock + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 font-bold text-sm">+</button>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'danger'}>
                      {p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => removeProduct(p.id)}>Remove</Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export const BulkUpload = () => (
  <div className="space-y-8 font-sans">
    <PageHeader title="Bulk Upload" subtitle="Import products via CSV template." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <div className="border-2 border-dashed border-black/15 dark:border-white/15 rounded-2xl p-12 text-center flex flex-col items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xl font-bold mb-1">Drag & drop CSV here</p>
            <p className="text-muted-foreground text-sm font-medium">or click to browse files</p>
          </div>
          <Button size="sm" variant="outline">Select File</Button>
        </div>
      </Card>
      <Card>
        <h3 className="font-bold text-xl mb-5">CSV Format Guide</h3>
        <div className="space-y-3">
          {['title', 'price', 'category', 'stock', 'image_url', 'description'].map((col, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center font-bold text-xs text-muted-foreground">{i + 1}</div>
              <code className="font-mono text-sm font-bold text-primary">{col}</code>
              <span className="text-xs text-muted-foreground font-medium">required</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button variant="outline" size="sm" className="w-full">Download Template</Button>
        </div>
      </Card>
    </div>
  </div>
);

export const OrderManager = () => {
  const [filter, setFilter] = useState('pending');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const orders = [
    { id: '#ORD-8892', item: 'Sony Alpha a7 IV', customer: 'J. Alvarez', amount: 'Rs. 1,49,900', status: 'placed', date: '02 Sep 2026, 9:30 AM' },
    { id: '#ORD-8893', item: '2× Ceramic Mug Set', customer: 'R. Kapoor', amount: 'Rs. 1,199', status: 'packed', date: '02 Sep 2026, 8:00 AM' },
    { id: '#ORD-8879', item: 'MacBook Pro 16"', customer: 'S. Lee', amount: 'Rs. 3,49,900', status: 'shipped', date: '01 Sep 2026, 5:15 PM' },
    { id: '#ORD-8865', item: 'Keychron K2', customer: 'A. Smith', amount: 'Rs. 8,500', status: 'delivered', date: '31 Aug 2026, 11:00 AM' },
  ];

  const tabs = [
    { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'placed' || o.status === 'packed').length },
    { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

  const filtered = orders.filter(o => {
    if (filter === 'pending') return o.status === 'placed' || o.status === 'packed';
    return o.status === filter;
  });

  return (
    <div className="space-y-8 font-sans">
      <PageHeader title="Orders" subtitle="Track and fulfill your orders." />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${filter === t.key ? 'bg-primary text-primary-foreground shadow-md' : 'bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
          >
            {t.label} <span className="ml-1.5 opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState icon={<Package className="w-8 h-8" />} title="No orders here." description="All caught up in this category." />
        ) : filtered.map(order => (
          <div key={order.id} className="space-y-3">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-black text-base">{order.id}</p>
                      <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'primary' : 'warning'}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{order.item} · {order.customer}</p>
                    <p className="text-xs text-muted-foreground/70 font-medium mt-0.5">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="font-black text-lg">{order.amount}</p>
                  <Button size="sm" variant={expandedOrder === order.id ? 'secondary' : 'outline'}
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    {expandedOrder === order.id ? 'Collapse' : 'Track'}
                  </Button>
                  {(order.status === 'placed' || order.status === 'packed') && (
                    <Button size="sm">Mark Shipped</Button>
                  )}
                </div>
              </div>
            </Card>

            {expandedOrder === order.id && (
              <div className="px-2">
                <OrderTimeline status={order.status} orderId={order.id} date={order.date} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SellerAnalytics = () => {
  const salesData = [
    { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 }, { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 4500 }, { name: 'Fri', sales: 6000 }, { name: 'Sat', sales: 7000 }, { name: 'Sun', sales: 5500 },
  ];
  const trafficData = [
    { name: 'Organic', value: 400 }, { name: 'Direct', value: 300 },
    { name: 'Social', value: 300 }, { name: 'Referral', value: 200 },
  ];
  const COLORS = ['#E05D36', '#3b82f6', '#10b981', '#a855f7'];

  return (
    <div className="space-y-8 font-sans">
      <PageHeader title="Analytics" subtitle="Your store's performance at a glance." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedStatCard title="Revenue (7d)" value={35000} prefix="₹" trend="+12% vs last week" trendUp={true} icon={<IndianRupee className="w-5 h-5" />} color="primary" />
        <AnimatedStatCard title="Total Orders" value={128} trend="+8 this week" trendUp={true} icon={<Package className="w-5 h-5" />} color="blue" />
        <AnimatedStatCard title="Avg. Order Value" value={2730} prefix="₹" trend="−₹200 vs avg" trendUp={false} icon={<IndianRupee className="w-5 h-5" />} color="amber" />
        <AnimatedStatCard title="Conversion Rate" value={32} suffix="%" trend="+3% this month" trendUp={true} icon={<IndianRupee className="w-5 h-5" />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xl">Sales Overview</h3>
              <p className="text-muted-foreground text-sm font-medium">Last 7 days</p>
            </div>
            <p className="text-2xl font-black">₹35,000</p>
          </div>
          <div className="p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E05D36" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E05D36" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 11 }} tickFormatter={(v) => `₹${v/1000}k`} width={45} />
                <Tooltip contentStyle={{ borderRadius: '16px', fontWeight: 'bold' }} formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']} />
                <Area type="monotone" dataKey="sales" stroke="#E05D36" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-black/5 dark:border-white/10">
            <h3 className="font-bold text-xl">Traffic Sources</h3>
            <p className="text-muted-foreground text-sm font-medium">Where your buyers come from</p>
          </div>
          <div className="p-4 h-56 flex items-center">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={trafficData} cx="50%" cy="50%" innerRadius={60} outerRadius={88} paddingAngle={5} dataKey="value" strokeWidth={0}>
                    {trafficData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 pr-2">
              {trafficData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-sm font-bold">{entry.name}</span>
                  <span className="text-xs text-muted-foreground ml-1">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const PayoutLedger = () => (
  <div className="space-y-8 font-sans">
    <PageHeader title="Payouts" subtitle="Track your earnings and withdrawal history." />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 p-8">
          <p className="text-muted-foreground font-semibold mb-3">Available for payout</p>
          <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-6">₹4,250.00</p>
          <Button size="lg">Request Payout</Button>
        </Card>
      </div>
      <div className="space-y-4">
        <AnimatedStatCard title="Total Earned" value={84250} prefix="₹" trend="Since joining" trendUp={true} icon={<IndianRupee className="w-4 h-4" />} color="primary" />
        <AnimatedStatCard title="Pending Clearance" value={12350} prefix="₹" trend="3–5 days" trendUp={true} icon={<IndianRupee className="w-4 h-4" />} color="amber" />
      </div>
    </div>
    <Card className="p-0 overflow-hidden">
      <div className="p-6 border-b border-black/5 dark:border-white/10">
        <h3 className="font-bold text-xl">Transaction History</h3>
      </div>
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Orders</Th>
            <Th>Gross</Th>
            <Th>Commission</Th>
            <Th>Net Payout</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {[
            { date: '01 Sep 2026', orders: 14, gross: '₹21,400', fee: '₹1,070', net: '₹20,330', status: 'Paid' },
            { date: '25 Aug 2026', orders: 9, gross: '₹13,200', fee: '₹660', net: '₹12,540', status: 'Paid' },
            { date: '18 Aug 2026', orders: 6, gross: '₹8,900', fee: '₹445', net: '₹8,455', status: 'Paid' },
          ].map((row, i) => (
            <Tr key={i}>
              <Td className="font-semibold text-sm">{row.date}</Td>
              <Td className="font-medium text-muted-foreground">{row.orders}</Td>
              <Td className="font-bold">{row.gross}</Td>
              <Td className="text-red-500 font-bold">−{row.fee}</Td>
              <Td className="font-black text-emerald-600 dark:text-emerald-400">{row.net}</Td>
              <Td><Badge variant="success">{row.status}</Badge></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  </div>
);

export const StoreSettings = () => (
  <div className="space-y-8 font-sans">
    <PageHeader title="Store Settings" subtitle="Manage your store profile and policies." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="space-y-5">
        <h3 className="font-bold text-xl">Store Profile</h3>
        <div>
          <label className="block text-sm font-bold mb-2">Store Name</label>
          <input type="text" defaultValue="AudioHub" className="w-full p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Store Description</label>
          <textarea defaultValue="Premium audio & electronics marketplace." className="w-full p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium h-28 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Return Policy</label>
          <textarea defaultValue="30-day money back guarantee." className="w-full p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium h-24 resize-none" />
        </div>
        <Button size="lg" className="w-full">Save Changes</Button>
      </Card>
      <div className="space-y-4">
        <Card>
          <h3 className="font-bold text-xl mb-5">Notifications</h3>
          <div className="space-y-4">
            {['New Orders', 'Low Stock Alerts', 'Payout Processed', 'Dispute Filed'].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="font-semibold text-sm">{item}</p>
                <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${i !== 2 ? 'bg-primary' : 'bg-black/10 dark:bg-white/10'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full m-0.5 shadow transition-transform ${i !== 2 ? 'translate-x-5' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-xl mb-4">Store Status</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">Store is Live</span>
            </div>
            <Button variant="secondary" size="sm">Set to Holiday Mode</Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
);
