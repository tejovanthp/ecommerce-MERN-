
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'USER'); // Default to USER role
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-red-50 dark:border-white/5 shadow-2xl shadow-red-500/5 transition-all duration-300">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400 text-3xl shadow-inner">
            <i className="fa-solid fa-user-plus"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Join mycart</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Experience luxury shopping in red.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="Jane Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent dark:border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent dark:border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border border-transparent dark:border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-bold"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all transform active:scale-95 shadow-xl shadow-red-500/20"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-500 mt-10 text-sm font-bold">
          Already have an account? <Link to="/login" className="text-red-600 dark:text-red-400 font-black hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
