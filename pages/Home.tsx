import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Wind } from 'lucide-react';

const Home: React.FC = () => {
  const { products, siteSettings } = useStore();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={siteSettings.heroImage} 
            alt="Djonkoud Ambiance" 
            className="w-full h-full object-cover opacity-40 transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-neutral-950/60 to-neutral-950"></div>
          {/* Animated smoke effect */}
          <div className="absolute inset-0 opacity-30 animate-pulse bg-gradient-to-tr from-transparent via-neutral-900/50 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          {siteSettings.heroSubtitle && (
            <span className="inline-block py-1 px-3 border border-amber-500/50 text-amber-400 text-xs tracking-[0.3em] uppercase backdrop-blur-sm">
              {siteSettings.heroSubtitle}
            </span>
          )}
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight">
             <span className="gold-gradient">{siteSettings.heroTitle}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-300 font-light tracking-wide max-w-2xl mx-auto">
            {siteSettings.heroSlogan}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/shop">
              <Button>Découvrir la Collection</Button>
            </Link>
            <Link to="/guide">
              <Button variant="outline"><Sparkles size={18} /> Guide IA</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-amber-50 mb-4">Nos Incontournables</h2>
              <p className="text-neutral-400">Des créations olfactives qui traversent le temps.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors uppercase text-xs tracking-widest font-bold">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop">
               <Button variant="outline" fullWidth>Voir toute la collection</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Teaser Section */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-900/5 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-square bg-neutral-800 border border-amber-900/30 overflow-hidden relative">
                 <img src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover opacity-70" alt="Rituel" />
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8">
                   <div className="bg-neutral-950/80 backdrop-blur-md p-6 border-l-2 border-amber-500">
                     <p className="font-serif italic text-amber-100 text-lg">"La fumée ne ment jamais, elle guide l'esprit vers ses souvenirs."</p>
                   </div>
                 </div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="flex items-center gap-3 text-amber-500 mb-2">
                <Sparkles size={20} />
                <span className="text-xs uppercase tracking-widest font-bold">Innovation & Tradition</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">
                Laissez le <span className="text-amber-500">Griot Virtuel</span> vous guider.
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                Notre intelligence artificielle analyse votre humeur et l'occasion pour vous recommander le parfum idéal, accompagné d'une description poétique unique.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-500"><Wind size={16} /></span>
                  <span className="text-neutral-300">Recommandations personnalisées</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-500"><Sparkles size={16} /></span>
                  <span className="text-neutral-300">Storytelling immersif</span>
                </li>
              </ul>
              <div className="pt-6">
                <Link to="/guide">
                  <Button>Essayer le Guide IA</Button>
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