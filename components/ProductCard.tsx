
import React, { useState } from 'react';
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
  const [loaded, setLoaded] = useState(false);
  
  if (!product) return null;
  
  const isOutOfStock = (product.stock || 0) <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) {
      toast.error('Ce produit est en rupture.');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} ajouté`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block relative animate-fade-in">
      <div className={`relative bg-neutral-900 aspect-[3/4] overflow-hidden border transition-all duration-700 ${isOutOfStock ? 'border-neutral-900 opacity-60' : 'border-neutral-800 group-hover:border-amber-700/40 shadow-2xl'}`}>
        <img 
          src={product.image} 
          alt={product.name} 
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-[1500ms] ease-out transform ${loaded ? 'opacity-70 scale-100' : 'opacity-0 scale-110'} group-hover:opacity-100 group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
        
        {!isOutOfStock && (
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-6 right-6 bg-amber-600 text-white p-4 rounded-none opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-amber-500 z-20 shadow-2xl"
          >
            <ShoppingBag size={20} />
          </button>
        )}

        <div className="absolute top-6 left-6">
          <div className="bg-black/60 backdrop-blur-md border border-amber-900/30 px-3 py-1 text-[8px] uppercase tracking-[0.3em] text-amber-200 font-black shadow-lg">
            {product.category}
          </div>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-red-950/60 backdrop-blur-sm border border-red-500/30 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-red-500">
               Épuisé
             </div>
          </div>
        )}
      </div>

      <div className="pt-6 space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className={`font-serif text-lg tracking-tight transition-colors duration-500 ${isOutOfStock ? 'text-neutral-600' : 'text-amber-50 group-hover:text-amber-500'}`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-amber-600 bg-amber-950/10 px-2 py-0.5 border border-amber-900/20">
             <Star size={10} fill="currentColor" />
             <span className="text-[9px] font-black font-mono">{product.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <p className={`text-base font-bold font-mono tracking-tighter ${isOutOfStock ? 'text-neutral-700 line-through' : 'text-amber-500'}`}>
            {(product.price || 0).toLocaleString()} <span className="text-[10px] ml-0.5">{CURRENCY}</span>
          </p>
          <div className="h-[0.5px] flex-grow bg-neutral-900 group-hover:bg-amber-900/40 transition-colors"></div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
