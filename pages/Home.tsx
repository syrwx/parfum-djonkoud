import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const { products, siteSettings } = useStore();
  const featuredProducts = (products || []).slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section - Plus flexible pour éviter le zoom */}
      <section className="relative min-h-[60vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden py-16 md:py-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={siteSettings.heroImage} 
            alt="Djonkoud Ambiance" 
            className="w-full h-full object-cover opacity-30 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-neutral-950"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          {siteSettings.heroSubtitle && (
            <div className="flex justify-center">
              <span className="inline-block py-1 px-4 border border-amber-500/20 text-amber-400 text-[9px] md:text-xs tracking-[0.5em] uppercase backdrop-blur-sm">
                {siteSettings.heroSubtitle}
              </span>
            </div>
          )}
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-[1.15]">
             <span className="gold-gradient block sm:inline">{siteSettings.heroTitle}</span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-lg text-neutral-400 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            {siteSettings.heroSlogan}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 md:pt-8">
            <Link to="/collection">
              <Button className="px-8 py-3.5">Explorer</Button>
            </Link>
            <Link to="/guide">
              <Button variant="outline" className="px-8 py-3.5"><Sparkles size={16} /> Guide IA</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="font-serif text-2xl md:text-4xl text-amber-50 mb-2">Les Signatures</h2>
              <p className="text-neutral-500 text-sm font-light">L'artisanat malien transcendé.</p>
            </div>
            <Link to="/collection" className="hidden md:flex items-center gap-2 text-amber-600 hover:text-amber-500 transition-colors uppercase text-[9px] tracking-widest font-bold">
              Catalogue complet <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Teaser Section */}
      <section className="py-20 bg-neutral-900/30 border-y border-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-[4/5] sm:aspect-square bg-neutral-900 border border-amber-900/10 overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" alt="Rituel" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8">
                   <p className="font-serif italic text-amber-200 text-lg">"Chaque fumée raconte un secret."</p>
                 </div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6 md:space-y-8">
              <div className="flex items-center gap-3 text-amber-600">
                <Sparkles size={16} />
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold">Le Griot Virtuel</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">
                Laissez-vous <span className="text-amber-500 italic">guider</span> par l'intuition.
              </h2>
              <p className="text-neutral-500 text-sm md:text-base font-light leading-relaxed">
                Notre intelligence artificielle analyse votre humeur pour vous dévoiler le parfum qui s'accorde à votre âme.
              </p>
              <div className="pt-2">
                <Link to="/guide">
                  <Button variant="premium">Consulter le Guide</Button>
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