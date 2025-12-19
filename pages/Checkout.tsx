
import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MessageCircle, Loader2, Globe, Truck, Check, Smartphone, DollarSign, ShieldCheck, UserCheck, Star, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Coupon, PaymentMethod, WhatsAppAgent } from '../types';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { contactInfo, siteSettings } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // WhatsApp est maintenant sélectionné par défaut pour un service premium
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

  const grandTotal = cartTotal + shippingCost;
  
  const orderRouting = useMemo(() => {
    const agents = contactInfo.whatsAppAgents || [];
    const activeAgents = agents.filter(a => a.active);
    
    if (country !== 'Mali') {
      const exportAgent = activeAgents.find(a => a.role === 'export');
      if (exportAgent) return { agent: exportAgent, label: 'Service Export' };
    }
    
    const threshold = siteSettings.wholesaleThreshold || 200000;
    if (cartTotal >= threshold) {
      const wholesaleAgent = activeAgents.find(a => a.role === 'wholesale');
      if (wholesaleAgent) return { agent: wholesaleAgent, label: 'Direction Commerciale (Grossiste)' };
    }
    
    const retailAgent = activeAgents.find(a => a.role === 'retail') || activeAgents.find(a => a.role === 'general');
    return { agent: retailAgent || activeAgents[0], label: 'Conseiller Privé' };
  }, [contactInfo, country, cartTotal, siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppCheckout = () => {
    if (!formData.name || !formData.phone) {
      toast.error("Merci de renseigner votre nom et téléphone.");
      return;
    }
    
    const { agent, label } = orderRouting;
    if (!agent) {
      toast.error("Service client WhatsApp temporairement indisponible.");
      return;
    }

    const cleanPhone = agent.phone.replace(/[^0-9]/g, '');
    const itemList = cart.map(item => `• ${item.name} (x${item.quantity})`).join('\n');
    
    const message = `*COMMANDE PRIVÉE DJONKOUD PARFUM*\n\n` +
      `👤 *Client:* ${formData.name}\n` +
      `📞 *Tel:* ${formData.phone}\n` +
      `🌍 *Destination:* ${country}\n` +
      `🛒 *Articles:*\n${itemList}\n\n` +
      `💰 *Total:* ${grandTotal.toLocaleString()} FCFA\n\n` +
      `_Je souhaite finaliser mon achat avec mon ${label}._`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePayment = async () => {
    if (paymentMethod === PaymentMethod.WHATSAPP) {
      handleWhatsAppCheckout();
      return;
    }
    
    if (!formData.name || !formData.phone || !formData.address) { toast.error("Informations de livraison requises"); return; }
    
    setLoading(true);
    try {
      const orderData = { ...formData, items: cart, total: grandTotal, paymentMethod, status: 'pending' };
      const response = await fetch('/api/orders', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(orderData) 
      });
      if (response.ok) { 
        clearCart(); 
        toast.success("Commande enregistrée !"); 
        navigate('/'); 
      }
    } catch (e) { toast.error("Erreur de connexion au serveur"); }
    finally { setLoading(false); }
  };

  const activePaymentMethods = siteSettings.paymentMethods?.filter(m => m.active) || [];

  return (
    <div className="bg-neutral-950 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-white mb-2 tracking-tight">Espace de Règlement</h1>
          <div className="h-1 w-24 bg-amber-600 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Formulaire et Choix de paiement */}
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
                    <option value="Europe">Autre Europe 🇪🇺</option>
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
                {/* WHATSAPP PREMIUM - PRIORITAIRE */}
                <button 
                  onClick={() => setPaymentMethod(PaymentMethod.WHATSAPP)}
                  className={`w-full p-6 border-2 transition-all text-left relative overflow-hidden group ${
                    paymentMethod === PaymentMethod.WHATSAPP 
                    ? 'border-green-600 bg-green-950/20 shadow-[0_0_20px_rgba(22,163,74,0.15)]' 
                    : 'border-neutral-800 bg-black hover:border-green-900'
                  }`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-5">
                      <div className="w-14 h-14 bg-green-600 flex items-center justify-center shadow-xl">
                         <MessageCircle size={28} className="text-white" fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xl">Service Conciergerie WhatsApp</h3>
                        <p className="text-neutral-400 text-sm mt-1">Finalisez votre commande en direct avec un expert <strong>Djonkoud</strong>.</p>
                        <div className="flex gap-2 mt-3">
                           <span className="text-[8px] bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">RECOMMANDÉ</span>
                           <span className="text-[8px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-bold">DISPONIBLE AU MALI</span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === PaymentMethod.WHATSAPP ? 'border-green-500 bg-green-600 scale-110' : 'border-neutral-700'}`}>
                       {paymentMethod === PaymentMethod.WHATSAPP && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </button>

                {/* AUTRES MÉTHODES */}
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
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === method.id ? 'border-amber-500 bg-amber-500' : 'border-neutral-800'}`}>
                         {paymentMethod === method.id && <Check size={10} className="text-black font-bold" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Résumé Panier */}
          <div className="lg:col-span-2">
            <div className="bg-black border border-amber-900/30 p-8 sticky top-24 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <MessageCircle size={100} />
              </div>
              
              <h2 className="font-serif text-2xl text-white mb-8 border-b border-neutral-800 pb-5">Récapitulatif</h2>
              
              <div className="space-y-4 mb-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                       <img src={item.image} className="w-10 h-10 object-cover border border-neutral-800" alt={item.name} />
                       <span className="text-neutral-300">{item.name} <span className="text-neutral-500 ml-1">x{item.quantity}</span></span>
                    </div>
                    <span className="text-neutral-100 font-mono">{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-neutral-800">
                <div className="flex justify-between text-neutral-400 text-sm">
                  <span>Sous-total</span>
                  <span>{cartTotal.toLocaleString()} {CURRENCY}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-sm">
                  <span>Frais de livraison ({country})</span>
                  <span>+ {shippingCost.toLocaleString()} {CURRENCY}</span>
                </div>
                <div className="flex justify-between text-2xl font-serif font-bold text-amber-500 pt-6">
                  <span>Total</span>
                  <span>{grandTotal.toLocaleString()} {CURRENCY}</span>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <Button 
                  fullWidth 
                  onClick={handlePayment} 
                  disabled={loading || !paymentMethod}
                  className={`py-5 text-lg transition-all ${paymentMethod === PaymentMethod.WHATSAPP ? 'bg-green-600 border-none shadow-[0_10px_30px_rgba(22,163,74,0.3)]' : ''}`}
                >
                  {loading ? <Loader2 size={24} className="animate-spin" /> : 
                   paymentMethod === PaymentMethod.WHATSAPP ? (
                     <span className="flex items-center gap-2">Finaliser sur WhatsApp <ArrowRight size={20}/></span>
                   ) : 'Confirmer la commande'}
                </Button>
                
                <p className="text-[10px] text-center text-neutral-500 uppercase tracking-[0.2em] pt-4">
                  Savoir-faire Malien • Expédition Sécurisée
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
