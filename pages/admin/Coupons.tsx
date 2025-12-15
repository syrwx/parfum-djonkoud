
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import Button from '../../components/ui/Button';
import { Plus, Trash2, Ticket, X } from 'lucide-react';
import { CURRENCY } from '../../constants';

const CouponsManager: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || value <= 0) return;

    const success = await addCoupon({
      code,
      type,
      value,
      active: true
    });

    if (success) {
      setCode('');
      setValue(0);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white">Codes Promotionnels</h1>
          <p className="text-neutral-400 mt-2">Gérez les remises et offres spéciales.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Créer un Code</Button>
      </div>

      <div className="bg-black border border-amber-900/30 overflow-hidden">
        {coupons.length === 0 ? (
           <div className="p-12 text-center text-neutral-500">
             <Ticket size={48} className="mx-auto mb-4 opacity-30" />
             <p>Aucun code promo actif.</p>
           </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-900 text-amber-100 text-xs uppercase tracking-widest">
                <th className="p-4 border-b border-neutral-800">Code</th>
                <th className="p-4 border-b border-neutral-800">Type</th>
                <th className="p-4 border-b border-neutral-800">Valeur</th>
                <th className="p-4 border-b border-neutral-800">Statut</th>
                <th className="p-4 border-b border-neutral-800 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="p-4 font-mono text-white font-bold tracking-wider">{coupon.code}</td>
                  <td className="p-4 text-neutral-400 text-sm">
                    {coupon.type === 'percent' ? 'Pourcentage (%)' : 'Montant Fixe'}
                  </td>
                  <td className="p-4 text-amber-500 font-bold">
                    {coupon.type === 'percent' ? `-${coupon.value}%` : `-${coupon.value.toLocaleString()} ${CURRENCY}`}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-900/20 text-green-500 text-xs uppercase font-bold border border-green-900/50">
                      Actif
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => { if(confirm('Supprimer ce code ?')) deleteCoupon(coupon.id) }} 
                      className="text-neutral-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Création */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 w-full max-w-md border border-amber-900/30 p-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white"><X size={24} /></button>
            <h2 className="text-xl font-serif text-amber-500 mb-6 flex items-center gap-2"><Ticket size={20}/> Nouveau Code Promo</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-amber-100 text-xs uppercase mb-2">Code (ex: NOEL2024)</label>
                <input 
                  type="text" 
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none font-mono uppercase tracking-widest" 
                  placeholder="CODE"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-100 text-xs uppercase mb-2">Type de remise</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}
                    className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="percent">Pourcentage (%)</option>
                    <option value="fixed">Montant ({CURRENCY})</option>
                  </select>
                </div>
                <div>
                  <label className="block text-amber-100 text-xs uppercase mb-2">Valeur</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={value || ''}
                    onChange={e => setValue(parseInt(e.target.value))}
                    className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit">Créer le code</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManager;
