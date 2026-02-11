import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, useAuth } from '../App.tsx';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, placeOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    placeOrder();
    alert("Order confirmed! Your items are on their way.");
    navigate('/profile');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-red-50 dark:border-white/5 shadow-2xl shadow-red-500/5 p-16 transition-colors duration-300">
        <div className="w-32 h-32 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <i className="fa-solid fa-cart-shopping text-5xl text-red-200 dark:text-red-400"></i>
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Your cart is feeling light!</h2>
        <p className="text-slate-400 dark:text-slate-500 mb-12 text-lg font-medium">Add some world-class products and experience the joy of mycart shopping.</p>
        <Link to="/shop" className="inline-block bg-red-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-200 active:scale-95">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
          <i className="fa-solid fa-bag-shopping text-xl"></i>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your mycart Bag</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-red-50 dark:border-white/5 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 shadow-xl shadow-red-500/5 hover:shadow-red-500/10 transition-all duration-300">
              <img src={item.image} alt={item.name} className="w-40 h-40 rounded-3xl object-cover bg-slate-50 dark:bg-slate-800 shadow-lg border border-red-50 dark:border-white/5" />
              <div className="flex-grow text-center md:text-left">
                <Link to={`/product/${item.id}`} className="text-2xl font-black text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors leading-tight">
                  {item.name}
                </Link>
                <div className="flex items-center justify-center md:justify-start space-x-3 mt-2">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase px-2 py-1 rounded-md">{item.category}</span>
                  <span className="text-green-600 dark:text-green-400 text-xs font-bold">Seller: mycart Retail</span>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between mt-8 space-y-4 md:space-y-0">
                  <div className="flex items-center bg-red-50 dark:bg-slate-800 rounded-2xl p-1.5 border border-red-100 dark:border-white/5">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl text-red-600 dark:text-red-400 font-black hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <span className="px-6 font-black text-red-900 dark:text-white text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl text-red-600 dark:text-red-400 font-black hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 font-black text-sm uppercase tracking-widest flex items-center transition-colors"
                  >
                    <i className="fa-solid fa-trash-can mr-2"></i> Remove
                  </button>
                </div>
              </div>
              <div className="md:text-right w-full md:w-auto border-t md:border-t-0 border-red-50 dark:border-white/5 pt-4 md:pt-0">
                <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold mt-2 uppercase">₹{item.price.toLocaleString('en-IN')} per unit</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-red-700 dark:bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-red-900/40 sticky top-28 overflow-hidden transition-colors duration-300 border border-red-800 dark:border-white/5">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <i className="fa-solid fa-receipt text-9xl"></i>
            </div>
            <h3 className="text-2xl font-black mb-8 relative tracking-tight">Summary</h3>
            <div className="space-y-6 relative">
              <div className="flex justify-between text-red-200 dark:text-slate-400 font-bold">
                <span>Items Subtotal</span>
                <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-red-200 dark:text-slate-400 font-bold">
                <span>Shipping Fee</span>
                <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-red-200 dark:text-slate-400 font-bold">
                <span>Tax (GST)</span>
                <span className="text-white">₹0 (Included)</span>
              </div>
              <div className="pt-6 border-t border-red-800/50 dark:border-white/10 flex justify-between items-end">
                <div>
                   <p className="text-red-300 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">Grand Total</p>
                   <p className="text-5xl font-black text-white tracking-tighter mt-1">₹{total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-white dark:bg-red-600 text-red-900 dark:text-white py-5 rounded-[1.5rem] font-black text-xl mt-12 hover:bg-red-50 dark:hover:bg-red-500 transition-all shadow-2xl shadow-red-900/50 active:scale-95"
            >
              Checkout Now
            </button>
            
            <div className="mt-8 flex flex-col space-y-4">
              <div className="flex items-center text-xs font-bold text-red-200/60 dark:text-slate-500 uppercase tracking-widest">
                <i className="fa-solid fa-shield-halved mr-3 text-lg"></i>
                Secure Elite Gateway
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;