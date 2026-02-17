
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, useAuth } from '../App.tsx';

type Step = 'shipping' | 'payment' | 'processing' | 'success';
type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';

const Checkout: React.FC = () => {
  const { cart, placeOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('shipping');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [processingStatus, setProcessingStatus] = useState('Initializing secure tunnel...');
  const [progress, setProgress] = useState(0);
  const [orderId, setOrderId] = useState('');

  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [shippingData, setShippingData] = useState({ address: '', city: '', zip: '', phone: '' });

  const [cartSnapshot, setCartSnapshot] = useState<any[]>([]);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal > 1999 ? subtotal : subtotal + 99;

  useEffect(() => {
    if (cart.length === 0 && step !== 'success') {
      navigate('/shop');
    }
  }, [cart, step, navigate]);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCartSnapshot([...cart]);
    setStep('processing');
    startProcessingSimulation();
  };

  const startProcessingSimulation = () => {
    const isCOD = method === 'cod';
    const statuses = isCOD ? [
      { msg: 'Verifying serviceability...', time: 800 },
      { msg: 'Confirming address availability...', time: 1600 },
      { msg: 'Securing order allocation...', time: 2400 },
      { msg: 'Scheduling priority dispatch...', time: 3200 },
      { msg: 'Finalizing Crimson Order...', time: 4000 }
    ] : [
      { msg: 'Verifying Crimson credentials...', time: 800 },
      { msg: 'Connecting to Bank Gateway...', time: 1600 },
      { msg: 'Securing transaction layer...', time: 2400 },
      { msg: 'Validating payment tokens...', time: 3200 },
      { msg: 'Finalizing Crimson Order...', time: 4000 }
    ];

    statuses.forEach((s, i) => {
      setTimeout(() => {
        setProcessingStatus(s.msg);
        setProgress(((i + 1) / statuses.length) * 100);
        if (i === statuses.length - 1) {
          setTimeout(async () => {
            const generatedId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            setOrderId(generatedId);
            // This triggers the cloud save and order state update
            await placeOrder({ id: generatedId });
            setStep('success');
          }, 1000);
        }
      }, s.time);
    });
  };

  if (step === 'processing') {
    return (
      <div className="max-w-xl mx-auto py-32 text-center space-y-12">
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 border-4 border-red-600/20 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-red-600 rounded-full transition-all duration-500 ease-out"
            style={{ 
              clipPath: `polygon(50% 50%, -50% -50%, ${progress > 25 ? '150% -50%' : progress * 4 + '% -50%'}, ${progress > 50 ? '150% 150%' : '150% -50%'}, ${progress > 75 ? '-50% 150%' : '150% 150%'}, -50% -50%)`,
              transform: 'rotate(-90deg)'
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <i className={`fa-solid ${method === 'cod' ? 'fa-truck-ramp-box' : 'fa-shield-halved'} text-5xl text-red-600 animate-pulse`}></i>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{processingStatus}</h2>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
            <div 
              className="bg-red-600 h-full transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40 transform rotate-6">
            <i className="fa-solid fa-check text-4xl"></i>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Order Confirmed.</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              Reference ID: <span className="text-red-600 font-black">#{orderId.split('-')[1]}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-red-500/5 space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight border-b border-slate-50 dark:border-white/5 pb-4">Deployment Summary</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartSnapshot.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img src={item.image} className="w-16 h-16 rounded-2xl object-cover border border-slate-50 dark:border-white/5" alt={item.name} />
                  <div className="flex-grow">
                    <p className="font-black text-sm text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-sm text-slate-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-50 dark:border-white/5 space-y-2">
              <div className="flex justify-between items-end pt-2">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Total Investment</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <h4 className="font-black text-slate-900 dark:text-white tracking-tight">Shipping To</h4>
              </div>
              <div className="space-y-1">
                <p className="font-black text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{shippingData.address}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{shippingData.city}, {shippingData.zip}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <i className={`fa-solid ${method === 'card' ? 'fa-credit-card' : method === 'upi' ? 'fa-bolt' : method === 'cod' ? 'fa-hand-holding-dollar' : 'fa-building-columns'}`}></i>
                </div>
                <h4 className="font-black text-slate-900 dark:text-white tracking-tight">Payment via</h4>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">
                  {method === 'card' ? 'Vault Credit Card' : method === 'upi' ? 'Instant UPI' : method === 'cod' ? 'Cash on Delivery' : 'Net Banking'}
                </p>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Confirmed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
          <button onClick={() => navigate('/orders')} className="bg-red-600 text-white px-12 py-5 rounded-3xl font-black text-lg hover:bg-red-700 transition-all shadow-xl active:scale-95">Track Deployment</button>
          <button onClick={() => navigate('/shop')} className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-12 py-5 rounded-3xl font-black text-lg hover:bg-slate-200 transition-all active:scale-95">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">
      <div className="lg:col-span-7 space-y-12">
        <div className="flex items-center space-x-6">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step === 'shipping' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-green-500 text-white'}`}>
             {step === 'shipping' ? '1' : <i className="fa-solid fa-check"></i>}
           </div>
           <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Shipping Destination</h2>
        </div>

        {step === 'shipping' ? (
          <form onSubmit={(e) => { e.preventDefault(); setStep('payment'); }} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-red-50 dark:border-white/5 shadow-2xl space-y-8 animate-in slide-in-from-left-5">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Delivery Address</label>
                <input 
                  type="text" required placeholder="Street name, apartment, area..."
                  value={shippingData.address} onChange={e => setShippingData({...shippingData, address: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4 outline-none font-bold transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">City</label>
                  <input type="text" required placeholder="Bangalore" value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4 outline-none font-bold transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Postal Zip Code</label>
                  <input type="text" required placeholder="560001" value={shippingData.zip} onChange={e => setShippingData({...shippingData, zip: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4 outline-none font-bold transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mobile Number</label>
                <input type="tel" required placeholder="+91 99999 00000" value={shippingData.phone} onChange={e => setShippingData({...shippingData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4 outline-none font-bold transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-red-700 transition-all shadow-2xl">Continue to Payment</button>
          </form>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 flex justify-between items-center opacity-80">
            <div>
              <p className="text-slate-900 dark:text-white font-black">{shippingData.address}</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{shippingData.city}, {shippingData.zip}</p>
            </div>
            <button onClick={() => setStep('shipping')} className="text-red-600 font-black text-xs uppercase tracking-widest underline">Change</button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-red-500/20">2</div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Payment Strategy</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['card', 'upi', 'netbanking', 'cod'] as PaymentMethod[]).map(m => (
                <button 
                  key={m} onClick={() => setMethod(m)}
                  className={`flex flex-col items-center p-6 rounded-[2rem] border-2 transition-all space-y-3 ${
                    method === m ? 'border-red-600 bg-red-50/50 dark:bg-red-900/10 shadow-xl' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 text-slate-400'
                  }`}
                >
                  <i className={`fa-solid ${
                    m === 'card' ? 'fa-credit-card' : 
                    m === 'upi' ? 'fa-bolt' : 
                    m === 'netbanking' ? 'fa-building-columns' : 
                    'fa-hand-holding-dollar'
                  } text-xl ${method === m ? 'text-red-600' : ''}`}></i>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${method === m ? 'text-red-900 dark:text-white' : ''}`}>
                    {m === 'cod' ? 'Cash on Delivery' : m === 'netbanking' ? 'Net Banking' : m.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            {method === 'card' && (
              <form onSubmit={handleStartPayment} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-red-50 dark:border-white/5 shadow-2xl shadow-red-500/5 space-y-10">
                <div className="flex items-center space-x-6 pb-6 border-b border-slate-100 dark:border-white/5">
                   <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                      <i className="fa-solid fa-credit-card"></i>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Vault Credit Card</h3>
                      <p className="text-slate-500 text-sm font-medium">Encrypted payment via global Mastercard/Visa network.</p>
                   </div>
                </div>
                
                <div className="relative h-64 bg-gradient-to-br from-slate-900 to-black rounded-[2.5rem] p-10 text-white overflow-hidden shadow-2xl border border-white/10 group">
                  <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                    <i className="fa-solid fa-cart-shopping text-[10rem]"></i>
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-inner"></div>
                      <i className="fa-brands fa-cc-visa text-5xl opacity-80"></i>
                    </div>
                    <div className="space-y-6">
                      <p className="text-3xl font-black tracking-[0.2em]">{cardData.number || '•••• •••• •••• ••••'}</p>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Card Holder</p>
                          <p className="font-black tracking-widest uppercase">{cardData.name || 'CRIMSON ELITE'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Card Number</label>
                    <input type="text" required placeholder="4242 4242 4242 4242" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4 outline-none font-bold transition-all text-xl tracking-widest" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Expiry Date</label>
                    <input type="text" required placeholder="MM/YY" value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value.replace(/\D/g, '').replace(/(.{2})/, '$1/').slice(0, 5)})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4 outline-none font-bold transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">CVC Security Code</label>
                    <input type="password" required placeholder="•••" maxLength={3} value={cardData.cvc} onChange={e => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '')})} className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4 outline-none font-bold transition-all" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-500/20 flex items-center justify-center">
                  <i className="fa-solid fa-lock mr-3"></i> Authorize ₹{total.toLocaleString('en-IN')}
                </button>
              </form>
            )}

            {method === 'upi' && (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-red-50 dark:border-white/5 shadow-2xl space-y-8 animate-in zoom-in-95">
                 <div className="flex items-center space-x-6 pb-6 border-b border-slate-100 dark:border-white/5">
                   <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                      <i className="fa-solid fa-bolt"></i>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Instant UPI</h3>
                      <p className="text-slate-500 text-sm font-medium">Real-time settlement via PhonePe, GPay, or Paytm.</p>
                   </div>
                </div>
                <div className="w-48 h-48 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] mx-auto flex items-center justify-center p-8 relative overflow-hidden group shadow-inner">
                    <i className="fa-solid fa-qrcode text-9xl opacity-10 group-hover:scale-110 transition-transform"></i>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                       <i className="fa-solid fa-bolt text-red-600 text-5xl mb-2 animate-pulse"></i>
                       <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Scan for UPI</p>
                    </div>
                 </div>
                 <div className="relative max-w-sm mx-auto">
                    <input type="text" placeholder="username@bank" className="w-full bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-red-600 transition-all text-center" />
                 </div>
                 <button onClick={handleStartPayment} className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-red-700 transition-all shadow-xl">Verify & Pay</button>
              </div>
            )}

            {method === 'netbanking' && (
               <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-red-50 dark:border-white/5 shadow-2xl space-y-10 animate-in zoom-in-95">
                 <div className="flex items-center space-x-6 pb-6 border-b border-slate-100 dark:border-white/5">
                   <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                      <i className="fa-solid fa-building-columns"></i>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Elite Net Banking</h3>
                      <p className="text-slate-500 text-sm font-medium">Direct institutional transfer from your preferred bank.</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                   {['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI', 'Kotak', 'Others'].map(bank => (
                     <button key={bank} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-red-600 transition-all text-center group">
                        <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg mx-auto mb-3 flex items-center justify-center text-slate-400 group-hover:text-red-600 shadow-sm">
                           <i className="fa-solid fa-building-columns"></i>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{bank}</span>
                     </button>
                   ))}
                </div>
                <button onClick={handleStartPayment} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-red-700 transition-all shadow-2xl flex items-center justify-center">
                  <i className="fa-solid fa-shield-check mr-3"></i> Confirm Institutional Transfer
                </button>
               </div>
            )}

            {method === 'cod' && (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-red-50 dark:border-white/5 shadow-2xl space-y-8 animate-in zoom-in-95">
                <div className="flex items-center space-x-6 pb-6 border-b border-slate-100 dark:border-white/5">
                   <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                      <i className="fa-solid fa-hand-holding-dollar"></i>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Pay on Arrival</h3>
                      <p className="text-slate-500 text-sm font-medium">Verify your details to finalize the deployment.</p>
                   </div>
                </div>
                <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-white/5">
                   <ul className="space-y-4">
                      <li className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                         <i className="fa-solid fa-circle-check text-green-500"></i>
                         <span className="text-sm font-bold">Pay ₹{total.toLocaleString('en-IN')} only when you receive items.</span>
                      </li>
                      <li className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                         <i className="fa-solid fa-circle-check text-green-500"></i>
                         <span className="text-sm font-bold">Crimson quality check guaranteed before payment.</span>
                      </li>
                   </ul>
                </div>
                <button onClick={handleStartPayment} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-red-700 transition-all shadow-2xl flex items-center justify-center">
                  <i className="fa-solid fa-paper-plane mr-3"></i> Confirm Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="lg:col-span-5">
        <div className="bg-red-700 dark:bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl sticky top-28 border border-red-800 dark:border-white/5">
           <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
              <h3 className="text-2xl font-black tracking-tighter">Your Bag</h3>
              <span className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-white/10">{cart.length} Elite Items</span>
           </div>

           <div className="space-y-6 max-h-[350px] overflow-y-auto custom-scrollbar pr-4 mb-10">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-6">
                  <img src={item.image} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
                  <div className="flex-grow">
                    <p className="font-black text-lg leading-tight line-clamp-1">{item.name}</p>
                    <p className="text-red-200/60 text-[10px] font-black uppercase mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
           </div>

           <div className="space-y-6 pt-6 border-t border-white/10">
              <div className="pt-6 flex justify-between items-end">
                 <div>
                    <p className="text-red-300 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Total Investment</p>
                    <p className="text-5xl font-black text-white tracking-tighter mt-1">₹{total.toLocaleString('en-IN')}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
