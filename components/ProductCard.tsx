import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { CURRENCY } from '../constants';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block relative">
      <div className="relative bg-neutral-900 aspect-[3/4] overflow-hidden border border-neutral-800 group-hover:border-amber-700/50 transition-colors duration-500">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Logo Overlay */}
        {product.logoOverlay && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 opacity-80 pointer-events-none mix-blend-overlay">
            <img src={product.logoOverlay} alt="Branding" className="w-full h-auto object-contain drop-shadow-lg filter brightness-150" />
          </div>
        )}

        {/* Quick Add Button */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-amber-600 text-white p-3 rounded-none opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-amber-500 z-20 shadow-lg shadow-black/50"
        >
          <ShoppingBag size={20} />
        </button>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm border border-amber-900/30 px-3 py-1 text-xs uppercase tracking-widest text-amber-200">
          {product.category}
        </div>
      </div>

      <div className="pt-4 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-lg text-amber-100 group-hover:text-amber-500 transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-amber-600">
             <Star size={12} fill="currentColor" />
             <span className="text-xs">{product.rating}</span>
          </div>
        </div>
        <p className="text-sm text-neutral-500 line-clamp-1">{product.description}</p>
        <p className="text-amber-500 font-medium font-mono pt-1">
          {product.price.toLocaleString('fr-FR')} {CURRENCY}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;