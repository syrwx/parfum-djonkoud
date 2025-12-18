
import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MessageCircle, Loader2, Globe, Truck, Check, Smartphone, DollarSign, ShieldCheck, UserCheck, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Coupon, PaymentMethod, WhatsAppAgent } from '../types';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { contactInfo, siteSettings } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(PaymentMethod.WHATSAPP); // WhatsApp par défaut
  
  const [country, setCountry] = useState('Mali');
  const [shippingCost, setShippingCost] = useState(0);

  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

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
      case 'France': case 'Europe': case 'USA': setShippingCost(15000); break;
      default: setShippingCost(10000);
    }
  }, [country]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return (cartTotal * appliedCoupon.value) / 100;
    return appliedCoupon.value;
  }, [appliedCoupon, cartTotal]);

  const grandTotal = Math.max(0, cartTotal + shippingCost - discountAmount);
  
  // LOGIQUE DE ROUTAGE WHATSAPP INTELLIGENTE
  const orderRouting = useMemo(() => {
    const agents = contactInfo.whatsAppAgents || [];
    const activeAgents = agents.filter(a => a.active);
    
    // 1. Priorité Export
    if (country !== 'Mali') {
      const exportAgent = activeAgents.find(a => a.role === 'export');
      if (exportAgent) return { agent: exportAgent, label: 'Service Exportation' };
    }
    
    // 2. Priorité Grossiste
    const threshold = siteSettings.wholesaleThreshold || 200000;
    if (cartTotal >= threshold) {
      const wholesaleAgent = activeAgents.find(a => a.role === 'wholesale');
      if (wholesaleAgent) return { agent: wholesaleAgent, label: 'Service Grossiste' };
    }
    
    // 3. Retail / Individuel
    const retailAgent = activeAgents.find(a => a.role === 'retail') || activeAgents.find(a => a.role === 'general');
    return { agent: retailAgent || activeAgents[0], label: 'Conseiller Clientèle' };
  }, [contactInfo, country, cartTotal, siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    if (!formData.name || !formData.phone) {
      toast.error("Merci d'indiquer votre nom et téléphone.");
      return;
    }
    
    const { agent, label } = orderRouting;
    if (!agent) {
      toast.error("Service de messagerie indisponible.");
      return;
    }

    const cleanPhone = agent.phone.replace(/[^0-9]/g, '');
    const itemList = cart.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    
    const message = `*COMMANDE DJONKOUD PARFUM*\n\n` +
      `👤 *Client:* ${formData.name}\n` +
      `📞 *Tel:* ${formData.phone}\n` +
      `🌍 *Destination:* ${country}\n` +
      `📦 *Articles:*\n${itemList}\n\n` +
      `💰 *Total:* ${grandTotal.toLocaleString()} FCFA\n` +
      `🛠 *Service:* ${label}\n\n` +
      `_Je souhaite finaliser mon achat via WhatsApp._`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePayment = async () => {
    if (!paymentMethod) { toast.error("Veuillez choisir un mode de paiement"); return; }
    
    // Si c'est WhatsApp, on lance la redirection
    if (paymentMethod === PaymentMethod.WHATSAPP) {
      handleWhatsAppCheckout();
      return;
    }
    
    if (!formData.name || !formData.phone || !formData.address) { toast.error("Informations de livraison incomplètes"); return; }
    setLoading(true);
    try {
      const orderData = { ...formData, items: cart, total: grandTotal, paymentMethod, status: 'pending' };
      const response = await fetch('/api/orders', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(orderData) 
      });
      if (response.ok) { clearCart(); toast.success("Commande enregistrée !"); navigate('/'); }
      else throw new Error();
    } catch (e) { toast.error("Erreur serveur"); }
    finally { setLoading(false); }
  };

  const activePaymentMethods = siteSettings.paymentMethods?.filter(m => m.active) || [];

  return (
    <div className="bg-neutral-950 min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl text-white mb-2">Finaliser votre commande</h1>
          <p className="text-neutral-500 uppercase tracking-[0.2em] text-xs">Expédition & Paiement Sécurisé</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-neutral-900/40 border border-neutral-800 p-8 shadow-xl">
              <h2 className="text-xl text-amber-500 font-serif mb-6 flex items-center gap-3">
                <Truck className="text-amber-600" /> Informations de Livraison
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Destination</label>
                  <select 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    className="w-full bg-black border border-neutral-800 p-4 text-white outline-none focus:border-amber-600 font-bold"
                  >
                    <option value="Mali">Mali 🇲🇱</option>
                    <option value="CoteIvoire">Côte d'Ivoire 🇨🇮</option>
                    <option value="Senegal">Sénégal 🇸🇳</option>
                    <option value="France">France 🇫🇷</option>
                    <option value="Europe">Europe 🇪🇺</option>
                    <option value="USA">USA/Canada 🇺🇸</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Nom Complet</label>
                  <input name="name" type="text" placeholder="Ex: Fatoumata Keïta" value={formData.name} onChange={handleInputChange} className="w-full bg-black border border-neutral-800 p-4 text-white outline-none focus:border-amber-600" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Téléphone</label>
                  <input name="phone" type="text" placeholder="+223 ..." value={formData.phone} onChange={handleInputChange} className="w-full bg-black border border-neutral-800 p-4 text-white outline-none focus:border-amber-600 font-mono" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Adresse de livraison</label>
                  <input name="address" type="text" placeholder="Quartier, Rue, Porte..." value={formData.address} onChange={handleInputChange} className="w-full bg-black border border-neutral-800 p-4 text-white outline-none focus:border-amber-600" />
                </div>
              </div>
            </section>

            <section className="bg-neutral-900/40 border border-neutral-800 p-8 shadow-xl">
              <h2 className="text-xl text-amber-500 font-serif mb-6 flex items-center gap-3">
                <CreditCard className="text-amber-600" /> Mode de Règlement
              </h2>
              
              <div className="grid gap-4">
                {/* WHATSAPP - TOUJOURS DISPONIBLE ET MIS EN AVANT */}
                {activePaymentMethods.some(m => m.id === PaymentMethod.WHATSAPP) && (
                  <button 
                    onClick={() => setPaymentMethod(PaymentMethod.WHATSAPP)}
                    className={`relative p-6 border-2 transition-all text-left group overflow-hidden ${
                      paymentMethod === PaymentMethod.WHATSAPP 
                      ? 'border-green-600 bg-green-950/20' 
                      : 'border-amber-900/30 bg-black hover:border-green-800'
                    }`}
                  >
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-green-600 flex items-center justify-center rounded-none shadow-lg">
                           <MessageCircle size={24} className="text-white" fill="currentColor" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            Conseiller Privé WhatsApp
                            <span className="bg-green-600 text-[8px] px-1 py-0.5 rounded text-white animate-pulse">RECOMMANDÉ</span>
                          </h3>
                          <p className="text-neutral-400 text-sm mt-1">Échangez avec notre <strong>{orderRouting.label}</strong> pour finaliser.</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === PaymentMethod.WHATSAPP ? 'border-green-500 bg-green-600' : 'border-neutral-700'}`}>
                         {paymentMethod === PaymentMethod.WHATSAPP && <Check size={14} className="text-white" />}
                      </div>
                    </div>
                  </button>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {activePaymentMethods.filter(m => m.id !== PaymentMethod.WHATSAPP).map(method => (
                    <button 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`flex items-center justify-between p-4 border transition-all ${
                        paymentMethod === method.id 
                        ? 'border-amber-500 bg-amber-950/20' 
                        : 'border-neutral-800 bg-black hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-amber-600">
                          {method.id === 'WAVE' || method.id === 'ORANGE_MONEY' ? <Smartphone size={18} /> : 
                           method.id === 'CARD' ? <CreditCard size={18} /> : <DollarSign size={18} />}
                        </div>
                        <span className="text-sm font-bold text-neutral-200">{method.name}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === method.id ? 'border-amber-500 bg-amber-500' : 'border-neutral-800'}`}>
                         {paymentMethod === method.id && <Check size={10} className="text-black" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-black border border-amber-900/30 p-8 sticky top-24 shadow-2xl">
              <h2 className="font-serif text-xl text-white mb-6 border-b border-neutral-800 pb-4">Résumé de commande</h2>
              <div className="space-y-3 mb-8 text-xs border-b border-neutral-800 pb-6">
                <div className="flex justify-between text-neutral-500">
                  <span>Sous-total</span>
                  <span>{cartTotal.toLocaleString()} {CURRENCY}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Livraison ({country})</span>
                  <span>+ {shippingCost.toLocaleString()} {CURRENCY}</span>
                </div>
                <div className="flex justify-between text-xl font-serif font-bold text-amber-500 pt-4">
                  <span>Total Final</span>
                  <span>{grandTotal.toLocaleString()} {CURRENCY}</span>
                </div>
              </div>

              <Button 
                fullWidth 
                onClick={handlePayment} 
                disabled={loading || !paymentMethod}
                className={`py-5 text-lg shadow-2xl ${paymentMethod === PaymentMethod.WHATSAPP ? 'bg-green-600 border-none' : ''}`}
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : 
                 paymentMethod === PaymentMethod.WHATSAPP ? 'Continuer sur WhatsApp' : 'Confirmer l\'achat'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
