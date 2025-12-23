import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Send, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.34 6.34 0 01-1.87-1.48v8.7a6.05 6.05 0 11-10.75-3.64 6.02 6.02 0 014.24-2.22c.01-.1.01-.21 0-.32V5.52c-.01-1.84-.02-3.67-.03-5.5z"/>
  </svg>
);

const Footer: React.FC = () => {
  const { contactInfo } = useStore();

  return (
    <footer className="bg-neutral-900 border-t border-amber-900/30 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bogolan-pattern opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-amber-500 uppercase tracking-widest">DJONKOUD</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              L'essence du Mali capturée dans des parfums d'exception. Une invitation au voyage à travers les sens et les traditions.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              {contactInfo.instagram && (
                <a href={`https://instagram.com/${contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-400 transition-colors" title="Instagram"><Instagram size={20} /></a>
              )}
              {contactInfo.facebook && (
                <a href={`https://facebook.com/${contactInfo.facebook}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-400 transition-colors" title="Facebook"><Facebook size={20} /></a>
              )}
              {contactInfo.tiktok && (
                <a href={`https://tiktok.com/${contactInfo.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-400 transition-colors" title="TikTok"><TikTokIcon size={20} /></a>
              )}
              {contactInfo.telegram && (
                <a href={contactInfo.telegram.startsWith('http') ? contactInfo.telegram : `https://t.me/${contactInfo.telegram}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-400 transition-colors" title="Telegram"><Send size={20} /></a>
              )}
              {contactInfo.twitter && (
                <a href={`https://twitter.com/${contactInfo.twitter}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-400 transition-colors" title="X (Twitter)"><Twitter size={20} /></a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-amber-100 font-bold uppercase tracking-widest mb-6 text-sm">Navigation</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Accueil</Link></li>
              <li><Link to="/collection" className="hover:text-amber-500 transition-colors">Boutique</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">Notre Histoire</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-100 font-bold uppercase tracking-widest mb-6 text-sm">Légal</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link to="/legal" className="hover:text-amber-500 transition-colors">Conditions Générales</Link></li>
              <li><Link to="/legal" className="hover:text-amber-500 transition-colors">Politique de Confidentialité</Link></li>
              <li><Link to="/legal" className="hover:text-amber-500 transition-colors">Livraison & Retours</Link></li>
              <li><Link to="/legal" className="hover:text-amber-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>

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
          <p>&copy; {new Date().getFullYear()} DJONKOUD PARFUM. Tous droits réservés.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <span>Paiement sécurisé par</span>
             <span className="text-amber-700 font-bold">WAVE</span>
             <span className="text-orange-600 font-bold">ORANGE MONEY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;