import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Search, X, Sparkles, Filter } from 'lucide-react';

const Shop: React.FC = () => {
  const { products, refreshProducts, isLoading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Montage stable pour éviter les boucles infinies sur EC2
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      refreshProducts();
    }
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      
      if (!query) return matchesCategory;

      const matchesSearch = 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.notes && product.notes.some(note => note.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="bg-neutral-950 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-amber-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Découvrez nos essences</span>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-6">La Collection Royale</h1>
          <div className="h-px w-24 bg-amber-800 mx-auto mb-8"></div>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-12 font-light tracking-wide">
            Chaque fragrance est une pièce d'histoire malienne, façonnée pour l'élite contemporaine.
          </p>

          {/* Search Bar - Optimisée pour mobile */}
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-600 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une note, un nom..."
              className="block w-full pl-14 pr-12 py-5 bg-neutral-900/50 border border-neutral-800 text-amber-50 placeholder-neutral-600 focus:outline-none focus:border-amber-600 focus:ring-0 transition-all shadow-2xl backdrop-blur-sm rounded-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-neutral-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters & Count */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 border-b border-neutral-900 pb-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto scrollbar-hide">
            <div className="flex-shrink-0 text-amber-700">
              <Filter size={18} />
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-6 py-2 text-[10px] uppercase tracking-[0.2em] border transition-all duration-500 font-bold ${
                  selectedCategory === cat 
                    ? 'bg-amber-600 border-amber-600 text-black shadow-[0_5px_15px_rgba(217,119,6,0.2)]' 
                    : 'bg-transparent border-neutral-800 text-neutral-500 hover:border-amber-900 hover:text-amber-400'
                }`}
              >
                {cat === 'all' ? 'Tout' : cat}
              </button>
            ))}
          </div>
          
          <div className="text-[10px] uppercase tracking-widest text-neutral-600 font-mono">
            {filteredProducts.length} pièce{filteredProducts.length > 1 ? 's' : ''} d'exception
          </div>
        </div>

        {/* Product Grid - Optimisé pour performance RAM */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-amber-700 space-y-4">
             <div className="w-12 h-12 border-4 border-amber-900 border-t-amber-500 rounded-full animate-spin"></div>
             <p className="text-[10px] uppercase tracking-[0.4em] animate-pulse">Ouverture des coffrets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-32 bg-neutral-900/10 border border-neutral-900 mt-8">
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-neutral-900 mb-6 border border-amber-900/20">
               <Sparkles className="text-amber-700 opacity-50" size={32} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4 italic">Fragrance introuvable</h3>
            <p className="text-neutral-500 mb-10 max-w-md mx-auto font-light leading-relaxed">
              Le secret de cette note n'est pas encore révélé. Essayez une autre recherche.
            </p>
            <button 
              onClick={clearFilters}
              className="px-10 py-4 bg-amber-900/20 border border-amber-600/50 text-amber-500 hover:bg-amber-600 hover:text-black transition-all uppercase tracking-widest text-[10px] font-bold"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;