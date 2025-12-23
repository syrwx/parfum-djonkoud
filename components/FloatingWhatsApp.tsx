import React, { useState } from 'react';
import { MessageCircle, X, Headphones, Globe, Users } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WhatsAppAgent } from '../types';

const WhatsAppBrandIcon = ({ size = 28, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const FloatingWhatsApp: React.FC = () => {
  const { contactInfo } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const agents = contactInfo.whatsAppAgents || [];

  const handleAgentClick = (agent: WhatsAppAgent) => {
    const phone = agent.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Bonjour ${agent.name}, je viens de votre site DJONKOUD PARFUM et j'ai besoin d'informations.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (agents.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="flex flex-col gap-3 animate-fade-in-up mb-2">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => handleAgentClick(agent)}
              className="flex items-center gap-4 bg-white border border-neutral-200 p-3 rounded-xl shadow-2xl hover:bg-neutral-50 transition-all text-right group min-w-[200px]"
            >
              <div className="flex-grow">
                <p className="text-xs uppercase font-black text-neutral-400 tracking-tighter mb-1 leading-none">Expert {agent.role === 'wholesale' ? 'Vente Gros' : agent.role === 'export' ? 'Export' : 'Conseil'}</p>
                <span className="text-sm font-bold text-neutral-900 group-hover:text-green-600 transition-colors">{agent.name}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg">
                 {agent.role === 'export' ? <Globe size={18} /> : 
                  agent.role === 'wholesale' ? <Users size={18} /> : 
                  <Headphones size={18} />}
              </div>
            </button>
          ))}
          <div className="bg-white p-3 rounded-lg shadow-xl border border-neutral-100 max-w-[200px]">
            <p className="text-[10px] text-neutral-500 font-medium leading-tight">Nos experts vous répondent généralement en moins de 15 minutes.</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group ${isOpen ? 'bg-neutral-800 text-white' : 'bg-[#25D366] text-white'}`}
        aria-label="Contacter sur WhatsApp"
      >
        {!isOpen && <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>}
        {isOpen ? <X size={28} /> : <WhatsAppBrandIcon size={28} />}
      </button>
    </div>
  );
};

export default FloatingWhatsApp;