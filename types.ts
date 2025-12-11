export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  story: string;
  notes: string[];
  image: string;
  rating: number;
  sku?: string;
  unit?: string;
  stock: number;
  logoOverlay?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export enum PaymentMethod {
  WAVE = 'WAVE',
  ORANGE_MONEY = 'ORANGE_MONEY',
  CARD = 'CARD',
  CASH = 'CASH'
}

export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  date: string;
  shippingAddress?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroSlogan: string;
}