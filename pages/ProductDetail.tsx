import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CURRENCY } from '../constants';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { Star, ShieldCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useStore();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl text-amber-500 font-serif mb-4">Produit introuvable</h2>
        <Link to="/shop"><Button variant="outline">Retour à la boutique</Button></Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
      toast.success('Ajouté au panier');
    } else {
      toast.error('Produit en rupture de stock');
    }
  };

  return (
    <div className="bg-neutral-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[4/5] bg-neutral-900 border border-neutral-800 overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            
            {/* Logo Overlay */}
            {product.logoOverlay && (
              <div className="absolute bottom-6 right-6 w-24 h-24 z-10 pointer-events-none">
                 <img src={product.logoOverlay} alt="Logo" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-2 block">{product.category}</span>
                {product.sku && (
                  <span className="text-neutral-500 font-mono text-xs">RÉF: {product.sku}</span>
                )}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-amber-50 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl text-amber-500 font-mono">
                  {product.price.toLocaleString('fr-FR')} {CURRENCY}
                  {product.unit && <span className="text-sm text-neutral-400 font-sans ml-1">/ {product.unit}</span>}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-medium">{product.rating}/5.0</span>
                </div>
              </div>
            </div>

            <div className="prose prose-invert border-l-2 border-amber-900/50 pl-6">
              <p className="text-lg text-neutral-300 italic font-serif">"{product.story}"</p>
              <p className="text-sm text-neutral-400 mt-4 not-italic">{product.description}</p>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-3">Notes Olfactives</h3>
              <div className="flex flex-wrap gap-2">
                {product.notes.map((note, idx) => (
                  <span key={idx} className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-amber-200 text-sm rounded-none">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-800">
              <Button 
                onClick={handleAddToCart} 
                fullWidth 
                className={`text-lg py-4 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Ajouter au Panier' : 'Rupture de stock'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-600" />
                <span>Authenticité Garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-amber-600" />
                <span>Livraison partout à Bamako</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;