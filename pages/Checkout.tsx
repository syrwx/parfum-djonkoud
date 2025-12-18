
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MessageCircle, Loader2, Globe, Truck, Sparkles, Users, Ticket, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Coupon } from '../types';

// This component handles the final steps of the purchase process, including shipping address and payment method.
const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { contactInfo } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'WAVE' | 'OM' | 'CARD' | null>(null);
  
  // Gestion Internationale
  const [country, setCountry] = useState('Mali');
  const [shippingCost, setShippingCost] = useState(0);

  // Gestion Codes Promo
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    instructions: ''
  });

  // Calcul automatique des frais de port
  useEffect(() => {
    switch (country) {
      case 'Mali':
        setShippingCost(1500); // Livraison standard Bamako
        break;
      case 'CoteIvoire':
      case 'Senegal':
        setShippingCost(5000); // Bus / Transporteur sous-régional
        break;
      case 'France':
      case 'Europe':
      case 'USA':
        setShippingCost(15000); // GP ou DHL (Participation aux frais)
        break;
      default:
        setShippingCost(10000);
    }
  }, [country]);

  // --- LOGIQUE REMISE ---
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
        return (cartTotal * appliedCoupon.value) / 100;
    }
    return appliedCoupon.value;
  };

  const discountAmount = calculateDiscount();
  const grandTotal = Math.max(0, cartTotal + shippingCost - discountAmount);
  const isInternational = country !== 'Mali';

  // --- LOGIQUE DE SÉLECTION INTELLIGENTE DE L'AGENT ---
  const getTargetAgent = () => {
     const agents = contactInfo.whatsAppAgents || [];
     
     // 1. Si International -> Chercher agent 'export'
     if (isInternational) {
       const exportAgent = agents.find(a => a.role === 'export' && a.active);
       if (exportAgent) return exportAgent;
     }

     // 2. Si grosse commande (> 100,000 FCFA) -> Chercher agent 'wholesale'
     if (cartTotal > 100000) {
        const wholesaleAgent = agents.find(a => a.role === 'wholesale' && a.active);
        if (wholesaleAgent) return wholesaleAgent;
     }

     // 3. Sinon -> Chercher agent 'general' ou le premier dispo
     const generalAgent = agents.find(a => a.role === 'general' && a.active);
     return generalAgent || agents[0];
  };

  const handleVerifyCoupon = async () => {
    if (!promoCode) return;
    setVerifyingCode(true);
    try {
        const res = await fetch('/api/coupons/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: promoCode })
        });
        const data = await res.json();
        
        if (data.valid) {
            setAppliedCoupon(data.coupon);
            toast.success("Code promo appliqué !");
        } else {
            toast.error(data.message || "Code invalide");
            setAppliedCoupon(null);
        }
    } catch (e) {
        toast.error("Erreur vérification");
    } finally {
        setVerifyingCode(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    
    const targetAgent = getTargetAgent();
    
    if (!targetAgent || !targetAgent.phone) {
        toast.error("Service WhatsApp momentanément indisponible.");
        return;
    }

    // Nettoyage du numéro
    const cleanPhone = targetAgent.phone.replace(/[^0-9]/g, ''); 

    let message = `*NOUVELLE COMMANDE (${country.toUpperCase()})*\n`;
    message += `Destinataire: *${targetAgent.name}*\n\n`;
    message += `👤 *Client:* ${formData.name || 'Non spécifié'}\n`;
    message += `🌍 *Pays:* ${country}\n`;
    message += `📞 *Tel:* ${formData.phone || 'Non spécifié'}\n`;
    message += `📍 *Adresse:* ${formData.address || 'Non spécifié'}\n\n`;
    message += `🛒 *PANIER:*\n`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${item.price.toLocaleString()} FCFA)\n`;
    });

    message += `\n📦 *Livraison:* ${shippingCost.toLocaleString()} ${CURRENCY}\n`;
    
    if (appliedCoupon) {
      message += `🎟 *Code Promo:* ${appliedCoupon.code} (-${discountAmount.toLocaleString()} FCFA)\n`;
    }

    message += `💰 *TOTAL FINAL: ${grandTotal.toLocaleString()} ${CURRENCY}*\n`;
    
    if (formData.instructions) {
      message += `📝 *Note:* ${formData.instructions}`;
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast.success(`Redirection vers ${targetAgent.name}...`);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Veuillez choisir un mode de paiement");
      return;
    }
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Veuillez remplir les informations de livraison");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: formData.name,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${country}`,
        instructions: formData.instructions,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: grandTotal,
        paymentMethod: paymentMethod,
        status: 'paid',
        discountApplied: appliedCoupon ? {
          code: appliedCoupon.code,
          amount: discountAmount
        } : undefined
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        clearCart();
        toast.success("Commande confirmée !");
        navigate('/');
      } else {
        throw new Error(data.error || "Erreur serveur");
      }
      
    } catch (error) {
      console.error("Erreur paiement:", error);
      toast.error("Erreur lors de la communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const activeAgent = getTargetAgent();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-amber-50 mb-8 text-center">Expédition & Paiement</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="space-y-6">
          <h2 className="text-xl text-amber-200 border-b border-neutral-800 pb-2 flex items-center gap-2">
            <Globe size={20} /> Destination
          </h2>
          
          <div className="space-y-4">
            {/* Country Selector */}
            <div>
              <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Pays de livraison</label>
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-neutral-900 border border-amber-900/50 p-3 text-white focus:border-amber-500 outline-none font-bold"
              >
                <option value="Mali">🇲🇱 Mali (Bamako & Régions)</option>
                <option value="CoteIvoire">🇨🇮 Côte d'Ivoire</option>
                <option value="Senegal">🇸🇳 Sénégal</option>
                <option value="France">🇫🇷 France</option>
                <option value="USA">🇺🇸 États-Unis</option>
                <option value="Europe">🇪🇺 Autre (Europe)</option>
              </select>
            </div>

            <input 
              name="name" type="text" placeholder="Nom Complet" 
              value={formData.name} onChange={handleInputChange}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" 
            />
            
            <div className="grid grid-cols-2 gap-4">
               <input 
                name="city" type="text" placeholder="Ville" 
                value={formData.city} onChange={handleInputChange}
                className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" 
              />
              <input 
                name="phone" type="text" placeholder="Téléphone (avec indicatif)" 
                value={formData.phone} onChange={handleInputChange}
                className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" 
              />
            </div>

            <input 
              name="address" type="text" placeholder="Adresse précise (Quartier, Rue...)" 
              value={formData.address} onChange={handleInputChange}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" 
            />
            <textarea 
              name="instructions" placeholder="Instructions particulières..." 
              value={formData.instructions} onChange={handleInputChange}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none h-24"
            ></textarea>
          </div>
        </div>

        {/* Payment & Summary */}
        <div className="space-y-6">
          <h2 className="text-xl text-amber-200 border-b border-neutral-800 pb-2">Récapitulatif</h2>
          <div className="bg-neutral-900/50 p-6 border border-neutral-800">
             
             <div className="space-y-2 mb-6 border-b border-neutral-800 pb-4 text-sm">
               <div className="flex justify-between text-neutral-400">
                 <span>Sous-total Panier</span>
                 <span>{cartTotal.toLocaleString()} {CURRENCY}</span>
               </div>
               <div className="flex justify-between text-amber-400">
                 <span className="flex items-center gap-2"><Truck size={14}/> Livraison ({country})</span>
                 <span>{shippingCost === 0 ? 'Gratuit' : `+ ${shippingCost.toLocaleString()} ${CURRENCY}`}</span>
               </div>
               {appliedCoupon && (
                 <div className="flex justify-between text-green-500 animate-fade-in">
                    <span className="flex items-center gap-2"><Ticket size={14}/> Code Promo ({appliedCoupon.code})</span>
                    <span>- {discountAmount.toLocaleString()} {CURRENCY}</span>
                 </div>
               )}
             </div>

             {/* Code Promo Input */}
             <div className="mb-6">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={promoCode} 
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="CODE PROMO"
                        className="flex-1 bg-black border border-neutral-700 p-2 text-white text-sm outline-none focus:border-amber-500 uppercase font-mono tracking-wider"
                        disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                        <button 
                            onClick={() => { setAppliedCoupon(null); setPromoCode(''); }}
                            className="px-3 bg-neutral-800 text-neutral-400 hover:text-white"
                        >
                            <span className="text-xs uppercase">Retirer</span>
                        </button>
                    ) : (
                        <button 
                            onClick={handleVerifyCoupon}
                            disabled={verifyingCode || !promoCode}
                            className="px-3 bg-neutral-800 border border-neutral-700 text-amber-500 hover:bg-neutral-700 disabled:opacity-50"
                        >
                            {verifyingCode ? <Loader2 size={16} className="animate-spin"/> : <span className="text-xs uppercase font-bold">Appliquer</span>}
                        </button>
                    )}
                </div>
             </div>

             <div className="flex justify-between mb-8 text-2xl text-amber-500 font-serif font-bold">
               <span>Total</span>
               <span>{grandTotal.toLocaleString()} {CURRENCY}</span>
             </div>
             
             {/* International Logic UI */}
             {isInternational ? (
               <div className="space-y-4">
                 <div className="p-4 bg-gradient-to-r from-amber-900/40 to-black border border-amber-500/50 rounded animate-fade-in">
                    <h3 className="text-amber-400 font-bold flex items-center gap-2 mb-2">
                      <Sparkles size={18} /> Service Export VIP
                    </h3>
                    <p className="text-sm text-amber-200/70">
                      Votre commande est internationale. Un agent dédié ({activeAgent?.name}) traitera votre demande personnellement pour assurer une expédition sécurisée.
                    </p>
                 </div>
                 
                 <Button 
                   fullWidth 
                   onClick={handleWhatsAppCheckout}
                   className="bg-green-600 hover:bg-green-500 text-white border-none py-4"
                 >
                   <MessageCircle size={20} /> Finaliser via WhatsApp
                 </Button>
               </div>
             ) : (
               <div className="space-y-4">
                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setPaymentMethod('WAVE')}
                      className={`flex items-center justify-between p-4 border transition-all ${paymentMethod === 'WAVE' ? 'border-amber-500 bg-amber-900/20' : 'border-neutral-800 bg-black'}`}
                    >
                      <span className="font-bold text-white">WAVE / Mobile Money</span>
                      <Check size={20} className={paymentMethod === 'WAVE' ? 'text-amber-500' : 'text-transparent'} />
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('CARD')}
                      className={`flex items-center justify-between p-4 border transition-all ${paymentMethod === 'CARD' ? 'border-amber-500 bg-amber-900/20' : 'border-neutral-800 bg-black'}`}
                    >
                      <span className="font-bold text-white">Carte Bancaire / VISA</span>
                      <CreditCard size={20} className={paymentMethod === 'CARD' ? 'text-amber-500' : 'text-transparent'} />
                    </button>
                 </div>
                 
                 <Button 
                   fullWidth 
                   onClick={handlePayment}
                   disabled={loading || !paymentMethod}
                   className="py-4"
                 >
                   {loading ? <Loader2 size={20} className="animate-spin" /> : 'Confirmer la Commande'}
                 </Button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
