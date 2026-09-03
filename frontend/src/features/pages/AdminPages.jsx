import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table';
import { AnimatedStatCard } from '../../components/ui/AnimatedStatCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { AuditLog } from '../../components/ui/AuditLog';
import { VendorCard } from '../../components/ui/VendorCard';
import { ShieldAlert, ListChecks, Tags, AlertCircle, Users, TrendingUp, IndianRupee, Package, CheckCircle2, XCircle, Zap } from 'lucide-react';

const gmvData = [
  { name: 'Apr', gmv: 820000 }, { name: 'May', gmv: 930000 }, { name: 'Jun', gmv: 1100000 },
  { name: 'Jul', gmv: 980000 }, { name: 'Aug', gmv: 1200000 }, { name: 'Sep', gmv: 1350000 },
];
const categoryRevData = [
  { name: 'Electronics', rev: 580000 },
  { name: 'Fashion', rev: 320000 },
  { name: 'Home', rev: 210000 },
  { name: 'Beauty', rev: 140000 },
  { name: 'Sports', rev: 100000 },
];
const recentVendors = [
  { name: 'TechHub Store', category: 'Electronics', gmv: 'Rs. 4.2L', orders: 312, status: 'Active' },
  { name: 'FashionVault', category: 'Fashion', gmv: 'Rs. 1.8L', orders: 145, status: 'Active' },
  { name: 'HomeStyle Co.', category: 'Home', gmv: 'Rs. 0.9L', orders: 67, status: 'Review' },
  { name: 'GlowBeauty', category: 'Beauty', gmv: 'Rs. 0.5L', orders: 43, status: 'Active' },
];
const auditEntries = [
  { actor: 'Admin', action: 'approved', detail: 'Vendor "TechHub Store" KYC approved', time: '2 min ago', type: 'approved' },
  { actor: 'System', action: 'flagged', detail: 'Product "Suspicious Rolex" auto-flagged for review', time: '14 min ago', type: 'flagged' },
  { actor: 'Admin', action: 'config', detail: 'Commission rate for Electronics updated to 5%', time: '1 hr ago', type: 'config' },
  { actor: 'Admin', action: 'rejected', detail: 'Vendor "FakeBrands LLC" rejected — counterfeit risk', time: '3 hr ago', type: 'rejected' },
  { actor: 'System', action: 'payout', detail: 'Bulk payout of ₹2.4L processed to 34 sellers', time: '5 hr ago', type: 'payout' },
  { actor: 'super@admin.com', action: 'login', detail: 'Admin login from 192.168.1.1 (Mumbai)', time: 'Yesterday', type: 'login' },
];

