import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const { products, siteSettings, isLoading } = useStore();
  const featuredProducts = (products || []).slice(0, 3);

  // Fallbacks visuels pour éviter l'écran vide pendant le chargement
  const heroImage = siteSettings?.heroImage || "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop";
  const heroTitle = siteSettings?.heroTitle || "L'Âme du Mali";
  const heroSubtitle = siteSettings?.heroSubtitle || "Mali • Tradition • Luxe";
  const heroSlogan = siteSettings?.heroSlogan || "L'essence du Mali, l'âme du luxe.";

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Djonkoud Ambiance" 
            className="w-full h-full object-cover opacity-30 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-neutral-950"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-10">
          <div className="flex justify-center">
            <span className="inline-block py-1 px-4 border border-amber-500/30 text-amber-400 text-[10px] md:text-xs tracking-[0.5em] uppercase backdrop-blur-md font-bold">
              {heroSubtitle}
            </span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1]">
             <span className="gold-gradient block sm:inline">{heroTitle}</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-xl text-neutral-400 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            {heroSlogan}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link to="/collection">
              <Button className="px-10 py-4 text-base">Découvrir la Boutique</Button>
            </Link>
            <Link to="/guide">
              <Button variant="outline" className="px-10 py-4 text-base">
                <Sparkles size={18} /> Consulter le Griot
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl text-amber-50 mb-3">Les Signatures</h2>
              <div className="h-1 w-20 bg-amber-600 mb-4"></div>
              <p className="text-neutral-500 text-sm md:text-base font-light">L'artisanat malien transcendé en parfums de prestige.</p>
            </div>
            <Link to="/collection" className="hidden md:flex items-center gap-2 text-amber-600 hover:text-amber-500 transition-all uppercase text-xs tracking-widest font-bold group">
              Catalogue complet <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
               {[1,2,3].map(i => (
                 <div key={i} className="aspect-[3/4] bg-neutral-900 animate-pulse border border-neutral-800"></div>
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/collection">
              <Button variant="outline" fullWidth>Voir toute la collection</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Teaser / Griot Section */}
      <section className="py-24 bg-neutral-900/40 border-y border-neutral-900/60 relative overflow-hidden">
        <div className="absolute inset-0 bogolan-pattern pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-[4/5] bg-neutral-900 border border-amber-900/20 overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000" alt="Griot" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                 <div className="absolute bottom-10 left-10 right-10">
                   <p className="font-serif italic text-amber-100 text-xl leading-relaxed">"Le parfum est la parole invisible de l'âme. Laissez-moi vous guider vers la vôtre."</p>
                 </div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <div className="flex items-center gap-3 text-amber-600">
                <Sparkles size={20} />
                <span className="text-xs uppercase tracking-[0.4em] font-black">Expérience Divinatoire</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight">
                Le Griot <span className="text-amber-500 italic">Virtuel</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed">
                Notre intelligence artificielle puise dans les traditions séculaires pour vous recommander la fragrance qui correspond à votre humeur et à l'instant présent.
              </p>
              <div className="pt-4">
                <Link to="/guide">
                  <Button variant="premium" className="px-10 py-5">Interroger le Griot</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;