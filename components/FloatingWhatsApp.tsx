import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const FloatingWhatsApp: React.FC = () => {
  const { contactInfo } = useStore();

  const handleWhatsAppClick = () => {
    // Nettoyage du numéro
    const phone = contactInfo.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent("Bonjour, j'aimerais avoir des renseignements sur vos parfums.");
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-lg shadow-black/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Contacter sur WhatsApp"
    >
      <div className="absolute inset-0 rounded-full border border-green-400 opacity-0 group-hover:animate-ping"></div>
      <MessageCircle size={28} fill="currentColor" className="text-white" />
    </button>
  );
};

export default FloatingWhatsApp;