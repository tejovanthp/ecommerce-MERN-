
import React, { useState, useMemo } from 'react';
// Added missing Link import to fix reference error on line 94
import { Link } from 'react-router-dom';
import { useStore } from '../App.tsx';
import ProductCard from '../components/ProductCard.tsx';
import { CATEGORIES } from '../constants.ts';

const Shop: React.FC = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'priceLow' | 'priceHigh' | 'rating'>('match');

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (sortBy === 'priceLow') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'priceHigh') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, selectedCategory, search, sortBy]);

  return (
    <div className="space-y-12 pb-24">
      <div className="bg-red-700 dark:bg-slate-950 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl border border-red-800 dark:border-white/5 transition-all duration-500">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-xl">
               <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full mb-6 border border-white/20">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Catalog Live</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">The Crimson Collection.</h1>
               <p className="text-red-100 dark:text-slate-400 font-medium text-lg leading-relaxed">Curated for those who demand excellence. Explore our premium range with precision search.</p>
            </div>
            <div className="flex-1 max-w-2xl relative group">
               <input 
                 type="text" 
                 placeholder="Search brands, products, keywords..."
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white px-8 py-6 rounded-[2.5rem] font-black text-lg shadow-2xl outline-none focus:ring-8 focus:ring-indigo-500/20 border-none transition-all"
               />
               <i className="fa-solid fa-magnifying-glass absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-hover:text-indigo-500 transition-colors"></i>
            </div>
         </div>
         <i className="fa-solid fa-gem absolute -right-20 -bottom-20 text-[25rem] text-white/5 rotate-12 pointer-events-none"></i>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <aside className="lg:w-80 space-y-12">
          <div>
            <div className="flex items-center space-x-3 mb-8">
               <div className="w-1 h-6 bg-red-600 rounded-full"></div>
               <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Filter By Category</h3>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-between group ${
                  selectedCategory === 'All' ? 'bg-red-600 text-white shadow-xl shadow-red-500/20' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>All Masterpieces</span>
                <i className={`fa-solid fa-arrow-right-long text-[10px] transition-transform ${selectedCategory === 'All' ? 'translate-x-0' : '-translate-x-4 opacity-0'}`}></i>
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-between group ${
                    selectedCategory === cat.name ? 'bg-red-600 text-white shadow-xl shadow-red-500/20' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center">
                    <i className={`fa-solid ${cat.icon} mr-4 opacity-50 text-base`}></i>
                    {cat.name}
                  </div>
                  <i className={`fa-solid fa-arrow-right-long text-[10px] transition-transform ${selectedCategory === cat.name ? 'translate-x-0' : '-translate-x-4 opacity-0'}`}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-8 rounded-[3rem] text-white relative overflow-hidden group border border-white/5">
             <div className="relative z-10">
                <p className="text-red-500 font-black text-[10px] uppercase tracking-widest mb-2">Member Special</p>
                <h4 className="text-2xl font-black mb-4 tracking-tighter">Get 10% Off on Crimson Labels</h4>
                <p className="text-slate-500 text-xs font-medium mb-6">Exclusive for elite members only. Terms apply.</p>
                {/* Fixed: Link component requires an import from 'react-router-dom' */}
                <Link to="/signup" className="inline-block bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Join Club</Link>
             </div>
             <i className="fa-solid fa-crown absolute -right-4 -bottom-4 text-8xl text-white/5 group-hover:rotate-12 transition-transform"></i>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-12 border-b border-slate-100 dark:border-white/5 pb-8">
            <p className="text-slate-500 dark:text-slate-500 font-bold text-sm tracking-widest uppercase">Showing <span className="text-red-600 font-black">{filteredProducts.length}</span> Objects of Desire</p>
            <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
              Sort: 
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-900 dark:text-white ml-2 cursor-pointer border-b-2 border-red-600 pb-1 outline-none"
              >
                <option value="match" className="bg-white dark:bg-slate-900">Best Match</option>
                <option value="priceLow" className="bg-white dark:bg-slate-900">Price: Low to High</option>
                <option value="priceHigh" className="bg-white dark:bg-slate-900">Price: High to Low</option>
                <option value="rating" className="bg-white dark:bg-slate-900">Customer Rating</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white dark:bg-slate-950 rounded-[4rem] border border-dashed border-slate-200 dark:border-white/10 shadow-inner">
               <div className="w-24 h-24 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <i className="fa-solid fa-ghost text-5xl text-red-200 dark:text-red-900"></i>
               </div>
               <p className="text-slate-500 dark:text-slate-400 font-black text-xl mb-2">No masterpieces found.</p>
               <p className="text-slate-400 text-sm">Try adjusting your elite search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
