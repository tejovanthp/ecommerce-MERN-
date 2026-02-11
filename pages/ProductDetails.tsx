
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../App.tsx';
import { generateProductDescription } from '../services/geminiService.ts';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      handleGenerateAI();
    }
  }, [product]);

  const handleGenerateAI = async () => {
    if (!product) return;
    setAiDescription(null);
    setLoadingAi(true);
    const desc = await generateProductDescription(product.name, product.category);
    setAiDescription(desc);
    setLoadingAi(false);
  };

  const handleInstantBuy = () => {
    if (!product) return;
    addToCart(product);
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="text-center py-40">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-8">Product Discontinued.</h2>
        <button onClick={() => navigate('/shop')} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div className="sticky top-28 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-2xl transition-all duration-500 overflow-hidden relative group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto rounded-[3rem] object-cover aspect-square shadow-2xl transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-square bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 p-2 cursor-pointer hover:border-red-600 transition-all">
                  <img src={product.image} className="w-full h-full object-cover rounded-xl opacity-50 hover:opacity-100 transition-opacity" />
               </div>
             ))}
          </div>
        </div>

        <div className="flex flex-col space-y-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-red-100 dark:border-white/5">{product.category}</span>
              <div className="flex items-center text-green-600 dark:text-green-400 font-black text-[10px] uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                In Stock & Ready
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-950 dark:text-white leading-[0.85] tracking-tighter">{product.name}</h1>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-yellow-400 text-yellow-950 px-4 py-1.5 rounded-xl font-black text-sm">
                <span className="mr-2">{product.rating}</span>
                <i className="fa-solid fa-star text-xs"></i>
              </div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">Global Elite Reviews (1,248)</p>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-6xl font-black text-slate-950 dark:text-white tracking-tighter">₹{product.price.toLocaleString('en-IN')}</p>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase mt-2 tracking-widest">Taxes and Duties Included</p>
          </div>

          {/* Crimson AI Insight Box */}
          <div className="p-10 bg-red-600 dark:bg-red-800 rounded-[3.5rem] shadow-[0_40px_100px_rgba(220,38,38,0.2)] relative overflow-hidden group border border-white/10">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform text-white">
               <i className="fa-solid fa-wand-magic-sparkles text-8xl"></i>
            </div>
            <div className="relative z-10">
               <h3 className="text-white font-black mb-4 flex items-center text-xs uppercase tracking-[0.3em]">
                 <i className="fa-solid fa-robot mr-3 text-red-100"></i>
                 Crimson AI Insight
               </h3>
               {loadingAi ? (
                 <div className="flex items-center space-x-4 text-red-100">
                   <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                   <span className="font-black text-sm uppercase tracking-widest animate-pulse">Synchronizing Data...</span>
                 </div>
               ) : (
                 <p className="text-white text-lg leading-relaxed font-bold italic">
                   "{aiDescription || "Awaiting neural analysis of product performance..."}"
                 </p>
               )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
               <h3 className="font-black text-sm text-slate-400 dark:text-slate-500 uppercase tracking-widest">Masterpiece Overview</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed font-medium">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <button 
              onClick={() => addToCart(product)}
              className="bg-red-600 text-white px-12 py-6 rounded-[2.2rem] font-black text-2xl hover:bg-red-700 transition-all transform active:scale-95 shadow-2xl shadow-red-500/30 dark:shadow-none"
            >
              Add To Bag
            </button>
            <button 
              onClick={handleInstantBuy}
              className="bg-slate-950 dark:bg-slate-800 text-white px-12 py-6 rounded-[2.2rem] font-black text-2xl hover:bg-black transition-all transform active:scale-95 border border-white/5"
            >
              Instant Buy
            </button>
          </div>

          <div className="pt-12 mt-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group border-r border-slate-100 dark:border-white/5 last:border-none pr-4">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
                <i className="fa-solid fa-truck-fast text-lg"></i>
              </div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] block">Hyper Delivery</span>
            </div>
            <div className="text-center group border-r border-slate-100 dark:border-white/5 last:border-none pr-4">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
                <i className="fa-solid fa-arrow-rotate-left text-lg"></i>
              </div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] block">7 Day Elite Return</span>
            </div>
            <div className="text-center group border-r border-slate-100 dark:border-white/5 last:border-none pr-4">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
                <i className="fa-solid fa-shield-check text-lg"></i>
              </div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] block">Authentic Lab</span>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
                <i className="fa-solid fa-medal text-lg"></i>
              </div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] block">Full Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
