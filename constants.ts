import { Product, Category } from './types.ts';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', icon: 'fa-laptop' },
  { id: '2', name: 'Mobiles', icon: 'fa-mobile-screen' },
  { id: '3', name: 'Fashion', icon: 'fa-shirt' },
  { id: '4', name: 'Home', icon: 'fa-house' },
  { id: '5', name: 'Accessories', icon: 'fa-watch' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Nexus Pro Wireless Headphones',
    description: 'High-fidelity audio with active noise cancellation and 40-hour battery life. Perfect for music enthusiasts.',
    price: 24999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    stock: 25,
    rating: 4.8
  },
  {
    id: 'p2',
    name: 'Zenith Smart Watch X1',
    description: 'Advanced health tracking, Amoled display, and 14-day battery life.',
    price: 15999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    stock: 15,
    rating: 4.5
  },
  {
    id: 'p7',
    name: 'Quantum OLED Monitor',
    description: '34-inch curved gaming monitor with 240Hz refresh rate and 0.03ms response time.',
    price: 89999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400',
    stock: 10,
    rating: 4.9
  },
  {
    id: 'p6',
    name: 'Ultra Slim Flagship Phone',
    description: '120Hz display, 50MP triple camera setup, and lightning fast charging.',
    price: 54999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
    stock: 12,
    rating: 4.7
  },
  {
    id: 'p8',
    name: 'Pixel Pro 9',
    description: 'The most advanced AI-powered smartphone with professional-grade camera system.',
    price: 109999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=400',
    stock: 20,
    rating: 4.8
  },
  {
    id: 'p9',
    name: 'Galaxy Ultra S24',
    description: 'Titanium build, built-in S Pen, and the most powerful processor in a Galaxy.',
    price: 129999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400',
    stock: 18,
    rating: 4.9
  },
  {
    id: 'p5',
    name: 'Indigo Slim Fit Denim',
    description: 'Stretchable premium denim with reinforced stitching.',
    price: 2499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400',
    stock: 50,
    rating: 4.4
  },
  {
    id: 'p10',
    name: 'Midnight Velvet Blazer',
    description: 'Exquisite velvet blazer for formal occasions and elite gatherings.',
    price: 12999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400',
    stock: 15,
    rating: 4.7
  },
  {
    id: 'p11',
    name: 'Arctic Parka Jacket',
    description: 'Heavy-duty winter protection with premium down filling and waterproof shell.',
    price: 8999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=400',
    stock: 25,
    rating: 4.6
  },
  {
    id: 'p4',
    name: 'CloudComfort Gaming Chair',
    description: 'Ergonomic design with massager and multi-tilt functionality.',
    price: 18999,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400',
    stock: 8,
    rating: 4.9
  },
  {
    id: 'p12',
    name: 'Smart Ambient Lamp',
    description: 'Voice-controlled RGB lamp with 16 million colors and sleep tracking.',
    price: 3499,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400',
    stock: 40,
    rating: 4.5
  },
  {
    id: 'p13',
    name: 'Minimalist Oak Desk',
    description: 'Solid oak wood desk with integrated cable management and hidden drawers.',
    price: 24999,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400',
    stock: 12,
    rating: 4.8
  },
  {
    id: 'p3',
    name: 'Cognac Leather Messenger',
    description: 'Handcrafted premium leather bag for professionals.',
    price: 4500,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400',
    stock: 100,
    rating: 4.2
  },
  {
    id: 'p14',
    name: 'Titanium Chronograph',
    description: 'Luxury timepiece with sapphire crystal and automatic movement.',
    price: 45999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400',
    stock: 5,
    rating: 4.9
  },
  {
    id: 'p15',
    name: 'Carbon Fiber Wallet',
    description: 'RFID-blocking slim wallet made from aerospace-grade carbon fiber.',
    price: 2999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400',
    stock: 60,
    rating: 4.6
  }
];