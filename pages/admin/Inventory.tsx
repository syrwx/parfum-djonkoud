import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AlertTriangle, TrendingDown, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryManager: React.FC = () => {
  const { products, updateStock } = useStore();

  const handleStockUpdate = (id: string, val: string) => {
    const num = parseInt(val);
    if (!isNaN(num)) {
      updateStock(id, num);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-white mb-8">Gestion des Stocks</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
         <div className="bg-neutral-900 border border-amber-900/20 p-4 flex items-center gap-4">
            <div className="bg-red-900/20 p-3 text-red-500"><AlertTriangle /></div>
            <div>
              <p className="text-xs uppercase text-neutral-400">Stock Critique</p>
              <p className="text-2xl text-white font-bold">{products.filter(p => p.stock < 10).length}</p>
            </div>
         </div>
      </div>

      <div className="bg-black border border-amber-900/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-900 text-amber-100 text-xs uppercase tracking-widest">
              <th className="p-4 border-b border-neutral-800">Produit</th>
              <th className="p-4 border-b border-neutral-800">SKU</th>
              <th className="p-4 border-b border-neutral-800">Niveau Actuel</th>
              <th className="p-4 border-b border-neutral-800">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-neutral-900/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                   <img src={product.image} className="w-8 h-8 object-cover" />
                   <span className="text-neutral-200">{product.name}</span>
                </td>
                <td className="p-4 text-neutral-500 font-mono text-xs">{product.sku || 'N/A'}</td>
                <td className="p-4">
                  <input 
                    type="number" 
                    value={product.stock}
                    onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                    className="w-24 bg-neutral-900 border border-neutral-700 px-2 py-1 text-white focus:border-amber-500 outline-none text-center"
                  />
                </td>
                <td className="p-4">
                   {product.stock === 0 ? (
                     <span className="text-red-500 text-xs font-bold uppercase flex items-center gap-1"><AlertTriangle size={12} /> Rupture</span>
                   ) : product.stock < 10 ? (
                     <span className="text-orange-500 text-xs font-bold uppercase flex items-center gap-1"><TrendingDown size={12} /> Faible</span>
                   ) : (
                     <span className="text-green-600 text-xs font-bold uppercase flex items-center gap-1"><Layers size={12} /> En Stock</span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManager;