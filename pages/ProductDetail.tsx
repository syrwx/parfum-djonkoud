import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CURRENCY, BRAND_NAME } from '../constants';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { Star, ShieldCheck, Truck, Tag, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useStore();
  const { addToCart } = useCart();
  
  const product = (products || []).find(p => p.id === id);
  
  useEffect(() => {
    if (product) {
      const previousTitle = document.title;
      document.title = `${product.name || 'Produit'} | ${BRAND_NAME}`;

      const updateMeta = (name: string, content: string, isProperty = false) => {
        const attribute = isProperty ? 'property' : 'name';
        let element = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attribute, name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content || "");
      };

      updateMeta('description', product.description || "");
      updateMeta('og:title', `${product.name || 'Produit'} - DJONKOUD PARFUM`, true);
      updateMeta('og:description', product.description || "", true);
      updateMeta('og:image', product.image || "", true);
      updateMeta('og:url', window.location.href, true);
      updateMeta('og:type', 'product', true);

      return () => {
        document.title = previousTitle;
      };
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl text-amber-500 font-serif mb-4">Produit introuvable</h2>
        <Link to="/collection"><Button variant="outline">Retour à la boutique</Button></Link>
      </div>
    );
  }

  const isOutOfStock = (product.stock || 0) <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
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
          <div className="relative aspect-[4/5] bg-neutral-900 border border-neutral-800 overflow-hidden">
            <img 
              src={product.image || 'https://via.placeholder.com/800x1000?text=Indisponible'} 
              alt={product.name || 'Produit'} 
              className={`w-full h-full object-cover transition-opacity duration-500 ${isOutOfStock ? 'opacity-40 grayscale' : 'opacity-100'}`} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            
            {product.logoOverlay && (
              <div className="absolute bottom-6 right-6 w-24 h-24 z-10 pointer-events-none">
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
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-amber-500 uppercase tracking-widest text-xs font-bold block">{product.category || 'Signature'}</span>
                  {isOutOfStock && (
                    <span className="bg-red-950/50 border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                      <AlertTriangle size={10} /> Rupture de stock
                    </span>
                  )}
                </div>
                {product.sku && (
                  <span className="text-neutral-500 font-mono text-xs">RÉF: {product.sku}</span>
                )}
              </div>
              <h1 className={`font-serif text-4xl md:text-5xl mb-4 ${isOutOfStock ? 'text-neutral-500' : 'text-amber-50'}`}>
                {product.name || 'Produit sans nom'}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className={`text-2xl font-mono ${isOutOfStock ? 'text-neutral-600 line-through' : 'text-amber-500'}`}>
                  {(product.price || 0).toLocaleString('fr-FR')} {CURRENCY}
                  {product.unit && <span className="text-sm text-neutral-400 font-sans ml-1">/ {product.unit}</span>}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-medium">{(product.rating || 0).toFixed(1)}/5.0</span>
                </div>
              </div>
            </div>

            <div className="prose prose-invert border-l-2 border-amber-900/50 pl-6">
              {product.story && <p className="text-lg text-neutral-300 italic font-serif">"{product.story}"</p>}
              <p className="text-sm text-neutral-400 mt-4 not-italic">{product.description || ''}</p>
            </div>

            {product.notes && product.notes.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                  <Tag size={14} /> Notes Olfactives
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.notes.map((note, idx) => (
                    <span 
                      key={idx} 
                      className="px-4 py-2 rounded-full bg-amber-950/20 border border-amber-900/50 text-amber-100 text-xs font-medium uppercase tracking-widest hover:bg-amber-900/40 hover:border-amber-500/50 transition-all duration-300 cursor-default shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-neutral-800">
              <Button 
                onClick={handleAddToCart} 
                fullWidth 
                className={`text-lg py-4 ${isOutOfStock ? 'bg-neutral-800 text-neutral-500 border-neutral-700 opacity-50 cursor-not-allowed grayscale' : ''}`}
                disabled={isOutOfStock}
              >
                {!isOutOfStock ? 'Ajouter au Panier' : 'Actuellement indisponible'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-600" />
                <span>Authenticité Garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className={`text-amber-600 ${isOutOfStock ? 'opacity-30' : ''}`} />
                <span className={isOutOfStock ? 'opacity-50' : ''}>Livraison Bamako & International</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;