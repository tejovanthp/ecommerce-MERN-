
import React, { useState } from 'react';
import { useAuth, useStore } from '../App.tsx';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'security'>('info');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
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
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-red-50 dark:border-white/5 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 shadow-2xl shadow-red-500/5">
        <div className="relative">
          <img src={user?.avatar} alt={user?.name} className="w-32 h-32 rounded-[2rem] border-4 border-white dark:border-slate-800 shadow-xl" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full"></div>
        </div>
        <div className="flex-grow text-center md:text-left space-y-2">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{user?.name}</h1>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user?.role === 'ADMIN' ? 'bg-red-600 text-white' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>
              {user?.role} Access
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{user?.email}</p>
          <p className="text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-widest">Member since 2024</p>
        </div>
        <button 
          onClick={() => setShowEditModal(true)}
          className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
        >
          Edit Profile
        </button>
      </div>

      <div className="flex space-x-2 border-b border-red-50 dark:border-white/5 pb-4">
        {[
          { id: 'info', icon: 'fa-user', label: 'My Info' },
          { id: 'orders', icon: 'fa-receipt', label: 'Recent Orders' },
          { id: 'security', icon: 'fa-shield-halved', label: 'Security Panel' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center ${
              activeTab === tab.id ? 'bg-red-600 text-white shadow-xl translate-y-[-2px]' : 'text-slate-400 hover:bg-red-50 dark:hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${tab.icon} mr-2`}></i> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-red-50 dark:border-white/5 shadow-sm space-y-6">
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white border-b border-red-50 dark:border-white/5 pb-4">Contact Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">{user?.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email ID</label>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mobile Phone</label>
                  <p className="font-bold text-slate-400 italic">Not provided</p>
                </div>
              </div>
            </div>
            <div className="bg-red-600 p-10 rounded-[2rem] text-white space-y-6 shadow-2xl shadow-red-500/20">
              <h3 className="text-2xl font-black tracking-tighter">Elite Member Status</h3>
              <p className="text-red-100 font-medium">You have unlocked free shipping and priority support for all future investments.</p>
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest">Rewards Points</span>
                  <span className="font-black">1,240 XP</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-2/3 shadow-[0_0_10px_white]"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            {userOrders.length > 0 ? (
              userOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-red-50 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center gap-8 hover:shadow-xl transition-all">
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-2xl text-red-600 dark:text-red-400 font-black text-sm">#{order.id.split('-')[1]}</div>
                  <div className="flex-grow">
                    <p className="font-black text-slate-900 dark:text-white">₹{order.total.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{order.status} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map(item => (
                      <img key={item.id} src={item.image} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" />
                    ))}
                    {order.items.length > 3 && <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-black text-red-600 dark:text-white">+{order.items.length - 3}</div>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/5">
                <i className="fa-solid fa-ghost text-4xl text-slate-300 dark:text-slate-600 mb-4"></i>
                <p className="text-slate-400 font-bold">No purchase history available.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-red-50 dark:border-white/5 shadow-sm space-y-12 animate-in fade-in duration-500">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-fingerprint text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Security Suite</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your elite account protection protocols.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-800 dark:text-slate-300 uppercase text-xs tracking-widest">Password Management</h4>
                  <span className="text-[9px] font-black bg-green-100 dark:bg-green-950/30 text-green-600 px-2 py-1 rounded">SECURE</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Regularly updating your password prevents unauthorized deployment of your credentials.</p>
                <button onClick={() => alert("Verification code sent to email.")} className="w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-white/10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all text-slate-900 dark:text-white">Reset Password</button>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-800 dark:text-slate-300 uppercase text-xs tracking-widest">Multi-Factor Auth</h4>
                  <span className={`text-[9px] font-black px-2 py-1 rounded ${mfaEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {mfaEnabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Add a layer of biometrics or physical tokens to your login sequences for maximum vault safety.</p>
                <button 
                  onClick={handleMfaToggle}
                  className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
                    mfaEnabled ? 'bg-slate-900 text-white' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-red-50 dark:border-white/5">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Update Identity</h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                <input 
                  type="text" 
                  value={editData.name}
                  onChange={e => setEditData({...editData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:border-red-600 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Avatar URL</label>
                <input 
                  type="text" 
                  value={editData.avatar}
                  onChange={e => setEditData({...editData, avatar: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-transparent rounded-2xl py-4 px-6 outline-none focus:border-red-600 transition-all font-bold"
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95">Save Changes</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
