import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Search, X, Sparkles } from 'lucide-react';

const Shop: React.FC = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Filter by Category
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // 2. Filter by Search Query
      const query = searchQuery.toLowerCase().trim();
      
      if (!query) return matchesCategory;

      const matchesSearch = 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.story.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.notes.some(note => note.toLowerCase().includes(query));

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
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Notre Collection</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-8">
            Découvrez nos encens rares, nos parfums d'intérieur et nos coffrets exclusifs, héritage d'un savoir-faire millénaire.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, note (ex: Oud, Santal)..."
              className="block w-full pl-12 pr-10 py-4 bg-neutral-900 border border-neutral-800 text-amber-50 placeholder-neutral-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters & Count */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-neutral-800 pb-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 text-xs uppercase tracking-widest border transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-900/20' 
                    : 'bg-transparent border-neutral-800 text-neutral-400 hover:border-amber-600 hover:text-amber-500'
                }`}
              >
                {cat === 'all' ? 'Tout' : cat}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-neutral-500 font-mono">
            {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-neutral-900/30 border border-neutral-800 mt-8">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-neutral-800 mb-4">
               <Sparkles className="text-amber-500 opacity-50" size={24} />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Aucune création trouvée</h3>
            <p className="text-neutral-400 mb-6">
              Essayez d'autres mots-clés ou naviguez dans une autre catégorie.
            </p>
            <button 
              onClick={clearFilters}
              className="text-amber-500 hover:text-amber-400 border-b border-amber-500/50 hover:border-amber-400 pb-1 transition-all uppercase tracking-widest text-xs"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;