
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS } from './constants.ts';

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection Management ---
let cachedDb: typeof mongoose | null = null;

const connectToDatabase = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return true;
  }
  
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  if (!MONGO_URI) {
    console.error("❌ Diagnostic: MONGO_URI is MISSING.");
    return false;
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    cachedDb = await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
    console.log('✅ Connected to MongoDB Atlas');
    await seedDatabase();
    return true;
  } catch (err: any) {
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
  stock: { type: Number, default: 0 },
  rating: Number
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

// --- Seeding Logic ---
const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding database with initial products...');
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log('✅ Database seeded successfully.');
    }
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
};

// --- API Routes ---

app.get('/api/health', async (req: Request, res: Response) => {
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

app.post('/api/signup', async (req: Request, res: Response) => {
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
  } catch (err: any) {
    res.status(500).json({ error: "Signup failed", message: err.message });
  }
});

app.post('/api/login', async (req: Request, res: Response) => {
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
      $or: [
        { id: identifier.toLowerCase() }, 
        { email: identifier.toLowerCase() },
        { name: { $regex: new RegExp(`^${identifier}$`, 'i') } }
      ] 
    });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (err: any) { 
    res.status(500).json({ error: 'Server Error', message: err.message }); 
  }
});

// --- Product Routes ---

app.get('/api/products', async (req: Request, res: Response) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try { 
    const products = await Product.find().sort({ _id: -1 });
    res.json(products); 
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/products', async (req: Request, res: Response) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err: any) { res.status(400).json({ error: "Storage Failed", message: err.message }); }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
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
  } catch (err: any) { res.status(400).json({ error: "Update Failed", message: err.message }); }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, message: "Product delisted" });
  } catch (err: any) { res.status(500).json({ error: "Deletion Failed", message: err.message }); }
});

// --- Order Routes ---

app.get('/api/orders', async (req: Request, res: Response) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json(err); }
});

app.get('/api/orders/:userId', async (req: Request, res: Response) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/orders', async (req: Request, res: Response) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    console.log(`✅ Order ${newOrder.id} saved for user ${newOrder.userId}`);
    res.status(201).json(newOrder);
  } catch (err: any) { 
    console.error("❌ Order Save Failed:", err);
    res.status(400).json({ error: "Order failed", message: err.message }); 
  }
});

app.put('/api/orders/:id', async (req: Request, res: Response) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const updated = await Order.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (err: any) { res.status(500).json({ error: "Update Failed", message: err.message }); }
});

// --- User Management Routes ---

app.get('/api/users', async (req: Request, res: Response) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/users/:id', async (req: Request, res: Response) => {
  const isOk = await connectToDatabase();
  if (!isOk) return res.status(503).json({ error: 'Database offline' });
  try {
    const updated = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    ).select('-password');
    if (!updated) return res.status(404).json({ error: "User not found" });
    console.log(`✅ User ${updated.id} updated`);
    res.json(updated);
  } catch (err: any) { 
    console.error("❌ User Update Failed:", err);
    res.status(400).json({ error: "Update Failed", message: err.message }); 
  }
});

// --- Vite Middleware & Server Start ---

async function startServer() {
  const isOk = await connectToDatabase();
  
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite middleware skipped (likely production build)");
    }
  } else {
    app.use(express.static('dist'));
  }

  const PORT = process.env.PORT || 3000;
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`🚀 Local server running on http://localhost:${PORT}`);
    });
  }
}

if (process.env.NODE_ENV !== 'production') {
  startServer();
}

export default app;

