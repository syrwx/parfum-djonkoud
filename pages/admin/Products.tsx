import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import Button from '../../components/ui/Button';
import { Edit2, Trash2, Plus, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductsManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct({
        name: '',
        price: 0,
        category: 'Encens',
        description: '',
        story: '',
        notes: [],
        image: 'https://picsum.photos/800/800', // Default placeholder
        rating: 5,
        stock: 0,
        logoOverlay: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct.id) {
      updateProduct(editingProduct.id, editingProduct);
      toast.success('Produit mis à jour');
    } else {
      addProduct({ ...editingProduct, id: Date.now().toString(), notes: editingProduct.notes || [] } as Product);
      toast.success('Nouveau produit créé');
    }
    closeModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-white">Gestion des Produits</h1>
        <Button onClick={() => openModal()}><Plus size={18} /> Nouveau Parfum</Button>
      </div>

      <div className="bg-black border border-amber-900/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-900 text-amber-100 text-xs uppercase tracking-widest">
              <th className="p-4 border-b border-neutral-800">Produit</th>
              <th className="p-4 border-b border-neutral-800">Catégorie</th>
              <th className="p-4 border-b border-neutral-800">Prix</th>
              <th className="p-4 border-b border-neutral-800">Stock</th>
              <th className="p-4 border-b border-neutral-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-neutral-900/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover border border-neutral-800" />
                    <span className="text-neutral-200 font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-neutral-400 text-sm">{product.category}</td>
                <td className="p-4 text-amber-500 font-mono">{product.price.toLocaleString()}</td>
                <td className="p-4">
                   <span className={`px-2 py-1 text-xs font-bold ${product.stock < 10 ? 'text-red-500 bg-red-900/10' : 'text-green-500 bg-green-900/10'}`}>
                     {product.stock}
                   </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openModal(product)} className="text-neutral-400 hover:text-amber-500"><Edit2 size={18} /></button>
                  <button onClick={() => { if(confirm('Supprimer ce produit ?')) deleteProduct(product.id) }} className="text-neutral-400 hover:text-red-500"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-amber-900/30 p-6 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-neutral-500 hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-serif text-amber-500 mb-6">{editingProduct.id ? 'Modifier le Parfum' : 'Créer un Parfum'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-amber-100 text-xs uppercase mb-2">Nom du produit</label>
                  <input 
                    type="text" 
                    required
                    value={editingProduct.name || ''} 
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-amber-100 text-xs uppercase mb-2">Prix (FCFA)</label>
                  <input 
                    type="number" 
                    required
                    value={editingProduct.price || 0} 
                    onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                    className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                  <label className="block text-amber-100 text-xs uppercase mb-2">Catégorie</label>
                  <select 
                    value={editingProduct.category || 'Encens'} 
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Encens">Encens</option>
                    <option value="Parfum d'Intérieur">Parfum d'Intérieur</option>
                    <option value="Bougie Parfumée">Bougie Parfumée</option>
                    <option value="Coffret Prestige">Coffret Prestige</option>
                    <option value="Matière Première">Matière Première</option>
                  </select>
                </div>
                <div>
                  <label className="block text-amber-100 text-xs uppercase mb-2">Stock Initial</label>
                  <input 
                    type="number" 
                    value={editingProduct.stock || 0} 
                    onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                    className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-100 text-xs uppercase mb-2">URL Image</label>
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    value={editingProduct.image || ''} 
                    onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                    className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                  />
                  <div className="w-12 h-12 bg-neutral-800 flex-shrink-0">
                    {editingProduct.image && <img src={editingProduct.image} className="w-full h-full object-cover" />}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-amber-100 text-xs uppercase mb-2">URL Logo / Branding Overlay (Optionnel)</label>
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    value={editingProduct.logoOverlay || ''} 
                    onChange={e => setEditingProduct({...editingProduct, logoOverlay: e.target.value})}
                    className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                    placeholder="https://..."
                  />
                  <div className="w-12 h-12 bg-neutral-800 flex-shrink-0 flex items-center justify-center border border-neutral-700">
                    {editingProduct.logoOverlay && <img src={editingProduct.logoOverlay} className="max-w-full max-h-full object-contain" />}
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">Ce logo s'affichera en superposition sur l'image du produit.</p>
              </div>

              <div>
                <label className="block text-amber-100 text-xs uppercase mb-2">Description Courte</label>
                <textarea 
                  value={editingProduct.description || ''} 
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none h-20" 
                />
              </div>

              <div>
                <label className="block text-amber-100 text-xs uppercase mb-2">Storytelling (Description Longue)</label>
                <textarea 
                  value={editingProduct.story || ''} 
                  onChange={e => setEditingProduct({...editingProduct, story: e.target.value})}
                  className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none h-24" 
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-neutral-400 hover:text-white">Annuler</button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;