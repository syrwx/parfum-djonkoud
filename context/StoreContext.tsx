
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
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
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
  const [orders, setOrders] = useState<Order[]>([]); // Initialisé vide, rempli par l'API
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  // Fonction pour charger les produits depuis l'API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
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

  // Fonction pour charger les commandes depuis l'API
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        // Fallback si l'API échoue ou est vide au début
        if (orders.length === 0) setOrders(MOCK_ORDERS);
      }
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
      if (orders.length === 0) setOrders(MOCK_ORDERS);
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

  // Chargement initial
  useEffect(() => {
    fetchProducts();
    fetchOrders();
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

      await fetchProducts(); // Recharger depuis la DB pour être sûr
      
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
      
      await fetchProducts(); // Synchro DB
      
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
      
      await fetchProducts(); // Synchro DB
      toast.success('Produit supprimé définitivement', { id: toastId });
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Erreur lors de la suppression", { id: toastId });
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    // Optimistic UI update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      // Pas de fetchProducts ici pour éviter le scintillement lors de la frappe, 
      // mais les données sont envoyées.
    } catch (error) {
      console.error("Erreur maj stock:", error);
      fetchProducts(); // Revert en cas d'erreur
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    // Optimistic
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    try {
        await fetch(`/api/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        // On ne recharge pas tout pour ne pas perdre la position de scroll,
        // la modif est simple.
    } catch (e) {
        console.error(e);
        fetchOrders(); // Revert
    }
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
      await fetchCoupons();
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
      await fetchCoupons();
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
      refreshCoupons: fetchCoupons,
      refreshProducts: fetchProducts,
      refreshOrders: fetchOrders
    }}>
      {children}
    </StoreContext.Provider>
  );
};
