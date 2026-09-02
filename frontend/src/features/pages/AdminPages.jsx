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

export const PlatformAnalytics = () => (
  <div className="space-y-8 font-sans">
    <PageHeader title="Platform Analytics" subtitle="Real-time overview of the marketplace." />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AnimatedStatCard title="GMV (30d)" value={1200000} prefix="₹" trend="+18% vs last month" trendUp={true} icon={<IndianRupee className="w-5 h-5" />} color="primary" />
      <AnimatedStatCard title="Active Buyers" value={45200} trend="+2.3k this week" trendUp={true} icon={<Users className="w-5 h-5" />} color="blue" />
      <AnimatedStatCard title="Active Sellers" value={892} trend="8 pending review" trendUp={true} icon={<Package className="w-5 h-5" />} color="emerald" />
      <AnimatedStatCard title="Platform Fee Rev" value={60000} prefix="₹" trend="+12% growth" trendUp={true} icon={<TrendingUp className="w-5 h-5" />} color="purple" />
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

export const VendorApproval = () => {
  const [vendors, setVendors] = useState([
    { id: 1, name: 'New Store 1 LLC', email: 'contact@store1.com', category: 'Electronics', date: '02 Sep', location: 'Mumbai', type: 'Sole Proprietor' },
    { id: 2, name: 'ElectroWorld', email: 'sales@electroworld.com', category: 'Electronics', date: '01 Sep', location: 'Delhi', type: 'Pvt. Ltd.' },
    { id: 3, name: 'StyleHub PVT', email: 'hello@stylehub.in', category: 'Fashion', date: '31 Aug', location: 'Bangalore', type: 'Pvt. Ltd.' },
  ]);

  const handleAction = (id) => setVendors(prev => prev.filter(v => v.id !== id));

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
            <VendorCard key={v.id} vendor={v} onApprove={handleAction} onReject={handleAction} />
          ))}
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-black/5 dark:border-white/10">
          <h3 className="font-bold text-xl">Recently Processed</h3>
        </div>
        <Table>
          <Thead>
            <Tr>
              <Th>Vendor</Th>
              <Th>Category</Th>
              <Th>Decision</Th>
              <Th>By</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {[
              { name: 'TechHub Store', category: 'Electronics', decision: 'Approved', by: 'Admin', date: '01 Sep' },
              { name: 'FakeBrands LLC', category: 'Fashion', decision: 'Rejected', by: 'Admin', date: '31 Aug' },
              { name: 'HomeDecor Plus', category: 'Home', decision: 'Approved', by: 'Admin', date: '30 Aug' },
            ].map((row, i) => (
              <Tr key={i}>
                <Td className="font-bold">{row.name}</Td>
                <Td className="text-muted-foreground font-medium">{row.category}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    {row.decision === 'Approved' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    <Badge variant={row.decision === 'Approved' ? 'success' : 'danger'}>{row.decision}</Badge>
                  </div>
                </Td>
                <Td className="text-muted-foreground font-medium">{row.by}</Td>
                <Td className="text-muted-foreground text-sm">{row.date}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
};

export const CatalogModeration = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Suspicious Rolex', vendor: 'WatchWorld', reason: 'Counterfeit claim', date: '02 Sep', reports: 5 },
    { id: 2, name: 'Unbranded Charger', vendor: 'TechStore', reason: 'Safety violation', date: '01 Sep', reports: 3 },
    { id: 3, name: 'Stolen Software Key', vendor: 'DigitalGoods', reason: 'Copyright infringement', date: '31 Aug', reports: 8 },
  ]);

  const handleAction = (id) => setItems(prev => prev.filter(item => item.id !== id));

  return (
    <div className="space-y-8 font-sans">
      <PageHeader title="Catalog Moderation" subtitle={`${items.length} items awaiting review.`} />
      {items.length === 0 ? (
        <EmptyState icon={<ListChecks className="w-8 h-8" />} title="Queue is clear!" description="All reported products have been reviewed." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map(item => (
            <Card key={item.id} className="p-6 relative hover:shadow-lg transition-all">
              <div className="absolute top-5 right-5 flex flex-col gap-2 items-end">
                <Badge variant="danger">Reported</Badge>
                <span className="text-xs font-bold text-red-500">{item.reports} reports</span>
              </div>
              <div className="aspect-video bg-black/5 dark:bg-white/5 rounded-2xl mb-5 flex items-center justify-center">
                <Package className="w-10 h-10 text-muted-foreground opacity-30" />
              </div>
              <p className="text-xs font-bold text-muted-foreground mb-1">{item.vendor} · {item.date}</p>
              <h4 className="font-bold text-lg mb-1">{item.name}</h4>
              <p className="text-sm text-red-500 dark:text-red-400 font-medium mb-5">{item.reason}</p>
              <div className="mb-5">
                <ProgressBar label="Severity" value={item.reports * 10} max={100} color="danger" size="sm" />
              </div>
              <div className="flex gap-2">
                <Button variant="danger" className="flex-1" onClick={() => handleAction(item.id)}>Take Down</Button>
                <Button variant="secondary" className="flex-1" onClick={() => handleAction(item.id)}>Ignore</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
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

export const DisputeCenter = () => {
  const [disputes, setDisputes] = useState([
    { id: '#8892', title: 'Item never arrived', buyer: 'J. Smith', seller: 'TechStore', amount: 'Rs. 29,990', status: 'Escalated', days: 5 },
    { id: '#8879', title: 'Wrong item received', buyer: 'A. Kumar', seller: 'FashionVault', amount: 'Rs. 3,499', status: 'Open', days: 2 },
    { id: '#8865', title: 'Damaged packaging', buyer: 'S. Patel', seller: 'HomeStyle', amount: 'Rs. 5,600', status: 'Open', days: 1 },
  ]);

  const resolve = (id) => setDisputes(prev => prev.filter(d => d.id !== id));

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Dispute Center</h1>
          <p className="text-muted-foreground font-medium text-lg">{disputes.length} active disputes.</p>
        </div>
        <div className="flex gap-2">
          <div className="p-3 bg-red-500/10 rounded-2xl text-center px-5">
            <p className="font-black text-2xl text-red-600 dark:text-red-400">{disputes.filter(d => d.status === 'Escalated').length}</p>
            <p className="text-xs font-bold text-muted-foreground">Escalated</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-2xl text-center px-5">
            <p className="font-black text-2xl text-amber-600 dark:text-amber-400">{disputes.filter(d => d.status === 'Open').length}</p>
            <p className="text-xs font-bold text-muted-foreground">Open</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-center px-5">
            <p className="font-black text-2xl text-emerald-600 dark:text-emerald-400">41</p>
            <p className="text-xs font-bold text-muted-foreground">Resolved</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {disputes.map((d, i) => (
          <Card key={i} className={`p-6 border-l-4 ${d.status === 'Escalated' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${d.status === 'Escalated' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-black text-base">Order {d.id}</span>
                    <Badge variant={d.status === 'Escalated' ? 'danger' : 'warning'}>{d.status}</Badge>
                    <span className="text-xs font-bold text-muted-foreground">Open {d.days}d</span>
                  </div>
                  <p className="font-bold text-muted-foreground mb-1">{d.title}</p>
                  <p className="text-sm text-muted-foreground">Buyer: {d.buyer} · Seller: {d.seller} · <span className="font-bold text-foreground">{d.amount}</span></p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:items-end shrink-0">
                <div className="flex gap-2">
                  <Button size="sm">Review Evidence</Button>
                  <Button variant="secondary" size="sm" onClick={() => resolve(d.id)}>Refund Buyer</Button>
                </div>
                <button onClick={() => resolve(d.id)} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:opacity-80 text-right">
                  Mark as Resolved →
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
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
