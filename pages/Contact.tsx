import React from 'react';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const { contactInfo } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // [API INTEGRATION] Envoyer le formulaire de contact au Backend
    // axios.post('/api/contact', formData)...
    toast.success("Votre message a été envoyé avec succès.");
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header avec Parallaxe et Titre */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585312384976-1a89635f2990?q=80&w=2574&auto=format&fit=crop" 
            alt="Djonkoud Contact" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/60 to-neutral-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <span className="inline-block py-1 px-3 border border-amber-500/50 text-amber-400 text-xs tracking-[0.3em] uppercase backdrop-blur-sm">
            Service Client
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            Contactez la <span className="text-amber-500">Maison</span>
          </h1>
        </div>
      </section>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 bg-neutral-900 border border-amber-900/30 shadow-2xl">
          
          {/* Colonne Informations */}
          <div className="p-10 md:p-14 bg-black/50 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
             <div className="absolute inset-0 bogolan-pattern opacity-5 pointer-events-none"></div>
             
             <div className="space-y-12 relative z-10">
               <div>
                 <h2 className="font-serif text-3xl text-amber-50 mb-6">Nos Coordonnées</h2>
                 <p className="text-neutral-400 font-light leading-relaxed">
                   Pour toute question sur nos créations, une commande ou un partenariat, notre équipe est à votre écoute pour vous offrir un service d'exception.
                 </p>
               </div>

               <div className="space-y-6">
                 <div className="flex items-start gap-4 group">
                   <div className="w-12 h-12 rounded-none bg-amber-900/10 border border-amber-900/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                     <MapPin size={20} />
                   </div>
                   <div>
                     <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Siège Social</p>
                     <p className="text-white text-lg font-serif">{contactInfo.address}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4 group">
                   <div className="w-12 h-12 rounded-none bg-amber-900/10 border border-amber-900/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                     <Phone size={20} />
                   </div>
                   <div>
                     <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Téléphone</p>
                     <p className="text-white text-lg font-serif">{contactInfo.phone}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4 group">
                   <div className="w-12 h-12 rounded-none bg-amber-900/10 border border-amber-900/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                     <Mail size={20} />
                   </div>
                   <div>
                     <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Email</p>
                     <p className="text-white text-lg font-serif">{contactInfo.email}</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4 group">
                   <div className="w-12 h-12 rounded-none bg-amber-900/10 border border-amber-900/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                     <Clock size={20} />
                   </div>
                   <div>
                     <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Horaires</p>
                     <p className="text-white text-lg font-serif">{contactInfo.hours}</p>
                   </div>
                 </div>
               </div>

               <div className="pt-12 relative z-10">
                 <div className="flex gap-4">
                   <a href={`https://instagram.com/${contactInfo.instagram}`} className="w-10 h-10 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:border-amber-500 transition-all"><Instagram size={18}/></a>
                   <a href={`https://facebook.com/${contactInfo.facebook}`} className="w-10 h-10 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:border-amber-500 transition-all"><Facebook size={18}/></a>
                   <a href={`https://twitter.com/${contactInfo.twitter}`} className="w-10 h-10 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:border-amber-500 transition-all"><Twitter size={18}/></a>
                 </div>
               </div>
            </div>
          </div>

          {/* Colonne Formulaire */}
          <div className="p-10 md:p-14 bg-neutral-900">
            <h2 className="font-serif text-3xl text-white mb-8">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group">
                  <input type="text" required placeholder=" " className="peer w-full bg-transparent border-b border-neutral-700 py-3 text-white focus:border-amber-500 outline-none transition-colors" />
                  <label className="absolute -mt-16 peer-placeholder-shown:-mt-8 peer-placeholder-shown:text-neutral-500 text-amber-500 text-xs uppercase tracking-widest transition-all">Votre Nom</label>
                </div>
                <div className="group">
                  <input type="email" required placeholder=" " className="peer w-full bg-transparent border-b border-neutral-700 py-3 text-white focus:border-amber-500 outline-none transition-colors" />
                  <label className="absolute -mt-16 peer-placeholder-shown:-mt-8 peer-placeholder-shown:text-neutral-500 text-amber-500 text-xs uppercase tracking-widest transition-all">Votre Email</label>
                </div>
              </div>
              
              <div className="group">
                <input type="text" placeholder=" " className="peer w-full bg-transparent border-b border-neutral-700 py-3 text-white focus:border-amber-500 outline-none transition-colors" />
                <label className="absolute -mt-16 peer-placeholder-shown:-mt-8 peer-placeholder-shown:text-neutral-500 text-amber-500 text-xs uppercase tracking-widest transition-all">Sujet</label>
              </div>

              <div className="group">
                <textarea required rows={4} placeholder=" " className="peer w-full bg-transparent border-b border-neutral-700 py-3 text-white focus:border-amber-500 outline-none transition-colors resize-none"></textarea>
                <label className="absolute -mt-28 peer-placeholder-shown:-mt-8 peer-placeholder-shown:text-neutral-500 text-amber-500 text-xs uppercase tracking-widest transition-all">Votre Message</label>
              </div>

              <div className="pt-4">
                <Button fullWidth type="submit">
                  <Send size={16} /> Envoyer le message
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Map Section */}
      <section className="h-96 w-full grayscale contrast-125 brightness-50 relative border-t border-amber-900/30">
        {/* 
            [API INTEGRATION] GOOGLE MAPS
            1. Obtenez une clé API Google Maps JavaScript
            2. Remplacez l'URL de l'iframe ci-dessous par votre URL Embed ou utilisez le composant @react-google-maps/api
            3. Actuellement, c'est une iframe statique pointant sur ACI 2000 Bamako.
        */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.123456789012!2d-8.000000000000000!3d12.639232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe51cd203732658d%3A0x6739600000000000!2sACI%202000%2C%20Bamako%2C%20Mali!5e0!3m2!1sfr!2s!4v1620000000000!5m2!1sfr!2s" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy"
          title="Map"
          className="hover:grayscale-0 transition-all duration-1000"
        ></iframe>
        <div className="absolute inset-0 pointer-events-none border-t border-amber-900/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
      </section>
    </div>
  );
};

export default Contact;