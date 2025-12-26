
import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Send, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
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
            <p className="text-neutral-400 text-xs leading-relaxed uppercase tracking-tighter">
              L'essence du Mali capturée dans des parfums d'exception. Un héritage royal à chaque vaporisation.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-800">
              {contactInfo.instagram && (
                <a href={`https://instagram.com/${contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-white transition-all hover:scale-110" title="Instagram"><Instagram size={18} /></a>
              )}
              {contactInfo.tiktok && (
                <a href={`https://tiktok.com/${contactInfo.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-white transition-all hover:scale-110" title="TikTok"><TikTokIcon size={18} /></a>
              )}
              {contactInfo.telegram && (
                <a href={contactInfo.telegram.startsWith('http') ? contactInfo.telegram : `https://t.me/${contactInfo.telegram}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-white transition-all hover:scale-110" title="Telegram"><Send size={18} /></a>
              )}
              {contactInfo.facebook && (
                <a href={`https://facebook.com/${contactInfo.facebook}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-white transition-all hover:scale-110" title="Facebook"><Facebook size={18} /></a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-amber-100 font-bold uppercase tracking-[0.3em] mb-6 text-[10px]">Navigation</h4>
            <ul className="space-y-3 text-[10px] uppercase tracking-widest text-neutral-500">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">Accueil</Link></li>
              <li><Link to="/collection" className="hover:text-amber-500 transition-colors">Collection</Link></li>
              <li><Link to="/guide" className="hover:text-amber-500 transition-colors">Guide IA</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">La Maison</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-100 font-bold uppercase tracking-[0.3em] mb-6 text-[10px]">Informations</h4>
            <ul className="space-y-3 text-[10px] uppercase tracking-widest text-neutral-500">
              <li><Link to="/legal" className="hover:text-amber-500 transition-colors">Livraison</Link></li>
              <li><Link to="/legal" className="hover:text-amber-500 transition-colors">Confidentialité</Link></li>
              <li><Link to="/legal" className="hover:text-amber-500 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-100 font-bold uppercase tracking-[0.3em] mb-6 text-[10px]">Maison Mère</h4>
            <ul className="space-y-4 text-xs text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-600 mt-0.5" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 font-mono">
                <Phone size={16} className="text-amber-600" />
                <span>{contactInfo.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-widest text-neutral-600">
          <p>&copy; {new Date().getFullYear()} DJONKOUD PARFUM. Fabriqué avec fierté au Mali.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0 font-black">
             <span className="text-amber-900">WAVE</span>
             <span className="text-orange-900">ORANGE MONEY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
