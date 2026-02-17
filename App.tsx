
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
import { INITIAL_PRODUCTS } from './constants.ts';

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
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    const savedUser = localStorage.getItem('mycart_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch(e) { localStorage.removeItem('mycart_user'); }
    }

    const performBackgroundSync = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const healthRes = await fetch(`${API_BASE}/health`, { signal: controller.signal });
        const healthStatus = await healthRes.json();
        clearTimeout(timeoutId);

        if (healthStatus && healthStatus.code === 1) {
          setIsOnline(true);
          const [prodRes, userRes] = await Promise.all([
            fetch(`${API_BASE}/products`),
            fetch(`${API_BASE}/users`)
          ]);
          if (prodRes.ok) {
            const cloudProds = await prodRes.json();
            if (Array.isArray(cloudProds) && cloudProds.length > 0) setProducts(cloudProds);
          }
          if (userRes.ok) {
            const cloudUsers = await userRes.json();
            if (Array.isArray(cloudUsers)) setUsers(cloudUsers);
          }
        }
      } catch (err) {
        console.warn("Cloud Sync Unavailable - Running Local Instance");
      } finally {
        setIsSyncing(false);
      }
    };

    performBackgroundSync();
  }, []);

  const login = async (identifier: string, password?: string) => {
    // MASTER ACCESS BYPASS: Check for 'tejovanth' and '1234'
    if (identifier.toLowerCase() === 'tejovanth' && password === '1234') {
      const masterUser: User = { 
        id: 'tejovanth', 
        name: 'Tejovanth', 
        email: 'tejovanth@mycart.com', 
        role: 'ADMIN', 
        avatar: 'https://ui-avatars.com/api/?name=Tejovanth&background=dc2626&color=fff' 
      };
      setUser(masterUser);
      localStorage.setItem('mycart_user', JSON.stringify(masterUser));
      return;
    }

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
        const ordRes = await fetch(`${API_BASE}/orders/${loggedInUser.id || loggedInUser._id}`);
        if (ordRes.ok) setOrders(await ordRes.json());
      } else {
        alert("Authentication failed.");
      }
    } catch (e) {
      alert("Database error. Using offline session.");
      setUser({ id: 'u1', name: identifier, email: 'guest@mycart.com', role: 'USER' });
    }
  };

  const logout = () => { setUser(null); localStorage.removeItem('mycart_user'); setOrders([]); };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      await fetch(`${API_BASE}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}
  };

  const toggleUserRole = async (userId: string) => {
    const targetUser = users.find(u => u.id === userId || u._id === userId);
    if (!targetUser) return;
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    setUsers(users.map(u => (u.id === userId || u._id === userId) ? { ...u, role: newRole } : u));
    try {
      await fetch(`${API_BASE}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetUser, role: newRole })
      });
    } catch (e) {}
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
      userId: user.id || user._id || 'temp',
      items: [...cart],
      total: subtotal > 1999 ? subtotal : subtotal + 99,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    setOrders([newOrder, ...orders]);
    clearCart();
    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {}
  };

  const addProduct = async (p: Product) => {
    setProducts([p, ...products]);
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
    } catch (e) {}
  };

  const updateProduct = async (p: Product) => {
    setProducts(products.map(item => item.id === p.id ? p : item));
    try {
      await fetch(`${API_BASE}/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
    } catch (e) {}
  };

  const deleteProduct = async (id: string) => {
    setProducts(products.filter(item => item.id !== id));
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    } catch (e) {}
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, users, login, logout, updateUser, toggleUserRole, isAdmin: user?.role === 'ADMIN' }}>
        <StoreContext.Provider value={{ products, orders, cart, loading, isOnline, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, addProduct, updateProduct, deleteProduct }}>
          <div className={`${theme}`}>
            <HashRouter>
              <div className="flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
                <Navbar />
                
                {isSyncing && (
                  <div className="bg-red-600 text-white text-[10px] font-black uppercase py-1 text-center tracking-[0.3em] animate-pulse sticky top-16 md:top-20 z-50">
                    Establishing Crimson Link...
                  </div>
                )}

                <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
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
