
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MessageCircle, Loader2, Globe, Truck, Sparkles, Ticket, Check, Smartphone, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { Coupon, PaymentMethod } from '../types';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { contactInfo, siteSettings } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  
  const [country, setCountry] = useState('Mali');
  const [shippingCost, setShippingCost] = useState(0);

  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

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

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return (cartTotal * appliedCoupon.value) / 100;
    return appliedCoupon.value;
  };

  const discountAmount = calculateDiscount();
  const grandTotal = Math.max(0, cartTotal + shippingCost - discountAmount);
  const isInternational = country !== 'Mali';

  const getTargetAgent = () => {
     const agents = contactInfo.whatsAppAgents || [];
     if (isInternational) {
       const exportAgent = agents.find(a => a.role === 'export' && a.active);
       if (exportAgent) return exportAgent;
     }
     if (cartTotal > 100000) {
        const wholesaleAgent = agents.find(a => a.role === 'wholesale' && a.active);
        if (wholesaleAgent) return wholesaleAgent;
     }
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
        if (data.valid) { setAppliedCoupon(data.coupon); toast.success("Code promo appliqué !"); }
        else { toast.error(data.message || "Code invalide"); setAppliedCoupon(null); }
    } catch (e) { toast.error("Erreur vérification"); }
    finally { setVerifyingCode(false); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const targetAgent = getTargetAgent();
    if (!targetAgent || !targetAgent.phone) { toast.error("Service WhatsApp indisponible."); return; }
    const cleanPhone = targetAgent.phone.replace(/[^0-9]/g, ''); 
    let message = `*NOUVELLE COMMANDE (${country.toUpperCase()})*\n👤 *Client:* ${formData.name}\n🌍 *Pays:* ${country}\n🛒 *PANIER:* ${cart.length} articles\n💰 *TOTAL FINAL: ${grandTotal.toLocaleString()} FCFA*`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePayment = async () => {
    if (!paymentMethod) { toast.error("Veuillez choisir un mode de paiement"); return; }
    if (!formData.name || !formData.phone || !formData.address) { toast.error("Informations de livraison incomplètes"); return; }
    setLoading(true);
    try {
      const orderData = { ...formData, items: cart, total: grandTotal, paymentMethod, status: 'paid' };
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
      if (response.ok) { clearCart(); toast.success("Commande confirmée !"); navigate('/'); }
      else throw new Error();
    } catch (e) { toast.error("Erreur serveur"); }
    finally { setLoading(false); }
  };

  const activePaymentMethods = siteSettings.paymentMethods?.filter(m => m.active) || [];

  const getIcon = (id: string) => {
    if (id === 'WAVE' || id === 'ORANGE_MONEY') return <Smartphone size={20} />;
    if (id === 'CARD') return <CreditCard size={20} />;
    return <DollarSign size={20} />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-amber-50 mb-8 text-center">Expédition & Paiement</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl text-amber-200 border-b border-neutral-800 pb-2 flex items-center gap-2"><Globe size={20} /> Destination</h2>
          <div className="space-y-4">
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-neutral-900 border border-amber-900/50 p-3 text-white outline-none font-bold">
              <option value="Mali">🇲🇱 Mali</option>
              <option value="CoteIvoire">🇨🇮 Côte d'Ivoire</option>
              <option value="Senegal">🇸🇳 Sénégal</option>
              <option value="France">🇫🇷 France</option>
            </select>
            <input name="name" type="text" placeholder="Nom Complet" value={formData.name} onChange={handleInputChange} className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white outline-none" />
            <input name="phone" type="text" placeholder="Téléphone" value={formData.phone} onChange={handleInputChange} className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white outline-none font-mono" />
            <input name="address" type="text" placeholder="Adresse" value={formData.address} onChange={handleInputChange} className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white outline-none" />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl text-amber-200 border-b border-neutral-800 pb-2">Récapitulatif</h2>
          <div className="bg-neutral-900/50 p-6 border border-neutral-800">
             <div className="space-y-2 mb-6 text-sm border-b border-neutral-800 pb-4">
               <div className="flex justify-between text-neutral-400"><span>Sous-total</span><span>{cartTotal.toLocaleString()} {CURRENCY}</span></div>
               <div className="flex justify-between text-amber-400"><span>Livraison ({country})</span><span>+ {shippingCost.toLocaleString()} {CURRENCY}</span></div>
               {appliedCoupon && <div className="flex justify-between text-green-500"><span>Remise</span><span>- {discountAmount.toLocaleString()} {CURRENCY}</span></div>}
             </div>
             <div className="flex justify-between mb-8 text-2xl text-amber-500 font-serif font-bold"><span>Total</span><span>{grandTotal.toLocaleString()} {CURRENCY}</span></div>
             
             {isInternational ? (
               <Button fullWidth onClick={handleWhatsAppCheckout} className="bg-green-600 hover:bg-green-500 text-white border-none py-4"><MessageCircle size={20} /> Finaliser via WhatsApp</Button>
             ) : (
               <div className="space-y-4">
                 <div className="flex flex-col gap-2">
                    {activePaymentMethods.length > 0 ? (
                      activePaymentMethods.map(method => (
                        <button 
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                          className={`flex items-center justify-between p-4 border transition-all ${paymentMethod === method.id ? 'border-amber-500 bg-amber-900/20' : 'border-neutral-800 bg-black'}`}
                        >
                          <span className="font-bold text-white flex items-center gap-3">{getIcon(method.id)} {method.name}</span>
                          <Check size={20} className={paymentMethod === method.id ? 'text-amber-500' : 'text-transparent'} />
                        </button>
                      ))
                    ) : (
                      <p className="text-red-500 text-center text-xs p-4 border border-dashed border-red-900">Aucun mode de paiement disponible pour le moment.</p>
                    )}
                 </div>
                 <Button fullWidth onClick={handlePayment} disabled={loading || !paymentMethod || activePaymentMethods.length === 0} className="py-4">
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
