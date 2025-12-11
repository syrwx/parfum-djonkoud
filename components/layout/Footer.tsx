import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const Footer: React.FC = () => {
  const { contactInfo } = useStore();

  return (
    <footer className="bg-neutral-900 border-t border-amber-900/30 pt-16 pb-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bogolan-pattern opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-amber-500">DJONKOUD</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              L'essence du Mali capturée dans des parfums d'exception. Une invitation au voyage à travers les sens et les traditions.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href={`https://instagram.com/${contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-400 transition-colors"><Instagram size={20} /></a>
              <a href={`https://facebook.com/${contactInfo.facebook}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-400 transition-colors"><Facebook size={20} /></a>
              <a href={`https://twitter.com/${contactInfo.twitter}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-400 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-amber-100 font-bold uppercase tracking-widest mb-6 text-sm">Navigation</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Accueil</Link></li>
              <li><Link to="/shop" className="hover:text-amber-500 transition-colors">Boutique</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">Notre Histoire</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-amber-100 font-bold uppercase tracking-widest mb-6 text-sm">Légal</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Conditions Générales</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Politique de Confidentialité</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Livraison & Retours</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-amber-100 font-bold uppercase tracking-widest mb-6 text-sm">Contact</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-600 flex-shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-600 flex-shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
          <p>&copy; 2024 DJONKOUD PARFUM. Tous droits réservés.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <span>Paiement sécurisé par</span>
             <span className="text-amber-700 font-bold">WAVE</span>
             <span className="text-orange-600 font-bold">ORANGE MONEY</span>
             <Link to="/admin/login" className="text-neutral-800 hover:text-neutral-600 ml-4">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;