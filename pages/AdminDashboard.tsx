
import React, { useState, useEffect } from 'react';
import { useStore } from '../App.tsx';
import { Product } from '../types.ts';
import { getAdminInsights } from '../services/geminiService.ts';

const AdminDashboard: React.FC = () => {
  const { products, orders, addProduct, updateProduct, deleteProduct, isOnline } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400',
    rating: 4.5
  });

  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  useEffect(() => {
    fetchInsights();
    checkConnectionDetails();
  }, [isOnline, products.length, orders.length]); // Re-fetch if key stats change

  const checkConnectionDetails = async () => {
    if (!isOnline) {
      try {
        const res = await fetch("/api/health");
        if (!res.ok) setConnectionError(`Status Code: ${res.status}`);
      } catch (e) {
        setConnectionError("Connecting to cloud gateway...");
      }
    } else {
      setConnectionError(null);
    }
  };

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const result = await getAdminInsights(totalSales, orders.length, lowStockCount);
    setInsights(result);
    setLoadingInsights(false);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formData } as Product);
    } else {
      const newProduct: Product = {
        ...formData,
        id: 'p' + Math.random().toString(36).substr(2, 6),
      } as Product;
      addProduct(newProduct);
    }
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0, category: 'Electronics', stock: 0, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400', rating: 4.5 });
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Master Dashboard</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Inventory Console.</h1>
          <p className="text-slate-400 font-bold mt-2">Oversee global operations and catalog performance.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-2xl shadow-red-500/20 flex items-center active:scale-95"
        >
          <i className="fa-solid fa-plus-circle mr-3"></i> Add New Listing
        </button>
      </div>

      {/* Crimson AI Executive Summary Section */}
      <section className="bg-red-600 dark:bg-red-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-red-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:rotate-0 transition-transform text-white">
           <i className="fa-solid fa-wand-magic-sparkles text-[12rem]"></i>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <i className="fa-solid fa-robot text-xl"></i>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-100">Crimson AI Intelligence</h3>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Market & Inventory Analysis</p>
              </div>
            </div>
            <button 
              onClick={fetchInsights}
              disabled={loadingInsights}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all disabled:opacity-50"
            >
              {loadingInsights ? <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> : <i className="fa-solid fa-arrows-rotate mr-2"></i>}
              Refresh Summary
            </button>
          </div>

          <div className="max-w-4xl">
            {loadingInsights ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
                <div className="h-4 bg-white/20 rounded w-2/3"></div>
              </div>
            ) : (
              <p className="text-2xl md:text-3xl font-bold leading-tight tracking-tight italic">
                "{insights || "Preparing executive brief for the latest session data..."}"
              </p>
            )}
          </div>
          
          <div className="mt-8 flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-red-100/60 text-[10px] font-black uppercase tracking-widest">
              <i className="fa-solid fa-check-double text-green-400"></i>
              <span>Real-time Sync</span>
            </div>
            <div className="flex items-center space-x-2 text-red-100/60 text-[10px] font-black uppercase tracking-widest">
              <i className="fa-solid fa-brain"></i>
              <span>Gemini Pro Core</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-red-50 dark:border-white/5 shadow-xl shadow-red-500/5">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
             <i className="fa-solid fa-indian-rupee-sign text-xl"></i>
          </div>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Total Sales</span>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">₹{totalSales.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-red-50 dark:border-white/5 shadow-xl shadow-red-500/5">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-6">
             <i className="fa-solid fa-box-open text-xl"></i>
          </div>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Active Orders</span>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{orders.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-red-50 dark:border-white/5 shadow-xl shadow-red-500/5">
          <div className={`w-12 h-12 ${isOnline ? 'bg-green-50 dark:bg-green-950/30 text-green-600' : 'bg-red-50 dark:bg-red-950/30 text-red-600'} rounded-xl flex items-center justify-center mb-6`}>
             <i className={`fa-solid ${isOnline ? 'fa-shield-check' : 'fa-triangle-exclamation'} text-xl`}></i>
          </div>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">System Health</span>
          <p className={`text-4xl font-black tracking-tighter ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {isOnline ? 'SECURE' : 'OFFLINE'}
          </p>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">
            {isOnline ? 'Atlas Cloud Gateway Active' : connectionError || 'Reconnecting...'}
          </p>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-red-50 dark:border-white/5 shadow-2xl shadow-red-500/5 overflow-hidden">
        <div className="p-8 border-b border-red-50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
          <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Active Catalog</h2>
          <span className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{products.length} Units</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-red-50 dark:border-white/5">
                <th className="px-8 py-6">Product</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6 text-right">Price</th>
                <th className="px-8 py-6 text-center">Stock</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50 dark:divide-white/5">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-red-50/20 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <img src={p.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-lg leading-tight">{p.name}</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-0.5 uppercase tracking-tighter">SKU: {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{p.category}</span>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-slate-900 dark:text-white text-lg">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      p.stock < 10 ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400' : 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400'
                    }`}>
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-4">
                      <button onClick={() => handleEdit(p)} className="text-red-600 hover:text-red-800 font-black text-xs uppercase tracking-widest transition-colors">Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-slate-400 hover:text-red-600 font-black text-xs uppercase tracking-widest transition-colors">Delist</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-red-950/30 backdrop-blur-xl">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 max-h-[90vh] overflow-y-auto custom-scrollbar border border-red-50 dark:border-white/5">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white">
                    <i className={`fa-solid ${editingProduct ? 'fa-pen-to-square' : 'fa-plus'}`}></i>
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{editingProduct ? 'Update Item' : 'Add Masterpiece'}</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-600 flex items-center justify-center transition-all">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:border-red-600 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:border-red-600 transition-all font-bold cursor-pointer"
                  >
                    <option>Electronics</option>
                    <option>Mobiles</option>
                    <option>Fashion</option>
                    <option>Home</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-transparent rounded-2xl py-4 px-6 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Stock Level</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-transparent rounded-2xl py-4 px-6 outline-none font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Product Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-transparent rounded-2xl py-4 px-6 outline-none font-bold resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-500/20 active:scale-[0.98]"
              >
                {editingProduct ? 'Commit Changes' : 'Publish to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
