
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

export interface Billboard {
  active: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  image: string;
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
  CASH = 'CASH',
  WHATSAPP = 'WHATSAPP'
}

export interface PaymentMethodConfig {
  id: PaymentMethod;
  name: string;
  active: boolean;
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
  discountApplied?: {
    code: string;
    amount: number;
  };
}

export interface WhatsAppAgent {
  id: string;
  name: string; 
  phone: string;
  role: 'retail' | 'export' | 'wholesale' | 'general';
  active: boolean;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  telegram?: string;
  whatsAppAgents: WhatsAppAgent[];
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroSlogan: string;
  paymentMethods: PaymentMethodConfig[];
  wholesaleThreshold: number;
  billboard?: Billboard;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
}
