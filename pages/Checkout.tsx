import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MessageCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { contactInfo } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'WAVE' | 'OM' | 'CARD' | null>(null);
  
  // États du formulaire
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    instructions: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    
    // 1. Nettoyage du numéro de téléphone (enlever les espaces, le +223, etc. pour l'URL)
    // On suppose que contactInfo.phone est le numéro du service client
    const adminPhone = contactInfo.phone.replace(/[^0-9]/g, ''); 

    // 2. Construction du message
    let message = `*NOUVELLE COMMANDE DJONKOUD*\n\n`;
    message += `👤 *Client:* ${formData.name || 'Non spécifié'}\n`;
    message += `📞 *Tel:* ${formData.phone || 'Non spécifié'}\n`;
    message += `📍 *Lieu:* ${formData.address || 'Non spécifié'}\n\n`;
    message += `🛒 *PANIER:*\n`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${item.price.toLocaleString()} FCFA)\n`;
    });

    message += `\n💰 *TOTAL: ${cartTotal.toLocaleString()} ${CURRENCY}*\n`;
    
    if (formData.instructions) {
      message += `📝 *Note:* ${formData.instructions}`;
    }

    // 3. Encodage et Redirection
    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // Optionnel : Vider le panier après redirection ou demander confirmation
    // clearCart(); 
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
      /* 
         [API INTEGRATION] PAIEMENT
         C'est ici que vous connectez les vraies APIs de paiement.
      */
      
      console.log(`Processing ${paymentMethod} payment for ${cartTotal}`);
      
      // Simulation de succès pour la démo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      toast.success("Commande confirmée ! Merci de votre confiance.");
      navigate('/');
      
    } catch (error) {
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-amber-50 mb-8 text-center">Finaliser la Commande</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="space-y-6">
          <h2 className="text-xl text-amber-200 border-b border-neutral-800 pb-2">Informations de Livraison</h2>
          <div className="space-y-4">
            <input 
              name="name"
              type="text" 
              placeholder="Nom Complet" 
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" 
            />
            <input 
              name="phone"
              type="text" 
              placeholder="Numéro de Téléphone" 
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" 
            />
            <input 
              name="address"
              type="text" 
              placeholder="Quartier / Commune (ex: ACI 2000)" 
              value={formData.address}
              onChange={handleInputChange}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" 
            />
            <textarea 
              name="instructions"
              placeholder="Instructions pour le livreur (ex: À côté de la mosquée...)" 
              value={formData.instructions}
              onChange={handleInputChange}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none h-32"
            ></textarea>
          </div>
        </div>

        {/* Payment & WhatsApp */}
        <div className="space-y-6">
          <h2 className="text-xl text-amber-200 border-b border-neutral-800 pb-2">Paiement</h2>
          <div className="bg-neutral-900/50 p-6 border border-neutral-800">
             <div className="flex justify-between mb-6 text-xl text-amber-500 font-bold">
               <span>Total à payer</span>
               <span>{cartTotal.toLocaleString()} {CURRENCY}</span>
             </div>
             
             {/* WhatsApp Option - High Priority */}
             <div className="mb-8 p-4 bg-green-950/30 border border-green-600/50 rounded shadow-lg shadow-green-900/10">
                <h3 className="text-green-400 font-bold flex items-center gap-2 mb-2 text-lg">
                  <MessageCircle size={22} fill="currentColor" className="text-green-500" /> Recommandé
                </h3>
                <p className="text-sm text-neutral-300 mb-4">
                  Commandez directement avec un agent sur WhatsApp. Paiement à la livraison ou par transfert.
                </p>
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-sm shadow-md"
                >
                  <MessageCircle size={18} /> Finaliser sur WhatsApp
                </button>
             </div>

             <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-neutral-800"></div>
                <span className="flex-shrink-0 mx-4 text-neutral-500 text-xs uppercase">Ou paiement en ligne</span>
                <div className="flex-grow border-t border-neutral-800"></div>
             </div>

             <div className="space-y-4 mb-8 mt-4">
               <button 
                onClick={() => setPaymentMethod('WAVE')}
                className={`w-full p-4 border flex items-center justify-between transition-all ${paymentMethod === 'WAVE' ? 'border-amber-500 bg-amber-900/10' : 'border-neutral-700 hover:border-neutral-500'}`}
               >
                 <span className="font-bold text-blue-400">Wave</span>
                 <div className="w-4 h-4 rounded-full border border-neutral-500 flex items-center justify-center">
                   {paymentMethod === 'WAVE' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                 </div>
               </button>

               <button 
                onClick={() => setPaymentMethod('OM')}
                className={`w-full p-4 border flex items-center justify-between transition-all ${paymentMethod === 'OM' ? 'border-amber-500 bg-amber-900/10' : 'border-neutral-700 hover:border-neutral-500'}`}
               >
                 <span className="font-bold text-orange-500">Orange Money</span>
                 <div className="w-4 h-4 rounded-full border border-neutral-500 flex items-center justify-center">
                   {paymentMethod === 'OM' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                 </div>
               </button>

               <button 
                onClick={() => setPaymentMethod('CARD')}
                className={`w-full p-4 border flex items-center justify-between transition-all ${paymentMethod === 'CARD' ? 'border-amber-500 bg-amber-900/10' : 'border-neutral-700 hover:border-neutral-500'}`}
               >
                 <div className="flex items-center gap-3">
                   <CreditCard size={20} className="text-white"/>
                   <div className="text-left">
                     <span className="font-bold text-white block">Carte Bancaire</span>
                     <span className="text-[10px] text-neutral-400 block uppercase">Visa / Mastercard</span>
                   </div>
                 </div>
                 <div className="w-4 h-4 rounded-full border border-neutral-500 flex items-center justify-center">
                   {paymentMethod === 'CARD' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                 </div>
               </button>
             </div>

             <Button fullWidth onClick={handlePayment} disabled={loading}>
               {loading ? 'Traitement sécurisé...' : 'Payer la commande'}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;