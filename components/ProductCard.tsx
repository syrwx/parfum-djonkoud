import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { CURRENCY } from '../constants';
import { ShoppingBag, Star, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  if (!product) return null;
  
  const isOutOfStock = (product.stock || 0) <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) {
      toast.error('Ce produit est actuellement en rupture de stock.');
      return;
    }
    addToCart(product);
    toast.success(`${product.name || 'Produit'} ajouté au panier`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block relative">
      <div className={`relative bg-neutral-900 aspect-[3/4] overflow-hidden border transition-all duration-700 ${isOutOfStock ? 'border-neutral-900 opacity-60' : 'border-neutral-800 group-hover:border-amber-700/40 shadow-2xl shadow-black'}`}>
        <img 
          src={product.image || 'https://via.placeholder.com/800x1000?text=Indisponible'} 
          alt={product.name || 'Produit'} 
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-1000 transform ${isOutOfStock ? 'grayscale opacity-30' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'}`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity"></div>
        
        {product.logoOverlay && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 opacity-60 pointer-events-none mix-blend-overlay">
            <img 
              src={product.logoOverlay} 
              alt="Logo" 
              loading="lazy"
              className="w-full h-auto object-contain filter brightness-125" 
            />
          </div>
        )}

        {!isOutOfStock && (
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-6 right-6 bg-amber-600 text-white p-4 rounded-none opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-amber-500 z-20 shadow-2xl shadow-black/80"
          >
            <ShoppingBag size={22} />
          </button>
        )}

        <div className="absolute top-6 left-6">
          <div className="bg-black/60 backdrop-blur-md border border-amber-900/30 px-4 py-1.5 text-[9px] uppercase tracking-[0.3em] text-amber-200 font-bold">
            {product.category || 'Collection'}
          </div>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-red-950/40 backdrop-blur-sm border border-red-500/30 px-6 py-2 text-[10px] font-black uppercase tracking-[0.5em] text-red-500 flex items-center gap-2">
               <AlertCircle size={12} /> Épuisé
             </div>
          </div>
        )}
      </div>

      <div className="pt-6 space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className={`font-serif text-xl tracking-tight leading-tight transition-colors duration-500 ${isOutOfStock ? 'text-neutral-600' : 'text-amber-50 group-hover:text-amber-500'}`}>
            {product.name || 'Sans nom'}
          </h3>
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-900/10 px-2 py-0.5 border border-amber-900/20">
             <Star size={12} fill="currentColor" />
             <span className="text-[10px] font-bold font-mono">{(product.rating || 0).toFixed(1)}</span>
          </div>
        </div>
        <p className={`text-xs font-light line-clamp-2 leading-relaxed ${isOutOfStock ? 'text-neutral-700' : 'text-neutral-500'}`}>
          {product.description || ''}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <p className={`text-lg font-bold font-mono tracking-tighter ${isOutOfStock ? 'text-neutral-700 line-through' : 'text-amber-500'}`}>
            {(product.price || 0).toLocaleString()} <span className="text-[10px] ml-0.5">{CURRENCY}</span>
          </p>
          <div className="h-px flex-grow bg-neutral-900"></div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;