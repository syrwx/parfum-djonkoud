import React, { useState } from 'react';
import { MessageCircle, X, Headphones, Globe, Users } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WhatsAppAgent } from '../types';

const FloatingWhatsApp: React.FC = () => {
  const { contactInfo } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const agents = contactInfo.whatsAppAgents || [];

  const handleAgentClick = (agent: WhatsAppAgent) => {
    const phone = agent.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Bonjour ${agent.name}, j'ai besoin d'informations.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (agents.length === 0) return null;

  // Si un seul agent, comportement classique
  if (agents.length === 1) {
      return (
        <button
          onClick={() => handleAgentClick(agents[0])}
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-lg shadow-black/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Contacter sur WhatsApp"
        >
          <div className="absolute inset-0 rounded-full border border-green-400 opacity-0 group-hover:animate-ping"></div>
          <MessageCircle size={28} fill="currentColor" className="text-white" />
        </button>
      );
  }

  // Si plusieurs agents, menu déroulant
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* Menu Options */}
      {isOpen && (
        <div className="flex flex-col gap-3 animate-fade-in-up mb-2">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => handleAgentClick(agent)}
              className="flex items-center gap-3 bg-neutral-900 border border-green-900/50 p-3 rounded-lg shadow-xl hover:bg-green-900/20 transition-colors text-right group"
            >
              <span className="text-sm font-bold text-white group-hover:text-green-400">{agent.name}</span>
              <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white shadow-lg">
                 {agent.role === 'export' ? <Globe size={18} /> : 
                  agent.role === 'wholesale' ? <Users size={18} /> : 
                  <Headphones size={18} />}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg shadow-black/50 transition-all duration-300 hover:scale-105 flex items-center justify-center ${isOpen ? 'bg-neutral-800 text-white' : 'bg-green-600 text-white'}`}
        aria-label="Support WhatsApp"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="currentColor" />}
      </button>
    </div>
  );
};

export default FloatingWhatsApp;