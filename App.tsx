
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Product, CartItem, Order, UserRole } from './types.ts';
import { INITIAL_PRODUCTS } from './constants.ts';
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

// Improved API_BASE detection: use relative path for production
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? "http://localhost:5000/api" 
  : "/api";

interface ThemeContextType { theme: 'light' | 'dark'; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => { const context = useContext(ThemeContext); if (!context) throw new Error("useTheme error"); return context; };

interface AuthContextType { user: User | null; login: (email: string, role: UserRole) => void; logout: () => void; updateUser: (data: Partial<User>) => void; isAdmin: boolean; }
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
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthRes = await fetch(`${API_BASE}/health`);
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setIsOnline(healthData.code === 1);
        }

        const prodRes = await fetch(`${API_BASE}/products`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.length > 0 ? prodData : INITIAL_PRODUCTS);
        } else {
          const savedProducts = localStorage.getItem('mycart_products');
          if (savedProducts) setProducts(JSON.parse(savedProducts));
        }
      } catch (err) {
        setIsOnline(false);
        const savedProducts = localStorage.getItem('mycart_products');
        if (savedProducts) setProducts(JSON.parse(savedProducts));
      }

      const savedOrders = localStorage.getItem('mycart_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('mycart_theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    const savedUser = localStorage.getItem('mycart_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('mycart_theme', newTheme);
  };

  const login = (email: string, role: UserRole) => {
    const newUser = { id: email, name: email.split('@')[0], email, role, avatar: `https://ui-avatars.com/api/?name=${email}&background=dc2626&color=fff` };
    setUser(newUser);
    localStorage.setItem('mycart_user', JSON.stringify(newUser));
  };

  const logout = () => { setUser(null); localStorage.removeItem('mycart_user'); };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('mycart_user', JSON.stringify(updated));
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
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      items: [...cart],
      total: total > 1999 ? total : total + 99,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {
      console.warn("Order saved locally (server offline)");
    }

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('mycart_orders', JSON.stringify(updatedOrders));
    clearCart();
  };

  const addProduct = async (p: any) => {
    const newProducts = [p, ...products];
    setProducts(newProducts);
    localStorage.setItem('mycart_products', JSON.stringify(newProducts));
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
    } catch (e) { console.warn("Product added locally (server offline)"); }
  };

  const updateProduct = async (p: any) => {
    const updated = products.map(item => item.id === p.id ? p : item);
    setProducts(updated);
    localStorage.setItem('mycart_products', JSON.stringify(updated));
    try {
      await fetch(`${API_BASE}/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
    } catch (e) { console.warn("Product updated locally (server offline)"); }
  };

  const deleteProduct = async (id: string) => {
    const filtered = products.filter(item => item.id !== id);
    setProducts(filtered);
    localStorage.setItem('mycart_products', JSON.stringify(filtered));
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    } catch (e) { console.warn("Product deleted locally (server offline)"); }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, logout, updateUser, isAdmin: user?.role === 'ADMIN' }}>
        <StoreContext.Provider value={{ products, orders, cart, loading, isOnline, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, addProduct, updateProduct, deleteProduct }}>
          <div className={`${theme}`}>
            <HashRouter>
              <div className="flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                       <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-red-600 font-black uppercase tracking-widest text-xs">Accessing mycart Vault...</p>
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
              </div>
            </HashRouter>
          </div>
        </StoreContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
