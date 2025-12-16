
import React, { useEffect } from 'react';
import { HashRouter, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AiGuide from './pages/AiGuide';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/Products';
import OrdersManager from './pages/admin/Orders';
import InventoryManager from './pages/admin/Inventory';
import CouponsManager from './pages/admin/Coupons';
import Settings from './pages/admin/Settings';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { Toaster } from 'react-hot-toast';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Wrapper for public pages to include Navbar/Footer/WhatsApp
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-neutral-950 text-amber-50 overflow-x-hidden selection:bg-amber-900 selection:text-white">
    <Navbar />
    <main className="flex-grow pt-20">
      {children}
    </main>
    <Footer />
    <FloatingWhatsApp />
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <HashRouter>
            <ScrollToTop />
            <Switch>
              {/* Admin Routes - Login first for specificity */}
              <Route path="/admin/login" component={AdminLogin} />
              
              <Route path="/admin" render={() => (
                <AdminLayout>
                  <Switch>
                    <Route exact path="/admin"><Redirect to="/admin/dashboard" /></Route>
                    <Route path="/admin/dashboard" component={Dashboard} />
                    <Route path="/admin/products" component={ProductsManager} />
                    <Route path="/admin/orders" component={OrdersManager} />
                    <Route path="/admin/inventory" component={InventoryManager} />
                    <Route path="/admin/coupons" component={CouponsManager} />
                    <Route path="/admin/settings" component={Settings} />
                  </Switch>
                </AdminLayout>
              )} />

              {/* Public Routes */}
              <Route exact path="/"><PublicLayout><Home /></PublicLayout></Route>
              <Route path="/shop"><PublicLayout><Shop /></PublicLayout></Route>
              <Route path="/product/:id"><PublicLayout><ProductDetail /></PublicLayout></Route>
              <Route path="/cart"><PublicLayout><Cart /></PublicLayout></Route>
              <Route path="/checkout"><PublicLayout><Checkout /></PublicLayout></Route>
              <Route path="/guide"><PublicLayout><AiGuide /></PublicLayout></Route>
              <Route path="/about"><PublicLayout><About /></PublicLayout></Route>
              <Route path="/contact"><PublicLayout><Contact /></PublicLayout></Route>
              <Route path="/legal"><PublicLayout><Legal /></PublicLayout></Route>
            </Switch>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1c1917',
                  color: '#D4AF37',
                  border: '1px solid #8B5A2B',
                },
              }}
            />
          </HashRouter>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
};

export default App;