
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
  console.error("❌ ERROR: MONGO_URI is missing. Please set it in Vercel environment variables.");
} else {
  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, 
  })
  .then(() => {
    console.log('✅ DATABASE CONNECTED SUCCESSFULLY');
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
    // Upsert the admin to ensure credentials are always fresh
    await User.findOneAndUpdate(
      { id: 'tejovanth' },
      {
        id: 'tejovanth',
        name: 'Tejovanth',
        email: 'tejovanth@mycart.com',
        password: '1234',
        role: 'ADMIN',
        avatar: 'https://ui-avatars.com/api/?name=Tejovanth&background=dc2626&color=fff'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Master User Tejovanth Synchronized');
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
  }
}

// --- API Routes ---

app.get('/api/health', (req, res) => {
  res.json({ 
    status: mongoose.connection.readyState === 1 ? 'online' : 'connecting', 
    code: mongoose.connection.readyState 
  });
});

app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({ 
      $or: [
        { id: identifier.toLowerCase() }, 
        { email: identifier.toLowerCase() }
      ] 
    });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/users', async (req, res) => {
  try { res.json(await User.find()); } catch (err) { res.status(500).json(err); }
});

app.post('/api/users/sync', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.body.id }, req.body, { upsert: true, new: true });
    res.json(user);
  } catch (err) { res.status(400).json(err); }
});

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

module.exports = app;
