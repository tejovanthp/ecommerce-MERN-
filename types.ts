
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  // Added _id to support MongoDB compatibility and resolve TypeScript property errors
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  credits?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface SaleEvent {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  startDate: string;
  endDate: string;
  image: string;
  isActive: boolean;
  type: 'SALE' | 'EVENT';
}
