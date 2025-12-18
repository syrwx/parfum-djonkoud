
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, OrderStatus, ContactInfo, SiteSettings, Coupon, PaymentMethod } from '../types';
import { PRODUCTS, MOCK_ORDERS, SLOGANS } from '../constants';
import toast from 'react-hot-toast';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  contactInfo: ContactInfo;
  siteSettings: SiteSettings;
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateContactInfo: (info: ContactInfo) => Promise<void>;
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  addCoupon: (coupon: Partial<Coupon>) => Promise<boolean>;
  deleteCoupon: (id: string) => Promise<void>;
  refreshCoupons: () => void;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "ACI 2000, Bamako, Mali",
    phone: "+223 70 00 00 00",
    email: "contact@djonkoud.ml",
    hours: "Lun - Sam : 09h00 - 19h00",
    whatsAppAgents: [{ id: '1', name: 'Service Client', phone: '+223 70 00 00 00', role: 'general', active: true }]
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    heroTitle: "L'Âme du Mali",
    heroSubtitle: "Mali • Tradition • Luxe",
    heroImage: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop",
    heroSlogan: SLOGANS[0],
    paymentMethods: [
      { id: PaymentMethod.WAVE, name: 'Wave / Mobile Money', active: true },
      { id: PaymentMethod.ORANGE_MONEY, name: 'Orange Money', active: true },
      { id: PaymentMethod.CARD, name: 'Carte Bancaire / VISA', active: true },
      { id: PaymentMethod.CASH, name: 'Paiement à la livraison', active: true }
    ]
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          if (data.contactInfo) setContactInfo(data.contactInfo);
          if (data.siteSettings) setSiteSettings(data.siteSettings);
        }
      }
    } catch (e) { console.error("Erreur settings:", e); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.length > 0 ? data : PRODUCTS);
      }
    } catch (e) { setProducts(PRODUCTS); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setOrders(await res.json());
      else if (orders.length === 0) setOrders(MOCK_ORDERS);
    } catch (e) { if (orders.length === 0) setOrders(MOCK_ORDERS); }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) setCoupons(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchSettings();
    fetchProducts();
    fetchOrders();
    fetchCoupons();
  }, []);

  const addProduct = async (product: Product): Promise<boolean> => {
    const toastId = toast.loading('Sauvegarde...');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error();
      await fetchProducts();
      toast.success('Produit créé !', { id: toastId });
      return true;
    } catch (e) {
      toast.error("Échec sauvegarde", { id: toastId });
      return false;
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<boolean> => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      await fetchProducts();
      return true;
    } catch (e) { return false; }
  };

  const deleteProduct = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    await fetchProducts();
  };

  const updateContactInfo = async (info: ContactInfo) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactInfo: info, siteSettings })
      });
      if (res.ok) {
        setContactInfo(info);
        toast.success("Informations de contact sauvegardées");
      }
    } catch (e) { toast.error("Erreur serveur"); }
  };

  const updateSiteSettings = async (settings: SiteSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactInfo, siteSettings: settings })
      });
      if (res.ok) {
        setSiteSettings(settings);
        toast.success("Paramètres sauvegardés");
      }
    } catch (e) { toast.error("Erreur serveur"); }
  };

  const updateStock = async (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock })
    });
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  };

  const addCoupon = async (coupon: Partial<Coupon>): Promise<boolean> => {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon)
    });
    if (res.ok) { await fetchCoupons(); return true; }
    return false;
  };

  const deleteCoupon = async (id: string) => {
    await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
    await fetchCoupons();
  };

  return (
    <StoreContext.Provider value={{ 
      products, orders, coupons, contactInfo, siteSettings,
      addProduct, updateProduct, deleteProduct, updateStock,
      updateOrderStatus, updateContactInfo, updateSiteSettings,
      addCoupon, deleteCoupon, refreshCoupons: fetchCoupons,
      refreshProducts: fetchProducts, refreshOrders: fetchOrders,
      refreshSettings: fetchSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};
