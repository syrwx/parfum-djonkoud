import React from 'react';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { MessageCircle, Gem } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const HeritagePrive: React.FC = () => {
  const { contactInfo } = useStore();

  const handlePrivateOrder = (productName: string) => {
    const agents = (contactInfo?.whatsAppAgents || []);
    const agent = agents.find(a => a.role === 'wholesale' || a.role === 'general') || agents[0];
    
    if (!agent) return;
    
    const phone = agent.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Bonjour, je souhaite commander une pièce de la Collection Privée Héritage : *${productName}*. ✨👑`);
    const waUrl = `https://wa.me/${phone}?text=${message}`;
    
    // Correction iOS : Redirection directe pour éviter le blocage Safari
    window.location.href = waUrl;
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
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden border-b border-amber-900/10 py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=2574&auto=format&fit=crop" 
            alt="Heritage" 
            className="w-full h-full object-cover opacity-20 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="flex justify-center">
            <Gem size={32} className="text-amber-500" />
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
            Collection <span className="gold-gradient italic">Héritage</span>
          </h1>
          <p className="text-base md:text-xl text-amber-100/60 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "La dignité du Wassoulou racontée par les sens."
          </p>
          <div className="h-px w-24 bg-amber-900 mx-auto"></div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          {collection.map(item => (
            <div key={item.id} className="group">
              <div className="aspect-[4/5] overflow-hidden border border-amber-900/20 relative bg-neutral-900 shadow-2xl">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-700"></div>
                
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-2xl font-serif text-white mb-4">{item.name}</h3>
                  <div className="flex gap-2">
                    {(item.notes || []).map(n => (
                      <span key={n} className="text-[8px] uppercase tracking-widest text-amber-500 border border-amber-900/40 px-3 py-1 bg-black/80 backdrop-blur-sm">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <p className="text-neutral-400 font-light leading-relaxed text-lg italic">
                  {item.description}
                </p>
                <div className="flex justify-between items-center pt-6 border-t border-neutral-900">
                  <span className="text-2xl font-mono text-amber-500 font-bold">
                    {(item.price || 0).toLocaleString()} {CURRENCY}
                  </span>
                  <Button 
                    variant="premium" 
                    onClick={() => handlePrivateOrder(item.name)}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle size={18} /> Acquérir une pièce
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HeritagePrive;