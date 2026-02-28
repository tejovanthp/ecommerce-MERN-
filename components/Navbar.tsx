
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useStore } from '../App.tsx';
import { motion } from 'framer-motion';

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
    <nav className="glass-dark sticky top-0 z-[1000] border-b border-white/5 transition-all duration-500">
      <div className="container mx-auto px-6 flex justify-between items-center h-20 md:h-24">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl md:text-3xl font-black text-white tracking-tighter flex items-center group">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center mr-3 shadow-2xl shadow-red-600/40"
            >
              <i className="fa-solid fa-cart-shopping"></i>
            </motion.div>
            <span className="tracking-tight">my</span>cart
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${
                location.pathname === link.path 
                ? 'bg-white text-black shadow-2xl' 
                : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="relative z-10">{link.name}</span>
              {location.pathname !== link.path && (
                <motion.div 
                  className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                />
              )}
            </Link>
          ))}
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                location.pathname === '/admin' 
                ? 'bg-red-600 text-white shadow-2xl' 
                : 'text-red-400 hover:text-red-300'
              }`}
            >
              <i className="fa-solid fa-shield-halved mr-2"></i> Admin
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4 md:space-x-8">
          <Link to="/cart" className="relative group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/10 group-hover:bg-red-600 group-hover:border-red-500 transition-all duration-300"
            >
              <i className="fa-solid fa-cart-arrow-down text-lg text-white"></i>
            </motion.div>
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full ring-4 ring-black"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="group">
                <motion.img 
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-11 h-11 rounded-2xl border-2 border-white/10 group-hover:border-red-500 transition-all shadow-2xl" 
                />
              </Link>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="text-white/40 hover:text-red-500 transition-colors p-2"
              >
                <i className="fa-solid fa-power-off text-xl"></i>
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white/60 hover:text-white font-black text-[10px] uppercase tracking-widest hidden sm:block">Login</Link>
              <Link to="/signup" className="bg-white text-black px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-500 shadow-2xl shadow-white/5">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
