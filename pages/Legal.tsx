import React from 'react';
import { Truck, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

const Legal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-amber-50">
      <h1 className="font-serif text-4xl mb-4 text-center">Informations & FAQ</h1>
      <p className="text-center text-neutral-400 mb-16">Tout ce que vous devez savoir sur nos services.</p>
      
      <div className="space-y-16">
        {/* FAQ */}
        <section id="faq" className="bg-neutral-900/50 p-8 border border-neutral-800">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="text-amber-500" size={24} />
            <h2 className="font-serif text-2xl text-amber-100">Questions Fréquentes</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-amber-500 mb-2">Quels sont les délais de livraison ?</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Nous livrons sous 24h à 48h partout à Bamako via notre service de coursiers. 
                Pour les régions (Ségou, Sikasso, etc.), comptez 3 à 5 jours via les compagnies de transport partenaires.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-amber-500 mb-2">Les parfums sont-ils naturels ?</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Oui, nous privilégions les ingrédients naturels locaux (racines de vétiver, graines de gowé, résines). 
                Certaines compositions intègrent des fixateurs de haute qualité pour garantir une tenue longue durée.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-amber-500 mb-2">Comment utiliser les encens ?</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Nos encens se brûlent idéalement sur du charbon ardent dans un encensoir traditionnel. 
                Laissez le charbon devenir gris avant de déposer une pincée d'encens pour éviter de brûler la matière trop vite.
              </p>
            </div>
          </div>
        </section>

        {/* Livraison */}
        <section id="shipping" className="bg-neutral-900/50 p-8 border border-neutral-800">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="text-amber-500" size={24} />
            <h2 className="font-serif text-2xl text-amber-100">Livraison & Retours</h2>
          </div>
          <p className="text-neutral-300 text-sm leading-relaxed mb-4">
            La livraison est <strong>gratuite</strong> à partir de 50 000 FCFA d'achat à Bamako.
            En dessous, les frais sont calculés selon le quartier (généralement entre 1000 et 2000 FCFA).
          </p>
          <p className="text-neutral-300 text-sm leading-relaxed">
            En cas de produit endommagé à la réception, contactez-nous sous 24h pour un échange immédiat. 
            Pour des raisons d'hygiène, les pots d'encens ouverts ne sont ni repris ni échangés.
          </p>
        </section>

        {/* CGV */}
        <section id="terms" className="bg-neutral-900/50 p-8 border border-neutral-800">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-amber-500" size={24} />
            <h2 className="font-serif text-2xl text-amber-100">Conditions Générales</h2>
          </div>
          <p className="text-neutral-300 text-sm leading-relaxed mb-4">
            Les prix sont indiqués en FCFA TTC. Le paiement s'effectue soit à la commande (Mobile Money, Carte), 
            soit à la livraison (espèces, Bamako uniquement).
          </p>
          <p className="text-neutral-300 text-sm leading-relaxed">
            DJONKOUD PARFUM se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés 
            sur la base des tarifs en vigueur au moment de l'enregistrement de la commande.
          </p>
        </section>

        {/* Confidentialité */}
        <section id="privacy" className="bg-neutral-900/50 p-8 border border-neutral-800">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-amber-500" size={24} />
            <h2 className="font-serif text-2xl text-amber-100">Confidentialité</h2>
          </div>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Vos données personnelles (Nom, Téléphone, Adresse) sont utilisées uniquement pour le traitement de votre commande 
            et l'amélioration de votre expérience. Elles ne sont jamais vendues à des tiers.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Legal;