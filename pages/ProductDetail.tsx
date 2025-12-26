
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CURRENCY, BRAND_NAME } from '../constants';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { Star, ShieldCheck, Truck, Tag, AlertTriangle, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useStore();
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const product = (products || []).find(p => p.id === id);
  
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | ${BRAND_NAME}`;
    }
  }, [product]);

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: `${product.name} | DJONKOUD PARFUM`,
      text: `Découvrez "${product.name}", une essence d'exception chez DJONKOUD PARFUM Mali. ✨`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié dans le presse-papier !');
      }
    } catch (err) {
      console.error('Erreur de partage:', err);
    }
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl text-amber-500 font-serif mb-4">Produit introuvable</h2>
        <Link to="/collection"><Button variant="outline">Retour à la boutique</Button></Link>
      </div>
    );
  }

  const isOutOfStock = (product.stock || 0) <= 0;

  return (
    <div className="bg-neutral-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Section with Progressive Zoom */}
          <div className="relative aspect-[4/5] bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl group">
            <img 
              src={product.image} 
              alt={product.name} 
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-[2000ms] ease-in-out transform ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-40' : ''}`} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            
            {product.logoOverlay && (
              <div className="absolute bottom-6 right-6 w-24 h-24 z-10 pointer-events-none animate-fade-in">
                 <img src={product.logoOverlay} alt="Logo" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/60 backdrop-blur-sm border border-red-500/50 px-8 py-3 text-white font-serif text-2xl uppercase tracking-[0.2em] shadow-2xl transform -rotate-12">
                  Épuisé
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div className="relative">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-amber-500 uppercase tracking-widest text-xs font-bold block">{product.category || 'Signature'}</span>
                  {isOutOfStock && (
                    <span className="bg-red-950/50 border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                      <AlertTriangle size={10} /> Rupture de stock
                    </span>
                  )}
                </div>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl mb-4 text-amber-50 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className={`text-2xl font-mono ${isOutOfStock ? 'text-neutral-600 line-through' : 'text-amber-500'}`}>
                  {(product.price || 0).toLocaleString('fr-FR')} {CURRENCY}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-medium">{product.rating}/5.0</span>
                </div>
              </div>
            </div>

            <div className="prose prose-invert border-l-2 border-amber-900/50 pl-6">
              {product.story && <p className="text-lg text-neutral-300 italic font-serif leading-relaxed">"{product.story}"</p>}
              <p className="text-sm text-neutral-400 mt-4 not-italic leading-relaxed">{product.description}</p>
            </div>

            {product.notes && product.notes.length > 0 && (
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2 font-black">
                  <Tag size={12} /> Notes Olfactives
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.notes.map((note, idx) => (
                    <span 
                      key={idx} 
                      className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-amber-200 text-[10px] uppercase tracking-widest hover:border-amber-500/50 transition-all cursor-default"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => !isOutOfStock && addToCart(product)} 
                fullWidth 
                className={`text-lg py-5 flex-grow ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isOutOfStock}
              >
                {!isOutOfStock ? 'Ajouter au Panier' : 'Indisponible'}
              </Button>
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-8 py-5 bg-black border border-amber-900/40 text-amber-500 hover:bg-amber-950/20 transition-all group"
              >
                <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                <span className="uppercase text-[10px] tracking-[0.2em] font-black">Partager</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-amber-600" />
                <span>Authenticité</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-amber-600" />
                <span>Expédition Bamako</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
