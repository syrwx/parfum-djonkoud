import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const About: React.FC = () => {
  return (
    <div className="bg-neutral-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2574&auto=format&fit=crop" 
            alt="Mali Landscape" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/60 to-neutral-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <span className="inline-block py-1 px-3 border border-amber-500/50 text-amber-400 text-xs tracking-[0.3em] uppercase backdrop-blur-sm">
            Notre Histoire
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            L'Héritage <span className="text-amber-500">Djonkoud</span>
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-amber-100">Plus qu'un parfum, une identité.</h2>
            <div className="h-1 w-20 bg-amber-600"></div>
            <div className="prose prose-invert prose-lg text-neutral-400 font-light">
              <p>
                Née au cœur de Bamako, la maison <strong>DJONKOUD PARFUM</strong> est le fruit d'une passion inébranlable pour les senteurs ancestrales du Mali.
              </p>
              <p>
                "Djonkoud" évoque la connexion profonde à nos racines. Nous puisons notre inspiration dans les rituels de fumigation qui rythment la vie malienne : le Woussoulan qui purifie les demeures, le Thiouraye qui séduit, et les résines sacrées qui apaisent l'âme.
              </p>
              <p>
                Notre mission est simple mais ambitieuse : élever l'art traditionnel de la parfumerie malienne au rang de luxe mondial. Nous sélectionnons les matières les plus nobles — Gowé, Vétiver, Oud, Ambre — et les travaillons avec une précision moderne tout en respectant les secrets de fabrication transmis de génération en génération.
              </p>
            </div>
            <div className="pt-4">
              <Link to="/shop">
                <Button>Découvrir nos créations</Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] border border-amber-900/30 p-4">
              <img 
                src="https://images.unsplash.com/photo-1605218427368-36317b2c94d0?q=80&w=1000&auto=format&fit=crop" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-neutral-900 border border-amber-500 p-6 shadow-2xl max-w-xs hidden md:block">
              <p className="font-serif italic text-amber-200 text-lg">
                "Le parfum est l'architecture invisible de notre mémoire."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-amber-900/20 rounded-full flex items-center justify-center border border-amber-900/50 text-amber-500 text-2xl font-serif">1</div>
              <h3 className="text-xl text-white font-serif">Authenticité</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Aucun compromis sur la qualité. Nos ingrédients proviennent directement des meilleurs artisans et producteurs locaux.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-amber-900/20 rounded-full flex items-center justify-center border border-amber-900/50 text-amber-500 text-2xl font-serif">2</div>
              <h3 className="text-xl text-white font-serif">Excellence</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Chaque flacon, chaque pot d'encens est préparé à la main avec une attention méticuleuse aux détails, garantissant une expérience unique.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-amber-900/20 rounded-full flex items-center justify-center border border-amber-900/50 text-amber-500 text-2xl font-serif">3</div>
              <h3 className="text-xl text-white font-serif">Héritage</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Nous ne vendons pas seulement des parfums, nous partageons une culture, une histoire et l'élégance de l'hospitalité malienne.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;