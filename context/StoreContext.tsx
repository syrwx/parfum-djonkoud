import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Order, OrderStatus, ContactInfo, SiteSettings, Coupon } from '../types';
import toast from 'react-hot-toast';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  contactInfo: ContactInfo;
  siteSettings: SiteSettings;
  isLoading: boolean;
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
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialisation avec des tableaux vides pour éviter les erreurs .map()
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "ACI 2000, Bamako, Mali", 
    phone: "+223 70 00 00 00", 
    email: "contact@djonkoud.ml", 
    hours: "Lun - Sam : 09h00 - 19h00", 
    whatsAppAgents: []
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    heroTitle: "L'Âme du Mali", 
    heroSubtitle: "Tradition & Luxe", 
    heroImage: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop", 
    heroSlogan: "L'essence du Mali.", 
    wholesaleThreshold: 200000, 
    paymentMethods: [
      { id: 'WAVE' as any, name: 'Wave', active: true },
      { id: 'ORANGE_MONEY' as any, name: 'Orange Money', active: true },
      { id: 'WHATSAPP' as any, name: 'WhatsApp', active: true }
    ]
  });

  const safeJsonFetch = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      }
      return null;
    } catch (e) {
      console.error(`Fetch error for ${url}:`, e);
      return null;
    }
  };

  const refreshSettings = useCallback(async () => {
    const data = await safeJsonFetch('/api/settings');
    if (data) {
      if (data.contactInfo) setContactInfo(data.contactInfo);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    const data = await safeJsonFetch('/api/products');
    setProducts(Array.isArray(data) ? data : []);
  }, []);

  const refreshOrders = useCallback(async () => {
    const data = await safeJsonFetch('/api/orders');
    setOrders(Array.isArray(data) ? data : []);
  }, []);

  const refreshCoupons = useCallback(async () => {
    const data = await safeJsonFetch('/api/coupons');
    setCoupons(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await Promise.all([refreshSettings(), refreshProducts(), refreshOrders(), refreshCoupons()]);
      } catch (e) {
        console.error("Initialization error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [refreshSettings, refreshProducts, refreshOrders, refreshCoupons]);

  // Méthodes de mise à jour sécurisées...
  const addProduct = async (product: Product): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) { await refreshProducts(); return true; }
      return false;
    } catch (e) { return false; }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) { await refreshProducts(); return true; }
      return false;
    } catch (e) { return false; }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      await refreshProducts();
    } catch (e) { console.error(e); }
  };

  const updateContactInfo = async (info: ContactInfo) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactInfo: info, siteSettings })
      });
      if (res.ok) setContactInfo(info);
    } catch (e) { console.error(e); }
  };

  const updateSiteSettings = async (settings: SiteSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactInfo, siteSettings: settings })
      });
      if (res.ok) setSiteSettings(settings);
    } catch (e) { console.error(e); }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      await refreshProducts();
    } catch (e) { console.error(e); }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      await refreshOrders();
    } catch (e) { console.error(e); }
  };

  const addCoupon = async (coupon: Partial<Coupon>): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon)
      });
      if (res.ok) { await refreshCoupons(); return true; }
      return false;
    } catch (e) { return false; }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      await refreshCoupons();
    } catch (e) { console.error(e); }
  };

  return (
    <StoreContext.Provider value={{ 
      products, orders, coupons, contactInfo, siteSettings, isLoading,
      addProduct, updateProduct, deleteProduct, updateStock,
      updateOrderStatus, updateContactInfo, updateSiteSettings,
      addCoupon, deleteCoupon, refreshCoupons,
      refreshProducts, refreshOrders, refreshSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};