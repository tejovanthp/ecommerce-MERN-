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
    id: 'p6',
    name: 'Ultra Slim Flagship Phone',
    description: '120Hz display, 50MP triple camera setup, and lightning fast charging.',
    price: 54999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
    stock: 12,
    rating: 4.7
  }
];