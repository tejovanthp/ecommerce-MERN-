
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection Management (Optimized for Serverless) ---
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return true;
  
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  if (!MONGO_URI) {
    console.error("❌ Diagnostic: MONGO_URI is MISSING from Environment Variables.");
    return false;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 30000,
    });
    console.log('✅ Connected to Atlas: ' + mongoose.connection.name);
    return true;
  } catch (err) {
    console.error('❌ Atlas Connection Failed:', err.message);
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
  avatar: String
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

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

app.post('/api/login', async (req, res) => {
  const isOk = await connectToDatabase();
  const { identifier, password } = req.body;

  if (!isOk) {
    return res.status(503).json({ 
      error: 'Database Offline', 
      details: 'Ensure MONGO_URI is set and IP is whitelisted in Atlas.' 
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

// --- Local Server Listener ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Crimson Server ready at http://localhost:${PORT}`);
  connectToDatabase();
});

export default app;
