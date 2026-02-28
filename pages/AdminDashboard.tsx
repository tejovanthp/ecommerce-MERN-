
import React, { useState, useMemo } from 'react';
import { useStore } from '../App.tsx';
import { Product, Order, SaleEvent } from '../types.ts';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const CATEGORIES = ['Electronics', 'Mobiles', 'Fashion', 'Home', 'Accessories'];

const AdminDashboard: React.FC = () => {
  const { products, orders, users, saleEvents, addProduct, updateProduct, deleteProduct, updateOrder, addSaleEvent, updateSaleEvent, deleteSaleEvent, isOnline, diagnostics } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics' | 'sales'>('analytics');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSale, setEditingSale] = useState<SaleEvent | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
    image: '',
    rating: 4.5
  });

  const [saleFormData, setSaleFormData] = useState<Partial<SaleEvent>>({
    title: '',
    description: '',
    discountPercentage: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    image: '',
    isActive: true,
    type: 'SALE'
  });

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

  // Analytics Data Processing
  const analyticsData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = orders.filter(o => o.createdAt.startsWith(date));
      return {
        date: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
        sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
        count: dayOrders.length
      };
    });
  }, [orders]);

  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catProducts = products.filter(p => p.category === cat);
      return {
        name: cat,
        count: catProducts.length,
        value: catProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)
      };
    });
  }, [products]);

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setShowForm(true);
  };

  const handleEditSale = (s: SaleEvent) => {
    setEditingSale(s);
    setSaleFormData(s);
    setShowSaleForm(true);
  };

  const generateRandomImage = () => {
    const seed = Math.random().toString(36).substring(7);
    setFormData({ ...formData, image: `https://picsum.photos/seed/${seed}/800/600` });
  };

  const generateRandomSaleImage = () => {
    const seed = Math.random().toString(36).substring(7);
    setSaleFormData({ ...saleFormData, image: `https://picsum.photos/seed/${seed}/1200/400` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      image: formData.image || `https://picsum.photos/seed/${formData.name}/800/600`
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...finalData } as Product);
    } else {
      addProduct({ ...finalData, id: 'p' + Math.random().toString(36).substr(2, 6) } as Product);
    }
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0, category: 'Electronics', stock: 0, image: '', rating: 4.5 });
  };

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...saleFormData,
      image: saleFormData.image || `https://picsum.photos/seed/${saleFormData.title}/1200/400`
    };

    if (editingSale) {
      updateSaleEvent({ ...editingSale, ...finalData } as SaleEvent);
    } else {
      addSaleEvent({ ...finalData, id: 's' + Math.random().toString(36).substr(2, 6) } as SaleEvent);
    }
    setShowSaleForm(false);
    setEditingSale(null);
    setSaleFormData({ title: '', description: '', discountPercentage: 0, startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], image: '', isActive: true, type: 'SALE' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Master Dashboard</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Crimson Command.</h1>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: 0, category: 'Electronics', stock: 0, image: '', rating: 4.5 }); setShowForm(true); }} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-2xl active:scale-95">
            <i className="fa-solid fa-plus-circle mr-3"></i> New Listing
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-3xl w-fit">
        {(['analytics', 'inventory', 'orders', 'sales'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab 
              ? 'bg-white dark:bg-slate-800 text-red-600 shadow-lg' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Total Revenue</span>
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">₹{totalSales.toLocaleString('en-IN')}</p>
              <div className="mt-4 flex items-center text-green-500 text-xs font-bold">
                <i className="fa-solid fa-arrow-trend-up mr-2"></i> +12.5% from last month
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Active Orders</span>
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{orders.filter(o => o.status === 'PENDING').length}</p>
              <div className="mt-4 flex items-center text-yellow-500 text-xs font-bold">
                <i className="fa-solid fa-clock mr-2"></i> Awaiting fulfillment
              </div>
            </div>
            <div className={`p-8 rounded-[2.5rem] border ${isOnline ? 'bg-white dark:bg-slate-900 border-green-500/20' : 'bg-red-50 dark:bg-red-950/20 border-red-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Atlas Connection</span>
                  <p className={`text-3xl font-black tracking-tighter ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600 animate-pulse'}`}>
                  <i className={`fa-solid ${isOnline ? 'fa-cloud-check' : 'fa-triangle-exclamation'}`}></i>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl">
              <h3 className="text-xl font-black mb-8 text-slate-900 dark:text-white tracking-tight">Revenue Trend</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                      itemStyle={{fontWeight: 900, color: '#dc2626'}}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#dc2626" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl">
              <h3 className="text-xl font-black mb-8 text-slate-900 dark:text-white tracking-tight">Inventory Distribution</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="count" fill="#dc2626" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden animate-in fade-in duration-500">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Active Catalog</h2>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{products.length} Items Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                  <th className="px-8 py-6">Product</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6 text-right">Stock</th>
                  <th className="px-8 py-6 text-right">Price</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-red-50/20 dark:hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-white/10" referrerPolicy="no-referrer" />
                        <span className="font-black text-slate-900 dark:text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{p.category}</span>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-slate-600 dark:text-slate-400">{p.stock}</td>
                    <td className="px-8 py-6 text-right font-black">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => handleEdit(p)} className="text-red-600 hover:text-red-800 font-black text-xs uppercase mr-4">Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-slate-400 hover:text-red-600 font-black text-xs uppercase">Delist</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden animate-in fade-in duration-500">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Order Fulfillment</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                  <th className="px-8 py-6">Order ID</th>
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Items</th>
                  <th className="px-8 py-6">Total</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {orders.map(o => {
                  const customer = users.find((u: any) => u.id === o.userId);
                  return (
                    <tr key={o.id} className="hover:bg-red-50/20 dark:hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6 font-black text-slate-900 dark:text-white text-xs">{o.id}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white text-sm">{customer?.name || 'Unknown User'}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{customer?.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex -space-x-2">
                          {o.items.slice(0, 3).map((item, idx) => (
                            <img key={idx} src={item.image} alt={item.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" referrerPolicy="no-referrer" />
                          ))}
                          {o.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 border-2 border-white dark:border-slate-900">
                              +{o.items.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-900 dark:text-white">₹{o.total.toLocaleString('en-IN')}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-2">
                          {o.status === 'PENDING' && (
                            <>
                              <button onClick={() => updateOrder(o.id, 'SHIPPED')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Ship</button>
                              <button onClick={() => updateOrder(o.id, 'CANCELLED')} className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Cancel</button>
                            </>
                          )}
                          {o.status === 'SHIPPED' && (
                            <button onClick={() => updateOrder(o.id, 'DELIVERED')} className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all">Deliver</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Promotions & Events</h2>
            <button 
              onClick={() => { setEditingSale(null); setSaleFormData({ title: '', description: '', discountPercentage: 0, startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], image: '', isActive: true, type: 'SALE' }); setShowSaleForm(true); }}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg"
            >
              Add New
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {saleEvents.map(event => (
              <div key={event.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${event.type === 'SALE' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                      {event.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${event.isActive ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
                      {event.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{event.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">{event.description}</p>
                  
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={() => handleEditSale(event)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-600 hover:text-white transition-all">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => deleteSaleEvent(event.id)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-600 hover:text-white transition-all">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSaleForm && (
        <div className="fixed inset-0 z-[900] flex items-start justify-center p-6 bg-red-950/30 backdrop-blur-xl overflow-y-auto pt-24 md:pt-32">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] p-12 shadow-2xl border border-red-50 mb-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{editingSale ? 'Update Promotion' : 'Create Promotion'}</h3>
              <button onClick={() => setShowSaleForm(false)} className="text-slate-400 hover:text-red-600 transition-colors">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Promotion Title</label>
                  <input type="text" placeholder="e.g. Summer Clearance" value={saleFormData.title} onChange={e => setSaleFormData({ ...saleFormData, title: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white" required />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Description</label>
                  <textarea placeholder="Tell the story..." value={saleFormData.description} onChange={e => setSaleFormData({ ...saleFormData, description: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white h-32" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Type</label>
                    <select value={saleFormData.type} onChange={e => setSaleFormData({ ...saleFormData, type: e.target.value as any })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white appearance-none">
                      <option value="SALE">Flash Sale</option>
                      <option value="EVENT">Special Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Discount (%)</label>
                    <input type="number" placeholder="0" value={saleFormData.discountPercentage} onChange={e => setSaleFormData({ ...saleFormData, discountPercentage: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Start Date</label>
                    <input type="date" value={saleFormData.startDate} onChange={e => setSaleFormData({ ...saleFormData, startDate: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">End Date</label>
                    <input type="date" value={saleFormData.endDate} onChange={e => setSaleFormData({ ...saleFormData, endDate: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white" required />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Banner Image (URL)</label>
                  <div className="flex space-x-2">
                    <input type="text" placeholder="https://..." value={saleFormData.image} onChange={e => setSaleFormData({ ...saleFormData, image: e.target.value })} className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white" />
                    <button type="button" onClick={generateRandomSaleImage} className="bg-slate-100 dark:bg-slate-800 px-4 rounded-xl text-slate-500 hover:text-red-600 transition-colors">
                      <i className="fa-solid fa-shuffle"></i>
                    </button>
                  </div>
                </div>

                <div className="aspect-[3/1] bg-slate-50 dark:bg-slate-800 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center relative group">
                  {saleFormData.image ? (
                    <img src={saleFormData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-center p-8">
                      <i className="fa-solid fa-image text-4xl text-slate-300 mb-4 block"></i>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Banner Preview</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <input type="checkbox" checked={saleFormData.isActive} onChange={e => setSaleFormData({ ...saleFormData, isActive: e.target.checked })} className="w-5 h-5 accent-red-600" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Active Promotion</span>
                </div>

                <div className="pt-6 space-y-4">
                  <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-red-700 transition-all active:scale-[0.98]">
                    {editingSale ? 'Update Promotion' : 'Launch Promotion'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 z-[900] flex items-start justify-center p-6 bg-red-950/30 backdrop-blur-xl overflow-y-auto pt-24 md:pt-32">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] p-12 shadow-2xl border border-red-50 mb-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{editingProduct ? 'Update Product' : 'Add Product'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-600 transition-colors">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Product Identity</label>
                  <input type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white" required />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Story & Details</label>
                  <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white h-32" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Price (₹)</label>
                    <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Inventory Count</label>
                    <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white" required />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Classification</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white appearance-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Visual Asset (URL)</label>
                  <div className="flex space-x-2">
                    <input type="text" placeholder="https://images.unsplash.com/..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold text-slate-900 dark:text-white" />
                    <button type="button" onClick={generateRandomImage} className="bg-slate-100 dark:bg-slate-800 px-4 rounded-xl text-slate-500 hover:text-red-600 transition-colors" title="Generate Random Image">
                      <i className="fa-solid fa-shuffle"></i>
                    </button>
                  </div>
                </div>

                <div className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center relative group">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-center p-8">
                      <i className="fa-solid fa-image text-4xl text-slate-300 mb-4 block"></i>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Image Preview</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 space-y-4">
                  <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-red-700 transition-all active:scale-[0.98]">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="w-full text-slate-400 font-black uppercase text-xs tracking-widest hover:text-red-600 transition-colors">
                    Discard Draft
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
