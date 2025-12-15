import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const Shop: React.FC = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-neutral-950 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Notre Collection</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Découvrez nos encens rares, nos parfums d'intérieur et nos coffrets exclusifs, héritage d'un savoir-faire millénaire.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 text-sm uppercase tracking-widest border transition-all duration-300 ${
                selectedCategory === cat 
                  ? 'bg-amber-600 border-amber-600 text-white' 
                  : 'border-neutral-800 text-neutral-400 hover:border-amber-600 hover:text-amber-500'
              }`}
            >
              {cat === 'all' ? 'Tout' : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-lg">Aucun produit trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;