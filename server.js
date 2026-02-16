
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI environment variable is not defined!");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ DATABASE CONNECTED SUCCESSFULLY TO MONGODB ATLAS');
      seedDatabase(); 
    })
    .catch(err => {
      console.error('❌ MONGODB CONNECTION ERROR:', err.message);
    });
}

// --- Schemas & Models ---

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  avatar: String,
  phone: String,
  address: String
});

const ProductSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  rating: Number
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  userId: String,
  items: Array,
  total: Number,
  status: { type: String, enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// --- Seeding Logic ---
async function seedDatabase() {
  try {
    // 1. Seed Master Admin (Tejovanth)
    const adminExists = await User.findOne({ id: 'tejovanth' });
    if (!adminExists) {
      console.log('🌱 Creating Master Admin: Tejovanth...');
      await User.create({
        id: 'tejovanth',
        name: 'Tejovanth',
        email: 'tejovanth@mycart.com',
        password: '1234',
        role: 'ADMIN',
        avatar: 'https://ui-avatars.com/api/?name=Tejovanth&background=ffd700&color=000'
      });
    }

    // 2. Seed Initial Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding catalog to Atlas...');
      const initialProducts = [
        { id: 'p1', name: 'Nexus Pro Wireless Headphones', description: 'High-fidelity audio with active noise cancellation.', price: 24999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', stock: 25, rating: 4.8 },
        { id: 'p2', name: 'Zenith Smart Watch X1', description: 'Advanced health tracking and Amoled display.', price: 15999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400', stock: 15, rating: 4.5 },
        { id: 'p6', name: 'Ultra Slim Flagship Phone', description: '120Hz display, 50MP triple camera setup.', price: 54999, category: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400', stock: 12, rating: 4.7 }
      ];
      await Product.insertMany(initialProducts);
      console.log('✅ Catalog successfully seeded.');
    }
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
}

// --- API Routes ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: mongoose.connection.readyState === 1 ? 'online' : 'offline', code: mongoose.connection.readyState });
});

// Authentication
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ id: identifier }, { email: identifier }] });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server authentication error' });
  }
});

// Users
app.get('/api/users', async (req, res) => {
  try { res.json(await User.find()); } catch (err) { res.status(500).json(err); }
});

app.post('/api/users/sync', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.body.id }, req.body, { upsert: true, new: true });
    res.json(user);
  } catch (err) { res.status(400).json(err); }
});

// Products
app.get('/api/products', async (req, res) => {
  try { res.json(await Product.find()); } catch (err) { res.status(500).json(err); }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) { res.status(400).json(err); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json(err); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// Orders
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) { res.status(400).json(err); }
});

// Start server (Local only - Vercel uses exports)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Crimson Server active on port ${PORT}`));
}

module.exports = app;
