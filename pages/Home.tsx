
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../App.tsx';
import ProductCard from '../components/ProductCard.tsx';

const Home: React.FC = () => {
  const { products, saleEvents } = useStore();
  const featured = products.slice(0, 4);
  const activeSales = saleEvents.filter(s => s.isActive);

  return (
    <div className="space-y-24 pb-20">
      {/* Dynamic Hero Section */}
      <section className="relative h-[650px] rounded-[3.5rem] overflow-hidden bg-slate-950 text-white shadow-2xl group transition-all duration-700 border border-white/5">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover opacity-30 scale-105 group-hover:scale-100 transition-transform duration-[2000ms]" 
            alt="Red Luxury Lifestyle"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-red-950/70 to-transparent dark:from-black dark:via-red-950/90"></div>
        </div>

        <div className="relative z-10 h-full px-12 md:px-24 flex flex-col justify-center max-w-4xl">
          <div className="inline-flex items-center space-x-3 mb-8">
            <span className="w-16 h-[2px] bg-red-600"></span>
            <span className="text-red-500 font-black uppercase tracking-[0.4em] text-xs">A New Era of Style</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8]">
            Redefine <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300">Your Limits.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300/80 mb-12 leading-relaxed max-w-2xl font-medium">
            Discover a curated collection of bold technology and timeless fashion. Experience India's most vibrant shopping destination.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to="/shop" className="bg-red-600 text-white px-12 py-5 rounded-[1.8rem] font-black text-xl hover:shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:-translate-y-1 transition-all active:scale-95 shadow-2xl">
              Start Shopping
            </Link>
            <Link to="/signup" className="bg-white/10 backdrop-blur-md text-white px-12 py-5 rounded-[1.8rem] font-black text-xl border border-white/20 hover:bg-white/20 transition-all">
              Join Elite
            </Link>
          </div>
        </div>

        <div className="absolute right-12 bottom-12 hidden xl:flex items-center space-x-12">
           <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-center">
              <p className="text-5xl font-black tracking-tighter">10k+</p>
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">Products</p>
           </div>
           <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-center">
              <p className="text-5xl font-black tracking-tighter">₹0</p>
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">Delivery Fee</p>
           </div>
        </div>
      </section>

      {/* Modern Trending Section */}
      <section>
        <div className="flex items-end justify-between mb-16 px-4">
           <div>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Editor's Choice</h2>
             <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Vibrant Picks for You</p>
           </div>
           <Link to="/shop" className="hidden md:flex text-red-600 dark:text-red-400 font-black text-sm uppercase tracking-widest items-center group">
              Explore Full Shop <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-3 transition-transform"></i>
           </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Sales & Events Section */}
      {activeSales.length > 0 && (
        <section className="space-y-12">
          <div className="px-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Exclusive Events</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Limited Time Opportunities</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {activeSales.map(sale => (
              <div key={sale.id} className="relative h-[400px] rounded-[3rem] overflow-hidden group shadow-2xl border border-slate-100 dark:border-white/5">
                <img src={sale.image} alt={sale.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sale.type === 'SALE' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                      {sale.type === 'SALE' ? `${sale.discountPercentage}% OFF` : 'EVENT'}
                    </span>
                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                      Ends {new Date(sale.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-4xl font-black text-white mb-4 tracking-tight">{sale.title}</h3>
                  <p className="text-slate-300 text-lg mb-8 line-clamp-2 max-w-xl">{sale.description}</p>
                  <Link to="/shop" className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all w-fit shadow-xl">
                    Explore Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brand Values Banner */}
      <section className="bg-white dark:bg-slate-900/50 rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-red-500/5 dark:shadow-none border border-slate-100 dark:border-white/5 transition-all duration-300">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-6 text-center md:text-left">
               <div className="w-20 h-20 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner mx-auto md:mx-0">
                  <i className="fa-solid fa-gem"></i>
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Premium Quality</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Handpicked collections that represent the pinnacle of craft and design.</p>
               </div>
            </div>
            <div className="space-y-6 text-center md:text-left">
               <div className="w-20 h-20 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner mx-auto md:mx-0">
                  <i className="fa-solid fa-shield-heart"></i>
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Secure Pay</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Top-tier encryption ensures your financial peace of mind always.</p>
               </div>
            </div>
            <div className="space-y-6 text-center md:text-left">
               <div className="w-20 h-20 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner mx-auto md:mx-0">
                  <i className="fa-solid fa-bolt"></i>
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Hyper Delivery</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Fastest fulfillment network in the country for your favorite tech.</p>
               </div>
            </div>
            <div className="space-y-6 text-center md:text-left">
               <div className="w-20 h-20 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner mx-auto md:mx-0">
                  <i className="fa-solid fa-headset"></i>
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Expert Care</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Dedicated concierge support for a seamless after-purchase experience.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
