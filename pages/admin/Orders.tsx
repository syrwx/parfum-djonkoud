import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { Eye, Printer, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, refreshOrders } = useStore();

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const handleStatusChange = (id: string, status: string) => {
    updateOrderStatus(id, status as OrderStatus);
    toast.success(`Statut commande ${id} mis à jour`);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'paid': return 'text-blue-400 border-blue-900/30 bg-blue-900/10';
      case 'preparing': return 'text-yellow-400 border-yellow-900/30 bg-yellow-900/10';
      case 'delivered': return 'text-green-400 border-green-900/30 bg-green-900/10';
      case 'cancelled': return 'text-red-400 border-red-900/30 bg-red-900/10';
      default: return 'text-neutral-400 border-neutral-800 bg-neutral-900';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-white">Gestion des Commandes</h1>
        <button onClick={() => refreshOrders()} className="text-amber-500 hover:text-amber-400 flex items-center gap-2 text-sm uppercase font-bold">
          <RefreshCw size={16} /> Actualiser
        </button>
      </div>

      <div className="bg-black border border-amber-900/30 overflow-hidden">
        {(!orders || orders.length === 0) ? (
          <div className="p-8 text-center text-neutral-500">Aucune commande pour le moment.</div>
        ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-900 text-amber-100 text-xs uppercase tracking-widest">
              <th className="p-4 border-b border-neutral-800">ID</th>
              <th className="p-4 border-b border-neutral-800">Client</th>
              <th className="p-4 border-b border-neutral-800">Date</th>
              <th className="p-4 border-b border-neutral-800">Total</th>
              <th className="p-4 border-b border-neutral-800">Statut</th>
              <th className="p-4 border-b border-neutral-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-neutral-900/50 transition-colors">
                <td className="p-4 text-sm font-mono text-neutral-400">{order.id}</td>
                <td className="p-4">
                  <div className="text-white text-sm font-medium">{order.customerName}</div>
                  <div className="text-neutral-500 text-xs">{order.items?.length || 0} articles</div>
                </td>
                <td className="p-4 text-neutral-400 text-sm">
                  {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4 text-amber-500 font-bold">
                  {(order.total || 0).toLocaleString()} FCFA
                </td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-xs uppercase font-bold px-2 py-1 rounded-none border outline-none cursor-pointer ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">En attente</option>
                    <option value="paid">Payée</option>
                    <option value="preparing">En préparation</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>
                <td className="p-4 text-right space-x-3">
                   <button className="text-neutral-400 hover:text-white" title="Voir détails"><Eye size={18} /></button>
                   <button className="text-neutral-400 hover:text-white" title="Imprimer facture"><Printer size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default OrdersManager;