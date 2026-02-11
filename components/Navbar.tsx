
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useStore } from '../App.tsx';

const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useStore();
  const location = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Orders', path: '/orders' },
  ];

  return (
    <nav className="bg-red-700 shadow-xl sticky top-0 z-[90] border-b border-red-800 transition-all duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl md:text-3xl font-black text-white tracking-tighter flex items-center group">
            <div className="w-10 h-10 bg-white text-red-700 rounded-xl flex items-center justify-center mr-2 group-hover:rotate-6 transition-transform shadow-lg">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
            mycart
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                location.pathname === link.path 
                ? 'bg-white text-red-700 shadow-xl translate-y-[-2px]' 
                : 'text-white/80 hover:text-white hover:bg-red-600/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                location.pathname === '/admin' 
                ? 'bg-white text-red-700 shadow-xl translate-y-[-2px]' 
                : 'text-yellow-300 hover:text-white hover:bg-red-600/50'
              }`}
            >
              <i className="fa-solid fa-shield-halved mr-2"></i> Admin Panel
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          <Link to="/cart" className="relative text-white/90 hover:text-white transition-all flex items-center group">
            <div className="bg-red-800/40 w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 group-hover:bg-red-600 transition-colors">
              <i className="fa-solid fa-cart-arrow-down text-lg"></i>
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-red-700">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl border-2 border-white/20 hover:border-white transition-all shadow-md" />
                </Link>
                <button 
                  onClick={logout}
                  className="text-red-200 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-power-off"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-white hover:text-red-100 font-bold text-sm hidden sm:block">Login</Link>
              <Link to="/signup" className="bg-white text-red-700 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95 shadow-xl shadow-red-900/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
