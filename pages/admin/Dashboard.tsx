import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CURRENCY } from '../../constants';
import { DollarSign, ShoppingBag, Package, AlertTriangle } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; alert?: boolean }> = ({ title, value, icon, alert }) => (
  <div className={`p-6 bg-black border ${alert ? 'border-red-900/50 bg-red-900/10' : 'border-amber-900/30'} flex items-start justify-between`}>
    <div>
      <p className="text-neutral-400 text-xs uppercase tracking-widest mb-2">{title}</p>
      <h3 className={`text-2xl font-serif ${alert ? 'text-red-400' : 'text-amber-500'}`}>{value}</h3>
    </div>
    <div className={`p-3 ${alert ? 'bg-red-900/20 text-red-500' : 'bg-amber-900/20 text-amber-500'} rounded-none`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { orders, products } = useStore();

  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'preparing' || o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-amber-900/30 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-white">Tableau de Bord</h1>
          <p className="text-neutral-400 mt-2">Aperçu de l'activité commerciale.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Chiffre d'Affaires" 
          value={`${totalRevenue.toLocaleString()} ${CURRENCY}`} 
          icon={<DollarSign size={24} />} 
        />
        <StatCard 
          title="Commandes en cours" 
          value={pendingOrders} 
          icon={<ShoppingBag size={24} />} 
        />
        <StatCard 
          title="Total Produits" 
          value={products.length} 
          icon={<Package size={24} />} 
        />
        <StatCard 
          title="Alerte Stock" 
          value={lowStockProducts} 
          icon={<AlertTriangle size={24} />} 
          alert={lowStockProducts > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black border border-amber-900/30 p-6">
          <h3 className="text-lg font-serif text-amber-100 mb-6">Dernières Commandes</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center py-3 border-b border-neutral-800 last:border-0">
                <div>
                  <p className="text-sm text-white font-medium">{order.customerName}</p>
                  <p className="text-xs text-neutral-500">ID: {order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-500">{order.total.toLocaleString()} {CURRENCY}</p>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                    order.status === 'delivered' ? 'border-green-900 text-green-500' : 
                    order.status === 'pending' ? 'border-yellow-900 text-yellow-500' :
                    'border-neutral-800 text-neutral-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black border border-amber-900/30 p-6">
           <h3 className="text-lg font-serif text-amber-100 mb-6">Produits Populaires</h3>
           <div className="space-y-4">
             {products.slice(0, 5).map(product => (
               <div key={product.id} className="flex items-center gap-4 py-2">
                 <img src={product.image} alt={product.name} className="w-10 h-10 object-cover border border-neutral-800" />
                 <div className="flex-1">
                   <p className="text-sm text-white">{product.name}</p>
                   <p className="text-xs text-neutral-500">Stock: {product.stock}</p>
                 </div>
                 <span className="text-sm text-amber-600 font-bold">{product.price.toLocaleString()}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;