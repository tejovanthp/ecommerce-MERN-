
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
  signup: (name: string, email: string, password?: string) => Promise<void>;
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
  diagnostics: any;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (orderData?: Partial<Order>) => Promise<void>;
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
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(true);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const fetchOrders = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${userId}`);
      if (res.ok) {
        const cloudOrders = await res.json();
        setOrders(cloudOrders);
      }
    } catch (e) {
      console.warn("Could not fetch cloud orders.");
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('mycart_user');
    if (savedUser) {
      try { 
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        fetchOrders(parsed.id);
      } catch(e) { 
        localStorage.removeItem('mycart_user'); 
      }
    }

    const performBackgroundSync = async () => {
      try {
        const healthRes = await fetch(`${API_BASE}/health`);
        if (!healthRes.ok) throw new Error("Server Error " + healthRes.status);
        
        const healthStatus = await healthRes.json();
        setDiagnostics(healthStatus.diagnostics);

        if (healthStatus && healthStatus.code === 1) {
          setIsOnline(true);
          const prodRes = await fetch(`${API_BASE}/products`);
          if (prodRes.ok) {
            const cloudProds = await prodRes.json();
            if (Array.isArray(cloudProds) && cloudProds.length > 0) setProducts(cloudProds);
          }
        }
      } catch (err) {
        console.warn("Atlas sync unreachable. Using Local Defaults.");
      } finally {
        setIsSyncing(false);
      }
    };

    performBackgroundSync();
  }, []);

  const login = async (identifier: string, password?: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPw = password ? password.trim() : "";

    if (cleanId === 'tejovanth' && cleanPw === '1234') {
      const masterUser: User = { 
        id: 'tejovanth', 
        name: 'Tejovanth (Admin)', 
        email: 'tejovanth@mycart.com', 
        role: 'ADMIN', 
        avatar: 'https://ui-avatars.com/api/?name=Tejovanth&background=dc2626&color=fff' 
      };
      setUser(masterUser);
      localStorage.setItem('mycart_user', JSON.stringify(masterUser));
      fetchOrders(masterUser.id);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password: cleanPw })
      });
      
      if (res.ok) {
        const loggedInUser = await res.json();
        setUser(loggedInUser);
        localStorage.setItem('mycart_user', JSON.stringify(loggedInUser));
        fetchOrders(loggedInUser.id);
      } else {
        const err = await res.json();
        alert(`Access Error: ${err.error || 'Invalid credentials'}`);
      }
    } catch (e) {
      alert("Network Error: Could not reach backend.");
    }
  };

  const signup = async (name: string, email: string, password?: string) => {
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (res.ok) {
        const newUser = await res.json();
        setUser(newUser);
        localStorage.setItem('mycart_user', JSON.stringify(newUser));
        setOrders([]);
      } else {
        const err = await res.json();
        alert(`Signup Error: ${err.error}`);
      }
    } catch (e) {
      alert("Network Error: Could not reach backend.");
    }
  };

  const logout = () => { setUser(null); setOrders([]); localStorage.removeItem('mycart_user'); };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addProduct = async (p: Product) => {
    setProducts([p, ...products]);
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
    } catch (e) {
      console.error("Cloud save failed:", e);
    }
  };

  const updateProduct = async (p: Product) => {
    setProducts(products.map(item => item.id === p.id ? p : item));
    try {
      await fetch(`${API_BASE}/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
    } catch (e) {
      console.error("Cloud update failed:", e);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(products.filter(item => item.id !== id));
    try {
      await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error("Cloud delete failed:", e);
    }
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const updateCartQuantity = (id: string, qty: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, qty) } : item));
  const clearCart = () => setCart([]);
  
  const placeOrder = async (orderData?: Partial<Order>) => {
    if (!user) return;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal > 1999 ? subtotal : subtotal + 99;

    const newOrder: Order = {
      id: orderData?.id || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      items: [...cart],
      total: total,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    setOrders([newOrder, ...orders]);
    clearCart();

    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {
      console.error("Order cloud sync failed:", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, users, login, signup, logout, updateUser: async () => {}, toggleUserRole: async () => {}, isAdmin: user?.role === 'ADMIN' }}>
        <StoreContext.Provider value={{ products, orders, cart, loading, isOnline, diagnostics, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, addProduct, updateProduct, deleteProduct }}>
          <div className={`${theme}`}>
            <HashRouter>
              <div className="flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
                <Navbar />
                
                {isSyncing && (
                  <div className="bg-red-600 text-white text-[10px] font-black uppercase py-1 text-center tracking-[0.3em] animate-pulse sticky top-16 md:top-20 z-50">
                    Probing Cloud Database Status...
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
