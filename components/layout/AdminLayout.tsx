
import React from 'react';
// Replaced Redirect with Navigate as per react-router-dom v6 updates
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Layers, Settings, Ticket } from 'lucide-react';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Replaced Redirect with Navigate for react-router-dom v6
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Produits', icon: Package },
    { path: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
    { path: '/admin/inventory', label: 'Stocks', icon: Layers },
    { path: '/admin/coupons', label: 'Codes Promo', icon: Ticket },
    { path: '/admin/settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-900 text-amber-50">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-amber-900/30 flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center justify-center border-b border-amber-900/30">
          <Link to="/">
            <Logo className="h-8" />
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-none transition-all ${
                location.pathname === item.path 
                  ? 'bg-amber-900/20 text-amber-400 border-l-2 border-amber-500' 
                  : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-amber-900/30">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm tracking-wide">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;