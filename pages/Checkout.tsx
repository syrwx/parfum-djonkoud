import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MessageCircle, Loader2, Globe, Smartphone, DollarSign, Check, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { PaymentMethod } from '../types';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { contactInfo, siteSettings } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(PaymentMethod.WHATSAPP); 
  const [country, setCountry] = useState('Mali');
  const [shippingCost, setShippingCost] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    instructions: ''
  });

  useEffect(() => {
    switch (country) {
      case 'Mali': setShippingCost(1500); break;
      case 'CoteIvoire': case 'Senegal': setShippingCost(5000); break;
      default: setShippingCost(15000);
    }
  }, [country]);

  const grandTotal = (cartTotal || 0) + shippingCost;
  
  const orderRouting = useMemo(() => {
    const agents = contactInfo?.whatsAppAgents || [];
    const activeAgents = agents.filter(a => a.active);
    
    if (country !== 'Mali') {
      const exportAgent = activeAgents.find(a => a.role === 'export');
      if (exportAgent) return { agent: exportAgent, label: 'Service Export' };
    }
    
    const threshold = siteSettings?.wholesaleThreshold || 200000;
    if ((cartTotal || 0) >= threshold) {
      const wholesaleAgent = activeAgents.find(a => a.role === 'wholesale');
      if (wholesaleAgent) return { agent: wholesaleAgent, label: 'Direction Commerciale (Grossiste)' };
    }
    
    const retailAgent = activeAgents.find(a => a.role === 'retail') || activeAgents.find(a => a.role === 'general');
    return { agent: retailAgent || activeAgents[0], label: 'Conseiller Privé' };
  }, [contactInfo, country, cartTotal, siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerCelebration = () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-particle';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.background = i % 2 === 0 ? '#D4AF37' : '#F9E076';
      confetti.style.width = (Math.random() * 10 + 5) + 'px';
      confetti.style.height = confetti.style.width;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }
  };

  const generateWhatsAppMessage = () => {
    const { label } = orderRouting;
    const itemList = (cart || []).map(item => `🏺 *${item.name}* (x${item.quantity})`).join('\n');
    
    return `Bonjour Djonkoud ✨,

Je souhaite acquérir ma *signature olfactive* et finaliser mon expérience de luxe. 👑

Je commande l'édition sélectionnée par les *icônes de Bamako* :
${itemList}

📍 *Destination :* ${country}
👤 *Client :* ${formData.name}
📞 *Contact :* ${formData.phone}

💰 *Investissement Total :* ${grandTotal.toLocaleString()} FCFA

⏳ _Disponibilité à confirmer pour ce lot artisanal auprès de mon ${label}._`;
  };

  const handleWhatsAppCheckout = () => {
    if (!formData.name || !formData.phone) {
      toast.error("Veuillez renseigner votre nom et téléphone pour votre accueil VIP.");
      return;
    }
    
    const { agent } = orderRouting;
    if (!agent) {
      toast.error("Nos conseillers sont momentanément indisponibles.");
      return;
    }

    triggerCelebration();
    const cleanPhone = agent.phone.replace(/[^0-9]/g, '');
    const message = generateWhatsAppMessage();

    toast.success("Redirection vers votre salon privé WhatsApp...");
    
    setTimeout(() => {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    }, 1000);
  };

  const handlePayment = async () => {
    if (paymentMethod === PaymentMethod.WHATSAPP) {
      handleWhatsAppCheckout();
      return;
    }
    
    if (!formData.name || !formData.phone || !formData.address) { 
      toast.error("Informations de livraison requises"); 
      return; 
    }
    
    setLoading(true);
    try {
      const orderData = { ...formData, items: cart, total: grandTotal, paymentMethod, status: 'pending' };
      const response = await fetch('/api/orders', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(orderData) 
      });
      if (response.ok) { 
        triggerCelebration();
        clearCart(); 
        toast.success("Commande transmise avec succès !"); 
        navigate('/'); 
      }
    } catch (e) { 
      toast.error("Erreur de connexion"); 
    } finally { 
      setLoading(false); 
    }
  };

  const activePaymentMethods = siteSettings?.paymentMethods?.filter(m => m.active) || [];

  return (
    <div className="bg-neutral-950 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-white mb-2 tracking-tight">Espace de Règlement</h1>
          <div className="h-1 w-24 bg-amber-600 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-neutral-900/40 border border-neutral-800 p-8 shadow-2xl">
              <h2 className="text-lg text-amber-500 font-serif mb-6 flex items-center gap-3">
                <Globe className="text-amber-600" size={20} /> Vos Coordonnées
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Pays de réception</label>
                  <select 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-amber-600 outline-none font-bold appearance-none"
                  >
                    <option value="Mali">Mali 🇲🇱</option>
                    <option value="CoteIvoire">Côte d'Ivoire 🇨🇮</option>
                    <option value="Senegal">Sénégal 🇸🇳</option>
                    <option value="France">France 🇫🇷</option>
                  </select>
                </div>
                <input name="name" type="text" placeholder="Nom complet" value={formData.name} onChange={handleInputChange} className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-amber-600 outline-none" />
                <input name="phone" type="text" placeholder="Téléphone WhatsApp" value={formData.phone} onChange={handleInputChange} className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-amber-600 outline-none font-mono" />
                <div className="md:col-span-2">
                  <input name="address" type="text" placeholder="Adresse précise (Quartier, Rue, Porte)" value={formData.address} onChange={handleInputChange} className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-amber-600 outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800 p-8 shadow-2xl">
              <h2 className="text-lg text-amber-500 font-serif mb-6 flex items-center gap-3">
                <CreditCard className="text-amber-600" size={20} /> Choisir votre mode de paiement
              </h2>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setPaymentMethod(PaymentMethod.WHATSAPP)}
                  className={`w-full p-6 border-2 transition-all text-left relative overflow-hidden group ${
                    paymentMethod === PaymentMethod.WHATSAPP 
                    ? 'border-amber-500 bg-amber-950/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                    : 'border-neutral-800 bg-black hover:border-amber-900'
                  }`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-5">
                      <div className="w-14 h-14 bg-amber-600 flex items-center justify-center shadow-xl">
                         <MessageCircle size={28} className="text-white" fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xl">Expérience WhatsApp Premium</h3>
                        <p className="text-neutral-400 text-sm mt-1">Échangez avec nos experts pour confirmer la rareté de votre lot artisanal.</p>
                        <div className="flex gap-2 mt-3">
                           <span className="text-[8px] bg-amber-600 text-black px-2 py-0.5 rounded-none font-black tracking-tighter">SÉLECTION ICÔNE</span>
                           <span className="text-[8px] border border-amber-900 text-amber-500 px-2 py-0.5 rounded-none font-bold">ACCÈS PRIVÉ</span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === PaymentMethod.WHATSAPP ? 'border-amber-500 bg-amber-600 scale-110' : 'border-neutral-700'}`}>
                       {paymentMethod === PaymentMethod.WHATSAPP && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </button>

                <div className="grid md:grid-cols-2 gap-4">
                  {activePaymentMethods.filter(m => m.id !== PaymentMethod.WHATSAPP).map(method => (
                    <button 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`flex items-center justify-between p-5 border transition-all ${
                        paymentMethod === method.id 
                        ? 'border-amber-500 bg-amber-950/20' 
                        : 'border-neutral-800 bg-black hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-amber-600">
                          {method.id === 'WAVE' || method.id === 'ORANGE_MONEY' ? <Smartphone size={20} /> : 
                           method.id === 'CARD' ? <CreditCard size={20} /> : <DollarSign size={20} />}
                        </div>
                        <span className="text-sm font-bold text-neutral-200 tracking-wide">{method.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-black border border-amber-900/30 p-8 sticky top-24 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles size={100} />
              </div>
              
              <h2 className="font-serif text-2xl text-white mb-8 border-b border-neutral-800 pb-5">Récapitulatif</h2>
              
              <div className="space-y-4 mb-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {(cart || []).map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                       <img src={item.image} className="w-10 h-10 object-cover border border-neutral-800" alt={item.name} />
                       <span className="text-neutral-300">{item.name} <span className="text-neutral-500 ml-1">x{item.quantity}</span></span>
                    </div>
                    <span className="text-neutral-100 font-mono">{((item.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-neutral-800">
                <div className="flex justify-between text-neutral-400 text-sm">
                  <span>Sous-total</span>
                  <span>{(cartTotal || 0).toLocaleString()} {CURRENCY}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-sm">
                  <span>Logistique ({country})</span>
                  <span>+ {shippingCost.toLocaleString()} {CURRENCY}</span>
                </div>
                <div className="flex justify-between text-2xl font-serif font-bold text-amber-500 pt-6">
                  <span>Total</span>
                  <span>{grandTotal.toLocaleString()} {CURRENCY}</span>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <Button 
                  variant={paymentMethod === PaymentMethod.WHATSAPP ? "premium" : "primary"}
                  fullWidth 
                  onClick={handlePayment} 
                  disabled={loading || !paymentMethod}
                  className="py-5 text-lg"
                >
                  {loading ? <Loader2 size={24} className="animate-spin" /> : 
                   paymentMethod === PaymentMethod.WHATSAPP ? (
                     <span className="flex items-center gap-2">Acquérir sur WhatsApp <ArrowRight size={20}/></span>
                   ) : 'Confirmer l\'Acquisition'}
                </Button>
                
                <div className="flex items-center justify-center gap-2 opacity-50 pt-4">
                   <div className="h-[1px] w-8 bg-amber-900"></div>
                   <p className="text-[10px] text-center text-neutral-500 uppercase tracking-[0.3em]">
                     Savoir-faire Malien d'Exception
                   </p>
                   <div className="h-[1px] w-8 bg-amber-900"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;