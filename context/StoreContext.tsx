import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Order, OrderStatus, ContactInfo, SiteSettings } from '../types';
import { PRODUCTS, MOCK_ORDERS, SLOGANS } from '../constants';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  contactInfo: ContactInfo;
  siteSettings: SiteSettings;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateContactInfo: (info: ContactInfo) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
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
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  // =================================================================
  // ⚠️ CONFIGURATION CRITIQUE - WHATSAPP ⚠️
  // C'est ici que vous définissez le numéro qui recevra les commandes.
  // =================================================================
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "ACI 2000, Rue 450, Bamako, Mali",
    
    // 👇 REMPLACEZ LE NUMÉRO CI-DESSOUS PAR LE VÔTRE 👇
    // Format : +223 suivi de votre numéro (ex: +223 76 00 00 00)
    // C'est ce numéro qui s'ouvrira quand le client clique sur "Commander sur WhatsApp"
    phone: "+223 70 00 00 00", 
    
    email: "contact@djonkoud.ml",
    hours: "Lun - Sam : 09h00 - 19h00",
    instagram: "djonkoud_parfum",
    facebook: "DjonkoudOfficial",
    twitter: "@djonkoud"
  });

  // Données d'apparence par défaut
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    heroTitle: "L'Âme du Mali",
    heroSubtitle: "Mali • Tradition • Luxe",
    heroImage: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop",
    heroSlogan: SLOGANS[0]
  });

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateContactInfo = (info: ContactInfo) => {
    setContactInfo(info);
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
  };

  return (
    <StoreContext.Provider value={{ 
      products, 
      orders, 
      contactInfo,
      siteSettings,
      addProduct, 
      updateProduct, 
      deleteProduct, 
      updateStock,
      updateOrderStatus,
      updateContactInfo,
      updateSiteSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};