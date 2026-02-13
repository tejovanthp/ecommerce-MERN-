
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-white mt-24 pt-20 pb-12 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black tracking-tighter flex items-center">
              <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center mr-2 shadow-lg">
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              mycart
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              India's boldest destination for next-gen technology and luxury lifestyle. We deliver unmatched shopping experiences through human elegance and bold design.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all border border-white/5"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all border border-white/5"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all border border-white/5"><i className="fa-brands fa-twitter"></i></a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-xs mb-8 uppercase tracking-[0.3em] text-red-500">Categories</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li><Link to="/shop" className="hover:text-red-400 transition-colors">Electronic Store</Link></li>
              <li><Link to="/shop" className="hover:text-red-400 transition-colors">Premium Mobiles</Link></li>
              <li><Link to="/shop" className="hover:text-red-400 transition-colors">Luxury Fashion</Link></li>
              <li><Link to="/shop" className="hover:text-red-400 transition-colors">Smart Living</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs mb-8 uppercase tracking-[0.3em] text-red-500">Help Desk</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li><Link to="/orders" className="hover:text-red-400 transition-colors">Order Tracking</Link></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Shipment Status</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs mb-8 uppercase tracking-[0.3em] text-red-500">Stay Updated</h4>
            <p className="text-slate-500 text-sm mb-6 font-medium">Get VIP access to deals and new arrivals.</p>
            {subscribed ? (
              <div className="bg-red-600/20 border border-red-600/50 p-4 rounded-xl text-red-400 font-black text-[10px] uppercase tracking-widest animate-in zoom-in-95">
                <i className="fa-solid fa-check-circle mr-2"></i> You're on the list!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input 
                  type="email" 
                  required
                  placeholder="Email address" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-slate-900 border border-white/5 rounded-l-xl px-4 py-3 text-sm flex-1 outline-none text-white focus:border-red-600 transition-colors"
                />
                <button type="submit" className="bg-red-600 text-white px-6 py-3 rounded-r-xl font-black uppercase text-[10px] hover:bg-red-700 transition-all">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} MYCART ELITE INDIA. DESIGNED FOR EXCELLENCE.
          </div>
          <div className="flex items-center space-x-6 text-slate-700 text-2xl">
             <i className="fa-brands fa-cc-visa hover:text-slate-400 cursor-pointer transition-colors"></i>
             <i className="fa-brands fa-cc-mastercard hover:text-slate-400 cursor-pointer transition-colors"></i>
             <i className="fa-brands fa-cc-apple-pay hover:text-slate-400 cursor-pointer transition-colors"></i>
             <i className="fa-brands fa-cc-amazon-pay hover:text-slate-400 cursor-pointer transition-colors"></i>
          </div>
          <div className="text-slate-600 text-[10px] font-black uppercase flex items-center">
             <i className="fa-solid fa-location-dot mr-2 text-red-600"></i>
             Bangalore HQ • India
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
