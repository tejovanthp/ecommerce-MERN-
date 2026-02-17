
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection Management ---
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return true;
  
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  if (!MONGO_URI) {
    console.error("❌ Diagnostic: MONGO_URI is MISSING from .env file.");
    return false;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 30000,
    });
    console.log('✅ Connected to MongoDB Atlas: ' + mongoose.connection.name);
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    return false;
  }
};

// --- Models ---
const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  avatar: String,
  phone: String,
  address: String
});

const ProductSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: { type: Number, default: 0 }
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  items: Array,
  total: Number,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// --- API Routes ---

app.get('/api/health', async (req, res) => {
  const isOk = await connectToDatabase();
  res.json({ 
    status: isOk ? 'online' : 'offline', 
    code: isOk ? 1 : 0,
    diagnostics: {
      hasEnv: !!(process.env.MONGO_URI || process.env.MONGODB_URI),
      readyState: mongoose.connection.readyState,
      dbName: isOk ? mongoose.connection.name : 'unknown'
    }
  });
});

// --- Auth Routes ---

app.post('/api/signup', async (req, res) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const newUser = new User({
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      password, // In a real app, hash this!
      role: 'USER',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff`
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Signup failed", message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const isOk = await connectToDatabase();
  const { identifier, password } = req.body;

  if (!isOk) {
    return res.status(503).json({ 
      error: 'Database Offline', 
      details: 'Ensure MONGO_URI is set in your .env file.' 
    });
  }

  try {
    const user = await User.findOne({ 
      $or: [{ id: identifier.toLowerCase() }, { email: identifier.toLowerCase() }] 
    });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (err) { 
    res.status(500).json({ error: 'Server Error', message: err.message }); 
  }
});

// --- Product Routes ---

app.get('/api/products', async (req, res) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try { 
    const products = await Product.find().sort({ _id: -1 });
    res.json(products); 
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/products', async (req, res) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ error: "Storage Failed", message: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: "Update Failed", message: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, message: "Product delisted" });
  } catch (err) { res.status(500).json({ error: "Deletion Failed", message: err.message }); }
});

// --- Order Routes ---

app.get('/api/orders/:userId', async (req, res) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/orders', async (req, res) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) { res.status(400).json({ error: "Order failed", message: err.message }); }
});

// --- Local Server Listener ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend ready at http://localhost:${PORT}`);
  connectToDatabase();
});

export default app;
