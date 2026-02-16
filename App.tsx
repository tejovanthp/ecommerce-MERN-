
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Product, CartItem, Order, UserRole } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import Orders from './pages/Orders.tsx';
import ProductDetails from './pages/ProductDetails.tsx';
import Cart from './pages/Cart.tsx';
import Profile from './pages/Profile.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import Checkout from './pages/Checkout.tsx';
import Chatbot from './components/Chatbot.tsx';

// Detect if we are running locally or on Vercel
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? "http://localhost:5000/api" 
  : "/api";

interface ThemeContextType { theme: 'light' | 'dark'; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => { const context = useContext(ThemeContext); if (!context) throw new Error("useTheme error"); return context; };

interface AuthContextType { 
  user: User | null; 
  users: User[];
  login: (identifier: string, password?: string) => Promise<void>; 
  logout: () => void; 
  updateUser: (data: Partial<User>) => Promise<void>; 
  toggleUserRole: (userId: string) => Promise<void>;
  isAdmin: boolean; 
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error("useAuth error"); return context; };

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  loading: boolean;
  isOnline: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}
const StoreContext = createContext<StoreContextType | undefined>(undefined);
export const useStore = () => { const context = useContext(StoreContext); if (!context) throw new Error("useStore error"); return context; };

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Added toggleTheme function to resolve scope error for ThemeContext.Provider
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthRes = await fetch(`${API_BASE}/health`);
        const healthStatus = await healthRes.json();
        const isDbConnected = healthRes.ok && healthStatus.code === 1;
        setIsOnline(isDbConnected);

        const [prodRes, userRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/users`)
        ]);

        if (prodRes.ok) setProducts(await prodRes.json());
        if (userRes.ok) setUsers(await userRes.json());
        
        const savedUser = localStorage.getItem('mycart_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          // Handled MongoDB _id compatibility which is now included in the User type
          const ordRes = await fetch(`${API_BASE}/orders/${parsed.id || parsed._id}`);
          if (ordRes.ok) setOrders(await ordRes.json());
        }
      } catch (err) {
        console.warn("Atlas Offline - Running in Local Mode");
        setIsOnline(false);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const login = async (identifier: string, password?: string) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      if (res.ok) {
        const loggedInUser = await res.json();
        setUser(loggedInUser);
        localStorage.setItem('mycart_user', JSON.stringify(loggedInUser));
        // Handled MongoDB _id compatibility for the authenticated user
        const ordRes = await fetch(`${API_BASE}/orders/${loggedInUser.id || loggedInUser._id}`);
        if (ordRes.ok) setOrders(await ordRes.json());
      } else {
        alert("Authentication Failed. Check your credentials.");
      }
    } catch (e) {
      alert("Database Connectivity Error. Ensure MONGO_URI is set.");
    }
  };

  const logout = () => { setUser(null); localStorage.removeItem('mycart_user'); setOrders([]); };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    try {
      const res = await fetch(`${API_BASE}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const synced = await res.json();
        setUser(synced);
        localStorage.setItem('mycart_user', JSON.stringify(synced));
      }
    } catch (e) { console.error("Sync failed"); }
  };

  const toggleUserRole = async (userId: string) => {
    // Handled MongoDB _id property check for User object
    const targetUser = users.find(u => u.id === userId || u._id === userId);
    if (!targetUser) return;
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await fetch(`${API_BASE}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetUser, role: newRole })
      });
      if (res.ok) {
        const updated = await res.json();
        // Handled MongoDB _id property updates in the users list
        setUsers(users.map(u => (u.id === userId || u._id === userId) ? updated : u));
        if (user?.id === userId || user?._id === userId) setUser(updated);
      }
    } catch (e) { console.error("Role update failed"); }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const updateCartQuantity = (id: string, qty: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, qty) } : item));
  const clearCart = () => setCart([]);

  const placeOrder = async () => {
    if (cart.length === 0 || !user) return;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      // Handled MongoDB _id compatibility for order ownership
      userId: user.id || user._id || '',
      items: [...cart],
      total: subtotal > 1999 ? subtotal : subtotal + 99,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        setOrders([newOrder, ...orders]);
        clearCart();
      }
    } catch (e) { alert("Offline: Order saved to local session only."); }
  };

  const addProduct = async (p: Product) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) setProducts([await res.json(), ...products]);
    } catch (e) { setProducts([p, ...products]); }
  };

  const updateProduct = async (p: Product) => {
    try {
      const res = await fetch(`${API_BASE}/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) setProducts(products.map(item => item.id === p.id ? p : item));
    } catch (e) { setProducts(products.map(item => item.id === p.id ? p : item)); }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      if (res.ok) setProducts(products.filter(item => item.id !== id));
    } catch (e) { setProducts(products.filter(item => item.id !== id)); }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, users, login, logout, updateUser, toggleUserRole, isAdmin: user?.role === 'ADMIN' }}>
        <StoreContext.Provider value={{ products, orders, cart, loading, isOnline, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, addProduct, updateProduct, deleteProduct }}>
          <div className={`${theme}`}>
            <HashRouter>
              <div className="flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
                       <div className="relative">
                          <div className="w-20 h-20 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <i className="fa-solid fa-cloud-bolt text-red-600 animate-pulse"></i>
                          </div>
                       </div>
                       <div className="text-center">
                          <p className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Establishing Secure Link</p>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Synchronizing with MongoDB Atlas Cluster...</p>
                       </div>
                    </div>
                  ) : (
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                      <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
                    </Routes>
                  )}
                </main>
                <Footer />
                <Chatbot />
              </div>
            </HashRouter>
          </div>
        </StoreContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
