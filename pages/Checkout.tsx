import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MessageCircle, Phone, Loader2, Globe, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { contactInfo } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'WAVE' | 'OM' | 'CARD' | null>(null);
  
  // Gestion Internationale
  const [country, setCountry] = useState('Mali');
  const [shippingCost, setShippingCost] = useState(0);

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

  const grandTotal = cartTotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    
    const adminPhone = contactInfo.phone.replace(/[^0-9]/g, ''); 

    let message = `*NOUVELLE COMMANDE INTERNATIONALE (${country.toUpperCase()})*\n\n`;
    message += `👤 *Client:* ${formData.name || 'Non spécifié'}\n`;
    message += `🌍 *Pays:* ${country}\n`;
    message += `Cw *Ville:* ${formData.city || 'Non spécifié'}\n`;
    message += `📞 *Tel:* ${formData.phone || 'Non spécifié'}\n`;
    message += `📍 *Adresse:* ${formData.address || 'Non spécifié'}\n\n`;
    message += `🛒 *PANIER:*\n`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${item.price.toLocaleString()} FCFA)\n`;
    });

    message += `\n📦 *Livraison:* ${shippingCost.toLocaleString()} ${CURRENCY}\n`;
    message += `💰 *TOTAL FINAL: ${grandTotal.toLocaleString()} ${CURRENCY}*\n`;
    
    if (formData.instructions) {
      message += `📝 *Note:* ${formData.instructions}`;
    }

    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast.success("Redirection vers WhatsApp...");
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
        status: 'paid'
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
             </div>

             <div className="flex justify-between mb-8 text-2xl text-amber-500 font-serif font-bold">
               <span>Total</span>
               <span>{grandTotal.toLocaleString()} {CURRENCY}</span>
             </div>
             
             {/* International Warning */}
             {country !== 'Mali' && (
                <div className="mb-6 p-3 bg-blue-900/20 border border-blue-800/50 text-xs text-blue-200">
                  <span className="font-bold">🌍 Note International :</span> Pour les livraisons hors Mali, nous recommandons de passer par WhatsApp pour organiser la logistique (DHL, GP, etc.) et confirmer les frais.
                </div>
             )}

             {/* WhatsApp Option - High Priority */}
             <div className="mb-6 p-4 bg-green-950/30 border border-green-600/50 rounded shadow-lg shadow-green-900/10">
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-sm shadow-md"
                >
                  <MessageCircle size={18} /> 
                  {country === 'Mali' ? 'Commander sur WhatsApp' : 'Devis International (WhatsApp)'}
                </button>
             </div>

             <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-neutral-800"></div>
                <span className="flex-shrink-0 mx-4 text-neutral-500 text-xs uppercase">Ou paiement direct</span>
                <div className="flex-grow border-t border-neutral-800"></div>
             </div>

             <div className="space-y-3 mb-8">
               {(country === 'Mali' || country === 'CoteIvoire' || country === 'Senegal') && (
                 <>
                   <button onClick={() => setPaymentMethod('WAVE')} className={`w-full p-3 border flex justify-between ${paymentMethod === 'WAVE' ? 'border-amber-500 bg-amber-900/20' : 'border-neutral-700'}`}>
                     <span className="text-blue-400 font-bold">Wave</span>
                   </button>
                   <button onClick={() => setPaymentMethod('OM')} className={`w-full p-3 border flex justify-between ${paymentMethod === 'OM' ? 'border-amber-500 bg-amber-900/20' : 'border-neutral-700'}`}>
                     <span className="text-orange-500 font-bold">Orange Money</span>
                   </button>
                 </>
               )}
               
               <button onClick={() => setPaymentMethod('CARD')} className={`w-full p-3 border flex justify-between ${paymentMethod === 'CARD' ? 'border-amber-500 bg-amber-900/20' : 'border-neutral-700'}`}>
                 <span className="text-white font-bold flex items-center gap-2"><CreditCard size={16}/> Carte Bancaire (Visa/Mastercard)</span>
               </button>
             </div>

             <Button fullWidth onClick={handlePayment} disabled={loading}>
               {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18}/> Traitement...</span> : 'Confirmer la Commande'}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;