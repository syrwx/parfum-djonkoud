
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Order, OrderStatus, ContactInfo, SiteSettings, Coupon } from '../types';
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
  updateContactInfo: (info: ContactInfo) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  addCoupon: (coupon: Partial<Coupon>) => Promise<boolean>;
  deleteCoupon: (id: string) => Promise<void>;
  refreshCoupons: () => void;
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
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  // Fonction pour charger les produits depuis l'API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(PRODUCTS); 
        }
      } else {
         setProducts(PRODUCTS);
      }
    } catch (error) {
      console.error("Erreur chargement produits:", error);
      setProducts(PRODUCTS);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons', { headers: { 'Cache-Control': 'no-cache' } });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error("Erreur chargement coupons:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCoupons();
  }, []);

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "ACI 2000, Rue 450, Bamako, Mali",
    phone: "+223 70 00 00 00",
    email: "contact@djonkoud.ml",
    hours: "Lun - Sam : 09h00 - 19h00",
    instagram: "djonkoud_parfum",
    facebook: "DjonkoudOfficial",
    twitter: "@djonkoud",
    whatsAppAgents: [
      {
        id: '1',
        name: 'Service Client Bamako',
        phone: '+223 70 00 00 00',
        role: 'general',
        active: true
      }
    ]
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    heroTitle: "L'Âme du Mali",
    heroSubtitle: "Mali • Tradition • Luxe",
    heroImage: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop",
    heroSlogan: SLOGANS[0]
  });

  // ✅ SAUVEGARDE STRICTE
  const addProduct = async (product: Product): Promise<boolean> => {
    const toastId = toast.loading('Sauvegarde sur le serveur...');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      if (!res.ok) throw new Error('Erreur API');

      const savedProduct = await res.json();
      setProducts(prev => [...prev, savedProduct]);
      
      toast.success('Produit créé avec succès !', { id: toastId });
      return true;
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      toast.error("Échec sauvegarde. Vérifiez la taille de l'image (<50Mo).", { id: toastId });
      return false;
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<boolean> => {
    const toastId = toast.loading('Mise à jour...');
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });

      if (!res.ok) throw new Error('Erreur API');
      
      const savedProduct = await res.json();
      setProducts(prev => prev.map(p => p.id === id ? savedProduct : p));
      
      toast.success('Produit mis à jour définitivement !', { id: toastId });
      return true;
    } catch (error) {
      console.error("Erreur maj:", error);
      toast.error("Échec mise à jour serveur", { id: toastId });
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    const toastId = toast.loading('Suppression...');
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if(!res.ok) throw new Error("Erreur");
      
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Produit supprimé définitivement', { id: toastId });
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Erreur lors de la suppression", { id: toastId });
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
    } catch (error) {
      console.error("Erreur maj stock:", error);
    }
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    }).catch(console.error);
  };

  const updateContactInfo = (info: ContactInfo) => {
    setContactInfo(info);
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
  };

  // --- COUPON MANAGEMENT ---
  const addCoupon = async (coupon: Partial<Coupon>): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erreur');
      }
      const newCoupon = await res.json();
      setCoupons(prev => [...prev, newCoupon]);
      toast.success("Code promo créé");
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      setCoupons(prev => prev.filter(c => c.id !== id));
      toast.success("Code supprimé");
    } catch (e) {
      toast.error("Erreur suppression");
    }
  };

  return (
    <StoreContext.Provider value={{ 
      products, 
      orders, 
      coupons,
      contactInfo,
      siteSettings,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      updateStock,
      updateOrderStatus,
      updateContactInfo,
      updateSiteSettings,
      addCoupon,
      deleteCoupon,
      refreshCoupons: fetchCoupons
    }}>
      {children}
    </StoreContext.Provider>
  );
};
