
import React from 'react';
import { useStore, useAuth } from '../App.tsx';
import { Navigate, Link, useNavigate } from 'react-router-dom';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const { orders, addToCart } = useStore();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" />;

  const userOrders = orders.filter(o => o.userId === user.id);

  const handleReorder = (items: any[]) => {
    items.forEach(item => addToCart(item));
    alert("Items restored to your active bag.");
    navigate('/cart');
  };

  const handleSupport = () => {
    alert("Crimson Pro AI Concierge is standing by. Check the bottom right widget.");
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-red-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-red-500/40">
             <i className="fa-solid fa-box-archive text-3xl"></i>
          </div>
          <div>
             <h1 className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">Your Orders.</h1>
             <p className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mt-3">Elite Purchase History & Logistics</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-6 py-3 rounded-2xl flex items-center space-x-3 shadow-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400 tracking-widest">{userOrders.length} Completed Orders</span>
           </div>
        </div>
      </div>

      {userOrders.length > 0 ? (
        <div className="space-y-12">
          {userOrders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-red-500/5 overflow-hidden transition-all duration-300 group">
              <div className="bg-slate-50/50 dark:bg-slate-800/20 px-10 py-8 flex flex-wrap justify-between items-center gap-8 border-b border-slate-50 dark:border-white/5">
                 <div className="flex items-center space-x-12">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Order Finalized</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Investment Total</p>
                      <p className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-tighter">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Logistics Center</p>
                      <p className="text-sm font-black text-slate-700 dark:text-slate-300">Mumbai Hub - 40001</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Elite Reference</p>
                    <div className="bg-slate-950 text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border border-white/10 group-hover:bg-red-600 transition-colors">
                      #{order.id.split('-')[1]}
                    </div>
                 </div>
              </div>

              <div className="p-10">
                <div className="flex items-center space-x-4 mb-10">
                   <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                   <h3 className="font-black text-slate-950 dark:text-white text-2xl tracking-tighter">Hyper Logistics in Transit</h3>
                </div>

                <div className="space-y-8">
                  {order.items.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 group/item">
                      <div className="flex items-start space-x-8">
                        <img src={item.image} className="w-28 h-28 rounded-[2rem] object-cover border border-slate-100 dark:border-white/5 shadow-xl group-hover/item:scale-105 transition-transform" />
                        <div className="space-y-1">
                          <Link to={`/product/${item.id}`} className="text-xl font-black text-slate-950 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors tracking-tight">{item.name}</Link>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.category}</p>
                          <p className="text-red-600/80 dark:text-red-400/80 text-xs font-bold mt-2">Quantity: {item.quantity} Units</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 self-end sm:self-center">
                         <button 
                          onClick={() => handleReorder([item])}
                          className="bg-red-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-200 dark:shadow-none hover:bg-red-700 transition-all active:scale-95"
                         >
                          Re-Order
                         </button>
                         <button 
                          onClick={handleSupport}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                         >
                          Support
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50/30 dark:bg-red-950/20 px-10 py-6 flex flex-wrap justify-between items-center gap-6">
                 <div className="flex items-center text-[10px] font-black text-red-600/60 dark:text-red-400/60 uppercase tracking-[0.3em]">
                    <i className="fa-solid fa-clock-rotate-left mr-3"></i>
                    Updates arriving in 24 hours
                 </div>
                 <button className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:text-red-600 flex items-center group">
                    Live Tracking Console 
                    <i className="fa-solid fa-location-arrow ml-3 group-hover:translate-x-2 transition-transform"></i>
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-24 rounded-[4rem] border border-red-50 dark:border-white/5 text-center shadow-[0_40px_100px_rgba(220,38,38,0.05)] transition-all duration-300">
          <div className="w-32 h-32 bg-red-50 dark:bg-red-950/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
            <i className="fa-solid fa-box-open text-6xl text-red-200 dark:text-red-900"></i>
          </div>
          <h2 className="text-4xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter">Your Bag is Empty.</h2>
          <p className="text-slate-400 dark:text-slate-500 mb-12 font-medium text-lg leading-relaxed max-w-md mx-auto">When you acquire our elite pieces, their deployment status will manifest right here.</p>
          <Link to="/shop" className="inline-block bg-red-600 text-white px-14 py-5 rounded-[2rem] font-black text-lg hover:shadow-2xl hover:bg-red-700 transition-all active:scale-95">
            Discover Collection
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
