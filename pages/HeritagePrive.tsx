import React from 'react';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { MessageCircle, Star, Sparkles, ShieldCheck, Gem } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const HeritagePrive: React.FC = () => {
  const { contactInfo } = useStore();

  const handlePrivateOrder = (productName: string) => {
    const agents = contactInfo.whatsAppAgents || [];
    const agent = agents.find(a => a.role === 'wholesale' || a.role === 'general') || agents[0];
    
    if (!agent) return;
    
    const phone = agent.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Bonjour, je souhaite commander une pièce de la Collection Privée Héritage : *${productName}*. ✨👑`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const collection = [
    {
      id: "HP-1",
      name: "Sogolon l'Initatrice",
      price: 150000,
      image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop",
      description: "Un encens d'or pur et de gowé centenaire. La dignité du Wassoulou capturée dans un écrin de soie.",
      notes: ["Or Fluide", "Gowé Ancestral", "Musc Noir"]
    },
    {
      id: "HP-2",
      name: "Kèlè Magni (La Paix)",
      price: 225000,
      image: "https://images.unsplash.com/photo-1605218427368-36317b2c94d0?q=80&w=800&auto=format&fit=crop",
      description: "Parfum d'intérieur majestueux. Un appel à l'harmonie des peuples, inspiré par la force des femmes du Sud.",
      notes: ["Fleur de Baobab", "Santal Impérial", "Encens Sacré"]
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2574&auto=format&fit=crop" 
            alt="Oumou Sangaré Heritage" 
            className="w-full h-full object-cover opacity-30 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <Gem size={40} className="text-amber-500 animate-pulse" />
          </div>
          <span className="inline-block py-1 px-4 border border-amber-500/50 text-amber-500 text-xs tracking-[0.5em] uppercase backdrop-blur-md">
            Accès Privilégié • Édition Limitée
          </span>
          <h1 className="font-serif text-6xl md:text-8xl text-white leading-tight">
            Collection <span className="gold-gradient italic">Héritage</span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-100/70 font-serif italic max-w-2xl mx-auto">
            "La dignité du Wassoulou racontée par les sens."
          </p>
          <div className="h-px w-32 bg-amber-600 mx-auto"></div>
        </div>
      </section>

      {/* Grid Products */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20">
          {collection.map(item => (
            <div key={item.id} className="group relative">
              <div className="aspect-[4/5] overflow-hidden border border-amber-900/30 relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute inset-0 luxury-overlay opacity-80 pointer-events-none"></div>
                
                <div className="absolute bottom-8 left-8 right-8 space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-serif text-white">{item.name}</h3>
                  <div className="flex gap-2">
                    {item.notes.map(n => (
                      <span key={n} className="text-[8px] uppercase tracking-widest text-amber-500 border border-amber-900/50 px-2 py-1 bg-black/50">{n}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <p className="text-neutral-400 font-light leading-relaxed">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-mono text-amber-500 font-bold">
                    {item.price.toLocaleString()} {CURRENCY}
                  </span>
                  <Button 
                    variant="premium" 
                    onClick={() => handlePrivateOrder(item.name)}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle size={18} /> Acquérir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 bg-neutral-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bogolan-pattern opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-12">
          <Sparkles className="mx-auto text-amber-600 opacity-50" size={48} />
          <h2 className="text-4xl md:text-5xl font-serif text-white">L'Esprit Oumou Sangaré</h2>
          <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
            Chaque fragrance de cette collection est une ode à l'indépendance et à la puissance féminine. 
            Une sélection rigoureuse de matières premières impossibles à industrialiser, réservée à ceux qui comprennent que le parfum est une arme de dignité.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12">
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck className="text-amber-500" size={24} />
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Origine Certifiée</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Star className="text-amber-500" size={24} />
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Artisanat Royal</span>
            </div>
            <div className="flex flex-col items-center gap-3 md:col-span-1 col-span-2">
              <Gem className="text-amber-500" size={24} />
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Lot Numéroté</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Teaser */}
      <div className="py-20 text-center border-t border-amber-900/10">
        <p className="text-[10px] text-neutral-600 uppercase tracking-[0.5em] mb-4">Maison Djonkoud x Wassoulou</p>
        <div className="flex justify-center gap-2 opacity-20">
           <div className="w-8 h-px bg-amber-500"></div>
           <div className="w-2 h-2 rounded-full border border-amber-500"></div>
           <div className="w-8 h-px bg-amber-500"></div>
        </div>
      </div>
    </div>
  );
};

export default HeritagePrive;