export const PlatformAnalytics = () => {
  const [stats, setStats] = useState(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const api = (await import('../../api/axiosInstance')).default;
        const res = await api.get('/admin/analytics/overview');
        setStats(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      <PageHeader title="Platform Analytics" subtitle="Real-time overview of the marketplace." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedStatCard title="Total GMV" value={stats?.totalGmv || 0} prefix="₹" trend="Lifetime sales" trendUp={true} icon={<IndianRupee className="w-5 h-5" />} color="primary" />
        <AnimatedStatCard title="Total Orders" value={stats?.totalOrders || 0} trend="All time" trendUp={true} icon={<Package className="w-5 h-5" />} color="blue" />
        <AnimatedStatCard title="Active Sellers" value={stats?.activeVendors || 0} trend={`${stats?.pendingVendors || 0} pending review`} trendUp={true} icon={<Users className="w-5 h-5" />} color="emerald" />
        <AnimatedStatCard title="Total Products" value={stats?.totalProducts || 0} trend={`${stats?.bannedProducts || 0} banned`} trendUp={false} icon={<Tags className="w-5 h-5" />} color="purple" />
      </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-0 overflow-hidden">
        <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-xl">GMV Trend (6 Months)</h3>
          <Badge variant="success">+18%</Badge>
        </div>
        <div className="p-4 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gmvData}>
              <defs>
                <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E05D36" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#E05D36" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} width={55} />
              <Tooltip formatter={(v) => [`₹${(v/100000).toFixed(2)}L`, 'GMV']} contentStyle={{ borderRadius: '16px', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="gmv" stroke="#E05D36" strokeWidth={2.5} fill="url(#gmvGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-black/5 dark:border-white/10">
          <h3 className="font-bold text-xl">Revenue by Category</h3>
        </div>
        <div className="p-4 h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryRevData} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} width={70} />
              <Tooltip formatter={(v) => [`₹${(v/1000).toFixed(0)}k`, 'Revenue']} contentStyle={{ borderRadius: '12px', fontWeight: 'bold' }} />
              <Bar dataKey="rev" fill="#E05D36" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-black/5 dark:border-white/10">
            <h3 className="font-bold text-xl">Top Performing Vendors</h3>
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>Vendor</Th>
                <Th>Category</Th>
                <Th>GMV</Th>
                <Th>Orders</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentVendors.map((v, i) => (
                <Tr key={i}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {v.name[0]}
                      </div>
                      <span className="font-bold">{v.name}</span>
                    </div>
                  </Td>
                  <Td className="text-muted-foreground font-medium">{v.category}</Td>
                  <Td className="font-bold text-emerald-600 dark:text-emerald-400">{v.gmv}</Td>
                  <Td className="font-semibold text-muted-foreground">{v.orders}</Td>
                  <Td><Badge variant={v.status === 'Active' ? 'success' : 'warning'}>{v.status}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-xl mb-6">Platform Health</h3>
        <div className="space-y-5">
          <div>
            <ProgressBar label="Order Fulfillment Rate" value={94} showValue animate color="success" />
          </div>
          <div>
            <ProgressBar label="Vendor KYC Completion" value={78} showValue animate color="primary" />
          </div>
          <div>
            <ProgressBar label="Dispute Resolution Rate" value={88} showValue animate color="blue" />
          </div>
          <div>
            <ProgressBar label="Platform Uptime (30d)" value={99} showValue animate color="emerald" />
          </div>
          <div>
            <ProgressBar label="Catalog Compliance" value={65} showValue animate color="warning" />
          </div>
        </div>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-xl">Recent Admin Activity</h3>
          <Badge variant="default">Live</Badge>
        </div>
        <div className="p-4">
          <AuditLog entries={auditEntries} />
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-xl mb-6">Quick Platform Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-4 p-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl transition-all group text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><Zap className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-sm">Run Bulk Payout</p>
              <p className="text-xs text-muted-foreground font-medium">34 sellers · ₹2.4L pending</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-4 p-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl transition-all group text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Users className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-sm">Review KYC Queue</p>
              <p className="text-xs text-muted-foreground font-medium">3 vendors awaiting approval</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-4 p-4 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 rounded-2xl transition-all group text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform"><AlertCircle className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-sm text-amber-600 dark:text-amber-400">Moderate Flagged Items</p>
              <p className="text-xs text-muted-foreground font-medium">3 items pending review</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-4 p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl transition-all group text-left">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform"><AlertCircle className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-sm text-red-600 dark:text-red-400">Resolve Escalated Disputes</p>
              <p className="text-xs text-muted-foreground font-medium">1 escalated · 2 open</p>
            </div>
          </button>
        </div>
      </Card>
    </div>
    </div>
  );
};

export const VendorApproval = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const api = (await import('../../api/axiosInstance')).default;
      const res = await api.get('/admin/vendors/pending');
      setVendors(res.data.map(v => ({
        id: v.id,
        name: v.storeName,
        email: v.user?.email || 'Unknown',
        category: v.businessDetails || 'General',
        date: new Date().toLocaleDateString(),
        location: 'Not Provided',
        type: v.bankAccountRef || 'N/A'
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      let reason = null;
      if (action === 'reject') {
        reason = prompt("Please provide a reason for rejecting this application (the seller will see this):");
        if (reason === null) return;
      }
      
      const api = (await import('../../api/axiosInstance')).default;
      const status = action === 'approve' ? 'APPROVED' : 'REJECTED';
      await api.post(`/admin/vendors/${id}/status`, { status, reason });
      setVendors(prev => prev.filter(v => v.id !== id));
    } catch (e) {
      console.error(e);
      alert(e.response?.data || 'Action failed');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Vendor Approval</h1>
          <p className="text-muted-foreground font-medium text-lg">{vendors.length} pending KYC applications.</p>
        </div>
        <div className="flex gap-2">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-center px-5">
            <p className="font-black text-2xl text-emerald-600 dark:text-emerald-400">247</p>
            <p className="text-xs font-bold text-muted-foreground">Approved</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-2xl text-center px-5">
            <p className="font-black text-2xl text-red-600 dark:text-red-400">18</p>
            <p className="text-xs font-bold text-muted-foreground">Rejected</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-2xl text-center px-5">
            <p className="font-black text-2xl text-amber-600 dark:text-amber-400">{vendors.length}</p>
            <p className="text-xs font-bold text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>

      {vendors.length === 0 ? (
        <EmptyState icon={<ShieldAlert className="w-8 h-8" />} title="All caught up!" description="No pending vendor applications right now." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map(v => (
            <VendorCard key={v.id} vendor={v} onApprove={(id) => handleAction(id, 'approve')} onReject={(id) => handleAction(id, 'reject')} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CatalogModeration = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  React.useEffect(() => {
    fetchProducts();
  }, [search, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const api = (await import('../../api/axiosInstance')).default;
      let url = '/admin/products?';
      if (search) url += `search=${search}&`;
      if (statusFilter) url += `status=${statusFilter}&`;
      
      const res = await api.get(url);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const api = (await import('../../api/axiosInstance')).default;
      if (action === 'ban') {
        const reason = prompt("Reason for banning this product?");
        if (!reason) return;
        await api.put(`/admin/products/${id}/ban`, { reason });
      } else {
        await api.put(`/admin/products/${id}/unban`);
      }
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <PageHeader 
        title="Catalog Moderation" 
        subtitle={`${items.length} products available.`} 
        action={
          <div className="flex gap-4">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 outline-none">
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="BANNED">Banned</option>
            </select>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 outline-none w-64"
            />
          </div>
        }
      />
      
      <Card className="p-0 overflow-hidden">
        <Table>
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Vendor</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr><Td colSpan="6" className="text-center p-8">Loading...</Td></Tr>
            ) : items.length === 0 ? (
              <Tr><Td colSpan="6" className="text-center p-8">No products found.</Td></Tr>
            ) : items.map(item => (
              <Tr key={item.id}>
                <Td className="font-bold flex items-center gap-3">
                  <img src={item.imageUrl || 'https://via.placeholder.com/40'} className="w-10 h-10 object-contain bg-white rounded-lg p-1" />
                  <span className="line-clamp-1">{item.title}</span>
                </Td>
                <Td className="text-muted-foreground">{item.vendor?.storeName || 'Unknown'}</Td>
                <Td className="text-muted-foreground">{item.category}</Td>
                <Td className="font-bold">₹{item.price?.toLocaleString('en-IN')}</Td>
                <Td>
                  <Badge variant={item.status === 'BANNED' ? 'danger' : 'success'}>{item.status}</Badge>
                </Td>
                <Td>
                  {item.status === 'BANNED' ? (
                    <Button variant="outline" size="sm" onClick={() => handleAction(item.id, 'unban')}>Unban</Button>
                  ) : (
                    <Button variant="danger" size="sm" onClick={() => handleAction(item.id, 'ban')}>Ban</Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
};

export const PromotionsCMS = () => (
  <div className="space-y-8 font-sans">
    <PageHeader title="Promotions CMS" subtitle="Manage banners and promotional campaigns." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-xl">Active Hero Banner</h3>
          <Badge variant="success">Live</Badge>
        </div>
        <div className="h-44 bg-gradient-to-br from-[#18181b] to-[#27272a] rounded-2xl flex flex-col items-center justify-center text-white mb-6 shadow-inner gap-2">
          <p className="font-black text-3xl">Flash Sale</p>
          <p className="text-4xl font-black text-primary">50% Off</p>
          <p className="text-sm text-white/60 font-medium">Ends 05 Sep 2026 · 12:00 AM</p>
        </div>
        <div className="mb-5">
          <ProgressBar label="Campaign Progress" value={68} showValue color="primary" />
        </div>
        <div className="flex gap-3">
          <Button className="flex-1">Edit Banner</Button>
          <Button variant="secondary" className="flex-1">Pause</Button>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-xl">Email Campaign</h3>
          <Badge variant="warning">Draft</Badge>
        </div>
        <div className="h-44 bg-black/5 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center text-muted-foreground mb-6 gap-3">
          <Tags className="w-12 h-12 opacity-30" />
          <span className="text-sm font-semibold">No campaign configured</span>
        </div>
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-muted-foreground">Target audience</span>
            <span className="font-bold">45,200 buyers</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-muted-foreground">Avg. open rate</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">34.2%</span>
          </div>
        </div>
        <Button variant="outline" className="w-full">Create Campaign</Button>
      </Card>
    </div>
  </div>
);

export const OrderOversight = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  React.useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const api = (await import('../../api/axiosInstance')).default;
      let url = '/admin/orders?';
      if (statusFilter) url += `status=${statusFilter}&`;

      const res = await api.get(url);
      setOrders(res.data.map(o => ({
        id: o.id,
        buyer: o.buyer?.email || 'Unknown',
        amount: o.totalAmount,
        status: o.status,
        date: new Date(o.createdAt).toLocaleDateString()
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <PageHeader 
        title="Order Oversight" 
        subtitle={`${orders.length} total orders across the platform.`} 
        action={
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 outline-none">
            <option value="">All Statuses</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        }
      />
      
      <Card className="p-0 overflow-hidden">
        <Table>
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Buyer</Th>
              <Th>Amount</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr><Td colSpan="5" className="text-center p-8">Loading...</Td></Tr>
            ) : orders.length === 0 ? (
              <Tr><Td colSpan="5" className="text-center p-8">No orders found.</Td></Tr>
            ) : orders.map((o, i) => (
              <Tr key={i}>
                <Td className="font-bold">{o.id.substring(0,8)}...</Td>
                <Td className="text-muted-foreground font-medium">{o.buyer}</Td>
                <Td className="font-bold">₹{o.amount.toLocaleString('en-IN')}</Td>
                <Td className="text-sm text-muted-foreground">{o.date}</Td>
                <Td><Badge variant={['DELIVERED', 'PAID'].includes(o.status) ? 'success' : o.status === 'CANCELLED' ? 'danger' : 'warning'}>{o.status}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
};

export const CommissionConfig = () => {
  const categories = [
    { name: 'Electronics', rate: 5, tier: 'Standard', color: 'blue' },
    { name: 'Fashion', rate: 12, tier: 'High margin', color: 'purple' },
    { name: 'Home Goods', rate: 8, tier: 'Standard', color: 'emerald' },
    { name: 'Beauty', rate: 15, tier: 'Premium', color: 'primary' },
    { name: 'Sports', rate: 7, tier: 'Standard', color: 'amber' },
  ];

  return (
    <div className="space-y-8 font-sans">
      <PageHeader title="Commission Config" subtitle="Set platform fee rates per category." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-5">
          <h3 className="font-bold text-xl">Category Rates</h3>
          {categories.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium">{item.tier} tier</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={item.rate}
                    className="w-14 p-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-right font-black focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  />
                  <span className="font-bold">%</span>
                </div>
              </div>
              <ProgressBar value={item.rate} max={20} color={item.color} size="sm" />
            </div>
          ))}
          <Button size="lg" className="w-full mt-4">Update All Rates</Button>
        </Card>

        <div className="space-y-5">
          <Card>
            <h3 className="font-bold text-xl mb-5">Fee Summary</h3>
            <div className="space-y-4">
              <AnimatedStatCard title="Total Commissions (30d)" value={60000} prefix="₹" trend="+12% growth" trendUp={true} icon={<IndianRupee className="w-4 h-4" />} color="primary" />
              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl">
                <p className="text-xs font-bold text-muted-foreground mb-2">Best performing category</p>
                <p className="font-black text-2xl">Fashion</p>
                <p className="text-sm text-emerald-500 font-bold mt-1">₹21,600 this month · 12% rate</p>
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-black/5 dark:border-white/10">
              <h3 className="font-bold text-lg">Audit Log</h3>
            </div>
            <div className="p-4">
              <AuditLog entries={[
                { actor: 'Admin', action: 'config', detail: 'Electronics rate updated: 8% → 5%', time: '1 hr ago', type: 'config' },
                { actor: 'Admin', action: 'config', detail: 'Beauty rate updated: 12% → 15%', time: '3 hr ago', type: 'config' },
                { actor: 'Admin', action: 'config', detail: 'Fashion tier promoted to High margin', time: 'Yesterday', type: 'approved' },
              ]} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
