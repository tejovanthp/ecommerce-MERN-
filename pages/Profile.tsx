
import React, { useState } from 'react';
import { useAuth, useStore } from '../App.tsx';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'security'>('info');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ 
    name: user?.name || '', 
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const userOrders = orders.filter(o => o.userId === user?.id);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(editData);
    setShowEditModal(false);
  };

  const handleMfaToggle = () => {
    setMfaEnabled(!mfaEnabled);
    alert(mfaEnabled ? "MFA Deactivated" : "MFA Secured");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-red-50 dark:border-white/5 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 shadow-2xl shadow-red-500/5 transition-all duration-300">
        <div className="relative">
          <img src={user?.avatar} alt={user?.name} className="w-32 h-32 rounded-[2rem] border-4 border-white dark:border-slate-800 shadow-xl object-cover" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 border-4 border-white dark:border-slate-800 rounded-full shadow-lg"></div>
        </div>
        <div className="flex-grow text-center md:text-left space-y-2">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{user?.name}</h1>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user?.role === 'ADMIN' ? 'bg-red-600 text-white' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>
              {user?.role} Access
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{user?.email}</p>
          <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest mt-2">
             <i className="fa-solid fa-calendar-check text-red-600/50"></i>
             <span>Elite Member since 2024</span>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditData({ 
              name: user?.name || '', 
              avatar: user?.avatar || '',
              phone: user?.phone || '',
              address: user?.address || ''
            });
            setShowEditModal(true);
          }}
          className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
        >
          <i className="fa-solid fa-pen-nib mr-2"></i> Edit Profile
        </button>
      </div>

      <div className="flex space-x-2 border-b border-red-50 dark:border-white/5 pb-4">
        {[
          { id: 'info', icon: 'fa-user-gear', label: 'Identity Vault' },
          { id: 'orders', icon: 'fa-receipt', label: 'Recent Orders' },
          { id: 'security', icon: 'fa-shield-halved', label: 'Security' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center ${
              activeTab === tab.id ? 'bg-red-600 text-white shadow-xl translate-y-[-2px]' : 'text-slate-400 hover:bg-red-50 dark:hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${tab.icon} mr-3`}></i> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-red-50 dark:border-white/5 shadow-xl shadow-red-500/5 space-y-8">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-address-card"></i>
                </div>
                <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Contact Portfolio</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                  <p className="font-black text-slate-800 dark:text-slate-200 text-xl tracking-tight">{user?.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Authenticated Email</label>
                  <p className="font-black text-slate-800 dark:text-slate-200 text-xl tracking-tight">{user?.email}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mobile Phone</label>
                    <p className={`font-black text-xl tracking-tight ${user?.phone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-300 dark:text-slate-700 italic'}`}>
                      {user?.phone || 'Not Linked'}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Hub</label>
                    <p className="font-black text-slate-800 dark:text-slate-200 text-xl tracking-tight">Mumbai HQ</p>
                  </div>
                </div>
                <div className="pt-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Default Logistics Address</label>
                  <p className={`font-black text-lg leading-relaxed ${user?.address ? 'text-slate-800 dark:text-slate-200' : 'text-slate-300 dark:text-slate-700 italic'}`}>
                    {user?.address || 'Deployment address pending configuration.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-700 p-12 rounded-[2.5rem] text-white space-y-8 shadow-2xl shadow-red-900/40 relative overflow-hidden group">
              <i className="fa-solid fa-crown absolute -right-4 -bottom-4 text-[12rem] text-white/5 group-hover:rotate-12 transition-transform duration-700"></i>
              <div className="relative z-10 space-y-6">
                <h3 className="text-4xl font-black tracking-tighter">Crimson Status</h3>
                <p className="text-red-100/80 font-medium text-lg leading-relaxed">Your identity is secured with Tier-1 encryption. You are currently eligible for priority global logistics and 24/7 concierge support.</p>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Acquisition Credits</span>
                    <span className="font-black text-xl">1,240 XP</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-2/3 shadow-[0_0_20px_white]"></div>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest mt-4 text-center opacity-60">Next Level: Crimson Platinum</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            {userOrders.length > 0 ? (
              userOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-red-50 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center gap-10 hover:shadow-xl transition-all group">
                  <div className="bg-red-50 dark:bg-red-900/30 w-24 h-24 rounded-3xl flex items-center justify-center text-red-600 dark:text-red-400 font-black text-sm shadow-inner">
                    #{order.id.split('-')[1]}
                  </div>
                  <div className="flex-grow space-y-2">
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{order.total.toLocaleString('en-IN')}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      <span className="text-[10px] text-red-600 font-black uppercase tracking-widest">{order.status}</span>
                    </div>
                  </div>
                  <div className="flex -space-x-4">
                    {order.items.slice(0, 3).map(item => (
                      <img key={item.id} src={item.image} className="w-14 h-14 rounded-2xl border-4 border-white dark:border-slate-800 object-cover shadow-lg group-hover:translate-y-[-4px] transition-transform" />
                    ))}
                    {order.items.length > 3 && <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 border-4 border-white dark:border-slate-800 flex items-center justify-center text-xs font-black text-red-600 dark:text-white shadow-lg">+{order.items.length - 3}</div>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5">
                <i className="fa-solid fa-box-open text-5xl text-slate-300 dark:text-slate-700 mb-6"></i>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active order history detected.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-red-50 dark:border-white/5 shadow-xl shadow-red-500/5 space-y-12 animate-in fade-in duration-500">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-red-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-red-500/20">
                <i className="fa-solid fa-fingerprint text-2xl"></i>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Security Protocols</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Configure advanced protection for your elite account.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 space-y-8">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-800 dark:text-slate-300 uppercase text-[10px] tracking-[0.2em]">Password Shield</h4>
                  <span className="text-[9px] font-black bg-red-100 dark:bg-red-950/30 text-red-600 px-3 py-1 rounded-lg">VERIFIED</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">Rotating your access codes regularly ensures your digital vault remains impervious to external intrusion.</p>
                <button onClick={() => alert("Identity verification link sent.")} className="w-full bg-white dark:bg-slate-700 border-2 border-slate-100 dark:border-white/10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all text-slate-900 dark:text-white shadow-sm">Initialize Reset</button>
              </div>

              <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 space-y-8">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-800 dark:text-slate-300 uppercase text-[10px] tracking-[0.2em]">Multi-Factor Matrix</h4>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-lg ${mfaEnabled ? 'bg-red-100 text-red-600' : 'bg-red-100 text-red-600'}`}>
                    {mfaEnabled ? 'OPERATIONAL' : 'OFFLINE'}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">Deploy biometrics or mobile-link verification for double-layer authentication on every deployment.</p>
                <button 
                  onClick={handleMfaToggle}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${
                    mfaEnabled ? 'bg-slate-900 text-white' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {mfaEnabled ? 'Terminate MFA' : 'Establish MFA Link'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3.5rem] shadow-[0_50px_100px_rgba(220,38,38,0.2)] p-12 border border-red-50 dark:border-white/5 transform animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Identity Configuration</h3>
              <button onClick={() => setShowEditModal(false)} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                  <input 
                    type="text" 
                    required
                    value={editData.name}
                    onChange={e => setEditData({...editData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent rounded-2xl py-5 px-6 outline-none focus:border-red-600 transition-all font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Avatar Graphics URL</label>
                  <input 
                    type="text" 
                    value={editData.avatar}
                    onChange={e => setEditData({...editData, avatar: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent rounded-2xl py-5 px-6 outline-none focus:border-red-600 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Access Number</label>
                  <input 
                    type="tel" 
                    placeholder="+91 00000 00000"
                    value={editData.phone}
                    onChange={e => setEditData({...editData, phone: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent rounded-2xl py-5 px-6 outline-none focus:border-red-600 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logistics Deployment Address</label>
                  <textarea 
                    rows={3}
                    placeholder="Enter full primary shipping address..."
                    value={editData.address}
                    onChange={e => setEditData({...editData, address: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent rounded-2xl py-5 px-6 outline-none focus:border-red-600 transition-all font-bold resize-none"
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-6 pt-4">
                <button type="submit" className="flex-1 bg-red-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-500/20 active:scale-95 transition-all">Save Identity</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 py-6 rounded-3xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
