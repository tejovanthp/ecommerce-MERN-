
import React, { useState } from 'react';
import { useStore, useAuth } from '../App.tsx';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Order } from '../types.ts';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const { orders, addToCart } = useStore();
  const navigate = useNavigate();
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  if (!user) return <Navigate to="/login" />;

  const userOrders = orders.filter(o => o.userId === user.id);

  const handleReorder = (items: any[]) => {
    items.forEach(item => addToCart(item));
    alert("Items restored to your active bag.");
    navigate('/cart');
  };

  const handleSupport = () => {
    alert("Our premium support concierge is standing by to assist you. Reference your order ID when contacting.");
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { label: 'Confirmed', icon: 'fa-check-double', date: 'Day 1, 09:00 AM' },
      { label: 'Processing', icon: 'fa-microchip', date: 'Day 1, 02:30 PM' },
      { label: 'Shipped', icon: 'fa-box-open', date: 'Day 2, 10:15 AM' },
      { label: 'Delivered', icon: 'fa-house-chimney-check', date: 'Pending' }
    ];

    const statusMap: Record<string, number> = {
      'PENDING': 2, // Confirmed -> Processing
      'SHIPPED': 3, // -> Shipped
      'DELIVERED': 4, // -> Delivered
      'CANCELLED': 0
    };

    const currentIdx = statusMap[status] || 1;
    const progressPercent = (currentIdx / steps.length) * 100;

    return { steps, current: currentIdx, progressPercent };
  };

  if (trackingOrder) {
    const { steps, current, progressPercent } = getTrackingSteps(trackingOrder.status);
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <button 
          onClick={() => setTrackingOrder(null)}
          className="flex items-center text-slate-400 hover:text-red-600 font-black text-xs uppercase tracking-widest mb-12 transition-colors group"
        >
          <i className="fa-solid fa-arrow-left mr-3 group-hover:-translate-x-2 transition-transform"></i> 
          Back to Order Archives
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-red-50 dark:border-white/5 shadow-2xl overflow-hidden">
          <div className="bg-red-700 p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
               <i className="fa-solid fa-location-crosshairs text-[10rem]"></i>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div>
                  <h1 className="text-4xl font-black tracking-tighter mb-2">Logistics Console</h1>
                  <p className="text-red-100/80 font-bold text-sm uppercase tracking-widest">Order Ref: #{trackingOrder.id.split('-')[1]}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-100 mb-1">Estimated Arrival</p>
                  <p className="text-xl font-black">Within 48 Hours</p>
               </div>
            </div>
          </div>

          <div className="p-12 space-y-16">
             {/* Dynamic Horizontal Progress Bar with Checkpoints */}
             <div className="space-y-10">
                <div className="flex justify-between items-center mb-2 px-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment Progress</p>
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{Math.round(progressPercent)}% Fulfilled</p>
                </div>
                
                <div className="relative pt-6">
                  {/* The Track */}
                  <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full -translate-y-1/2"></div>
                  
                  {/* The Progress Fill */}
                  <div 
                    className="absolute top-1/2 left-0 h-1.5 bg-red-600 rounded-full -translate-y-1/2 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  ></div>

                  {/* Checkpoint Markers */}
                  <div className="relative flex justify-between">
                    {steps.map((step, idx) => {
                      const active = idx < current;
                      const isCurrent = idx === current - 1;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-lg transition-all duration-500 z-10 ${
                            active ? 'bg-red-600 text-white border-2 border-white dark:border-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 border-2 border-slate-100 dark:border-white/5'
                          } ${isCurrent && trackingOrder.status !== 'DELIVERED' ? 'animate-pulse ring-4 ring-red-600/20' : ''}`}>
                            <i className={`fa-solid ${step.icon}`}></i>
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest mt-4 ${active ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
             </div>

             <div className="relative">
                {/* Vertical Visual Line for Details */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                <div 
                  className="absolute left-6 top-0 w-1 bg-red-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                  style={{ height: `${((current - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                <div className="space-y-12 relative z-10">
                   {steps.map((step, idx) => {
                     const isCompleted = idx < current;
                     const isCurrent = idx === current - 1;
                     return (
                       <div key={step.label} className={`flex items-start space-x-10 transition-all duration-500 ${!isCompleted && !isCurrent ? 'opacity-30' : 'opacity-100'}`}>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-xl transition-all duration-500 ${
                            isCompleted ? 'bg-red-600 text-white' : 
                            isCurrent ? 'bg-white dark:bg-slate-800 text-red-600 border-2 border-red-600 ring-4 ring-red-600/10' : 
                            'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                             <i className={`fa-solid ${step.icon} ${isCurrent && trackingOrder.status !== 'DELIVERED' ? 'animate-bounce' : ''}`}></i>
                          </div>
                          <div>
                             <h4 className={`text-xl font-black tracking-tight ${isCurrent ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                               {step.label}
                             </h4>
                             <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{isCompleted ? step.date : 'Estimated Stage'}</p>
                             {isCurrent && trackingOrder.status !== 'DELIVERED' && (
                               <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-white/5 animate-in slide-in-from-left-2">
                                  <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">Live Feed</p>
                                  <p className="text-slate-700 dark:text-slate-300 text-sm font-medium italic">"The order is currently at our central hub processing facility. Scanning and safety verification are underway."</p>
                               </div>
                             )}
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-100 dark:border-white/5">
             <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                   <i className="fa-solid fa-truck-ramp-box text-indigo-600 text-xl"></i>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrier</p>
                   <p className="font-black text-slate-900 dark:text-white">Crimson Express Premium Logistics</p>
                </div>
             </div>
             <button 
               onClick={handleSupport}
               className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95"
             >
               Contact Dispatcher
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40">
             <i className="fa-solid fa-box-archive text-3xl"></i>
          </div>
          <div>
             <h1 className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">Your Orders.</h1>
             <p className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mt-3">Elite Purchase History & Logistics</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-6 py-3 rounded-2xl flex items-center space-x-3 shadow-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400 tracking-widest">{userOrders.length} Completed Acquisitions</span>
           </div>
        </div>
      </div>

      {userOrders.length > 0 ? (
        <div className="space-y-12">
          {userOrders.map(order => {
            const { steps, current, progressPercent } = getTrackingSteps(order.status);
            return (
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
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Hub Location</p>
                        <p className="text-sm font-black text-slate-700 dark:text-slate-300">Mumbai Central - Crimson Hub</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Reference Code</p>
                      <div className="bg-slate-950 text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border border-white/10 group-hover:bg-red-600 transition-colors">
                        #{order.id.split('-')[1]}
                      </div>
                   </div>
                </div>

                <div className="p-10 space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center space-x-4">
                       <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] ${order.status === 'DELIVERED' ? 'bg-red-500' : 'bg-red-600 animate-pulse'}`}></div>
                       <h3 className="font-black text-slate-950 dark:text-white text-2xl tracking-tighter">
                         {order.status === 'DELIVERED' ? 'Deployment Successful' : 'Logistics in Transit'}
                       </h3>
                    </div>

                    {/* Integrated dynamic progress indicator */}
                    <div className="flex-1 max-w-lg space-y-4">
                      <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-red-600 transition-all duration-1000 ease-out ${order.status === 'DELIVERED' ? 'bg-red-600' : ''}`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                         {steps.map((s, idx) => (
                           <div key={idx} className="flex flex-col items-center">
                              <div className={`w-2 h-2 rounded-full mb-2 transition-colors duration-500 ${idx < current ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                              <span className={`text-[8px] font-black uppercase tracking-widest ${idx < current ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s.label}</span>
                           </div>
                         ))}
                      </div>
                    </div>
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
                      Updated 5 Minutes Ago
                   </div>
                   <button 
                    onClick={() => setTrackingOrder(order)}
                    className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:text-red-600 flex items-center group"
                   >
                      Track Console 
                      <i className="fa-solid fa-location-arrow ml-3 group-hover:translate-x-2 transition-transform"></i>
                   </button>
                </div>
              </div>
            );
          })}
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
