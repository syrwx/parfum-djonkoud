import React from 'react';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { MessageCircle, Sparkles, Gem, ShieldCheck, Star } from 'lucide-react';
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
      id: "HP-OS-1",
      name: "Sogolon l'Initatrice",
      price: 150000,
      image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2574&auto=format&fit=crop",
      description: "Un encens d'or pur et de gowé centenaire. La dignité du Wassoulou capturée dans un écrin de soie.",
      notes: ["Or Fluide", "Gowé Ancestral", "Musc Noir"]
    },
    {
      id: "HP-OS-2",
      name: "Kèlè Magni (La Paix)",
      price: 225000,
      image: "https://images.unsplash.com/photo-1605218427368-36317b2c94d0?q=80&w=800&auto=format&fit=crop",
      description: "Parfum d'intérieur majestueux. Un appel à l'harmonie des peuples, inspiré par la force des femmes du Sud.",
      notes: ["Fleur de Baobab", "Santal Impérial", "Encens Sacré"]
    }
  ];

  return (
    <div className="bg-black min-h-screen text-amber-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-amber-900/20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2574&auto=format&fit=crop" 
            alt="Oumou Sangaré Heritage" 
            className="w-full h-full object-cover opacity-20 animate-slow-zoom"
            style={{ imageRendering: 'auto' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <Gem size={48} className="text-amber-500 animate-pulse" />
          </div>
          <span className="inline-block py-2 px-6 border border-amber-500/50 text-amber-500 text-sm tracking-[0.5em] uppercase backdrop-blur-md">
            Accès Privilégié • Édition Limitée
          </span>
          <h1 className="font-serif text-5xl md:text-8xl text-white leading-tight">
            Collection <span className="gold-gradient italic">Héritage</span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-100/70 font-serif italic max-w-2xl mx-auto">
            "La dignité du Wassoulou racontée par les sens."
          </p>
          <div className="h-px w-32 bg-amber-600 mx-auto opacity-50"></div>
        </div>
      </section>

      {/* Grid Products */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20">
          {collection.map(item => (
            <div key={item.id} className="group relative">
              <div className="aspect-[4/5] overflow-hidden border border-amber-900/30 relative bg-neutral-900">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  style={{ imageRendering: 'optimizeSpeed' }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                
                <div className="absolute bottom-8 left-8 right-8 space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-serif text-white">{item.name}</h3>
                  <div className="flex gap-2">
                    {item.notes.map(n => (
                      <span key={n} className="text-[9px] uppercase tracking-widest text-amber-500 border border-amber-900/50 px-3 py-1 bg-black/60 backdrop-blur-sm">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <p className="text-neutral-400 font-light leading-relaxed text-lg">
                  {item.description}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-amber-900/10">
                  <span className="text-3xl font-mono text-amber-500 font-bold">
                    {item.price.toLocaleString()} {CURRENCY}
                  </span>
                  <Button 
                    variant="premium" 
                    onClick={() => handlePrivateOrder(item.name)}
                    className="flex items-center gap-3 px-8"
                  >
                    <MessageCircle size={20} /> Acquérir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wassoulou Spirit */}
      <section className="py-40 bg-neutral-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bogolan-pattern opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-12">
          <Sparkles className="mx-auto text-amber-600 opacity-40" size={56} />
          <h2 className="text-4xl md:text-6xl font-serif text-white">L'Esprit du Wassoulou</h2>
          <p className="text-xl md:text-2xl text-neutral-400 font-light leading-relaxed max-w-3xl mx-auto italic font-serif">
            "Une fragrance n'est pas qu'un parfum, c'est un bouclier de dignité. La collection Héritage célèbre la force tranquille des femmes qui portent l'histoire du Mali sur leurs épaules."
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-16">
            <div className="flex flex-col items-center gap-4">
              <ShieldCheck className="text-amber-500" size={32} />
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-bold">Origine Sacrée</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Star className="text-amber-500" size={32} />
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-bold">Artisanat de Cour</span>
            </div>
            <div className="flex flex-col items-center gap-4 md:col-span-1 col-span-2">
              <Gem className="text-amber-500" size={32} />
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-bold">Édition Numérotée</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Teaser */}
      <div className="py-20 text-center">
        <p className="text-xs text-neutral-600 uppercase tracking-[0.8em] mb-4">Maison Djonkoud x Oumou Sangaré</p>
        <div className="flex justify-center gap-3 opacity-20">
           <div className="w-12 h-px bg-amber-500"></div>
           <div className="w-3 h-3 rounded-full border border-amber-500"></div>
           <div className="w-12 h-px bg-amber-500"></div>
        </div>
      </div>
    </div>
  );
};

export default HeritagePrive;