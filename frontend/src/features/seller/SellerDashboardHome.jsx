import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Truck, AlertTriangle, IndianRupee, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table';
import { AnimatedStatCard } from '../../components/ui/AnimatedStatCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { QuickActionButton } from '../../components/ui/QuickActionButton';

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 6890 },
  { name: 'Sat', revenue: 8390 },
  { name: 'Sun', revenue: 9490 },
];

const categoryData = [
  { name: 'Electronics', value: 45 },
  { name: 'Fashion', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Other', value: 10 },
];

const PIE_COLORS = ['#E05D36', '#3b82f6', '#10b981', '#a855f7'];

const recentOrders = [
  { id: '#ORD-0921', item: 'Sony Alpha a7 IV', amount: 'Rs. 1,49,900', status: 'Processing' },
  { id: '#ORD-0922', item: 'MacBook Pro 16"', amount: 'Rs. 3,49,900', status: 'Shipped' },
  { id: '#ORD-0923', item: 'Keychron K2', amount: 'Rs. 8,500', status: 'Delivered' },
  { id: '#ORD-0924', item: 'LG UltraGear OLED', amount: 'Rs. 85,000', status: 'Processing' },
  { id: '#ORD-0925', item: 'iPad Pro 12.9"', amount: 'Rs. 1,12,900', status: 'Delivered' },
];

const topProducts = [
  { name: 'Sony Alpha a7 IV', sales: 34, revenue: 'Rs. 50.9L', rating: 4.9 },
  { name: 'MacBook Pro 16"', sales: 21, revenue: 'Rs. 73.5L', rating: 4.8 },
  { name: 'LG UltraGear OLED', sales: 18, revenue: 'Rs. 15.3L', rating: 4.7 },
];

export const SellerDashboardHome = () => {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Welcome back, Seller!</h1>
          <p className="text-muted-foreground font-medium text-lg">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-sm">Store is live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedStatCard title="Revenue (7d)" value={542860} prefix="₹" trend="+24% vs last week" trendUp={true} icon={<IndianRupee className="w-5 h-5" />} color="primary" />
        <AnimatedStatCard title="Orders" value={128} trend="12 to fulfill" trendUp={true} icon={<ShoppingBag className="w-5 h-5" />} color="blue" />
        <AnimatedStatCard title="Products Listed" value={45} trend="4 low stock" trendUp={false} icon={<Package className="w-5 h-5" />} color="purple" />
        <AnimatedStatCard title="Avg. Rating" value={48} suffix="/50" trend="98% positive" trendUp={true} icon={<Star className="w-5 h-5" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl">Revenue (7 Days)</h3>
              <Badge variant="success">+24%</Badge>
            </div>
          </div>
          <div className="p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E05D36" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E05D36" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="revenue" stroke="#E05D36" strokeWidth={2.5} fillOpacity={1} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-black/5 dark:border-white/10">
            <h3 className="font-bold text-xl">Sales by Category</h3>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="h-44">
              <ResponsiveContainer width={180} height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2 mt-2">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}></div>
                    <span className="text-sm font-medium text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="text-sm font-bold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 pb-0">
            <h3 className="font-bold text-xl mb-1">Recent Orders</h3>
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Item</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentOrders.map((order, i) => (
                <Tr key={i}>
                  <Td className="font-bold text-sm">{order.id}</Td>
                  <Td className="font-medium text-muted-foreground text-sm">{order.item}</Td>
                  <Td className="font-bold text-sm">{order.amount}</Td>
                  <Td>
                    <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'primary' : 'warning'}>
                      {order.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="font-bold text-xl mb-5">Quick Actions</h3>
            <div className="space-y-2">
              <QuickActionButton icon={<Package className="w-4 h-4" />} label="Add New Product" description="List a new item for sale" color="primary" />
              <QuickActionButton icon={<Truck className="w-4 h-4" />} label="Print Shipping Labels" description="12 orders ready" color="default" />
              <QuickActionButton icon={<AlertTriangle className="w-4 h-4" />} label="Resolve Dispute" description="1 escalated case" color="danger" />
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-xl mb-5">Top Products</h3>
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center font-bold text-sm text-muted-foreground">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{p.revenue}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-muted-foreground">{p.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
