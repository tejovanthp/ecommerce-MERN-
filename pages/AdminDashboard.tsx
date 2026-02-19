
import React, { useState } from 'react';
import { useStore } from '../App.tsx';
import { Product } from '../types.ts';

const AdminDashboard: React.FC = () => {
  const { products, orders, addProduct, updateProduct, deleteProduct, isOnline, diagnostics } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400',
    rating: 4.5
  });

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

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
      addProduct({ ...formData, id: 'p' + Math.random().toString(36).substr(2, 6) } as Product);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Master Dashboard</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Inventory Console.</h1>
        </div>
        <button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-2xl active:scale-95">
          <i className="fa-solid fa-plus-circle mr-3"></i> Add New Listing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Sales Stat */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-red-50 dark:border-white/5 shadow-xl">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Total Sales</span>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">₹{totalSales.toLocaleString('en-IN')}</p>
        </div>
        
        {/* System Health with Diagnostics */}
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
          
          {!isOnline && diagnostics && (
            <div className="space-y-3 pt-4 border-t border-red-500/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Connection Doctor:</p>
              {!diagnostics.hasEnv && <p className="text-xs text-red-500 font-bold">• MONGO_URI is missing in Vercel settings.</p>}
              {diagnostics.hasEnv && <p className="text-xs text-red-500 font-bold">• URI detected but Atlas is timing out.</p>}
              <p className="text-[9px] text-slate-500 leading-tight">1. Go to Atlas &rarr; Network Access &rarr; Add IP &rarr; 0.0.0.0/0<br/>2. In Vercel, ensure MONGO_URI password has no &lt; &gt; brackets.</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-red-50 dark:border-white/5 shadow-xl">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Cloud Catalog</span>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{products.length} Units</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-red-50 dark:border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-red-50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Active Catalog</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-red-50 dark:border-white/5">
                <th className="px-8 py-6">Product</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6 text-right">Price</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50 dark:divide-white/5">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-red-50/20 dark:hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-900 dark:text-white">{p.name}</td>
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{p.category}</span>
                  </td>
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

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-red-950/30 backdrop-blur-xl">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl border border-red-50">
            <h3 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">{editingProduct ? 'Update Item' : 'Add Masterpiece'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold" required />
              <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold" required />
                <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-none outline-none font-bold" required />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl">{editingProduct ? 'Commit Changes' : 'Publish Catalog'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="w-full text-slate-400 font-black uppercase text-xs">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
