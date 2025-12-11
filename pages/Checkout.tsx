import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { CURRENCY } from '../constants';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const { cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'WAVE' | 'OM' | 'CARD' | null>(null);

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Veuillez choisir un mode de paiement");
      return;
    }
    setLoading(true);

    try {
      /* 
         [API INTEGRATION] PAIEMENT
         C'est ici que vous connectez les vraies APIs de paiement.
      */
      
      if (paymentMethod === 'WAVE') {
        // [INTEGRATION WAVE]
        // 1. Appeler votre backend qui communique avec l'API Wave
        // const response = await fetch('/api/pay/wave', { body: { amount: cartTotal } });
        // const { paymentUrl } = await response.json();
        // window.location.href = paymentUrl; 
        console.log("Processing Wave Payment...");
      } 
      else if (paymentMethod === 'OM') {
        // [INTEGRATION ORANGE MONEY]
        // 1. Appeler API Orange Money Web Payment
        console.log("Processing Orange Money Payment...");
      } 
      else if (paymentMethod === 'CARD') {
        // [INTEGRATION STRIPE / MASTERCARD]
        // 1. Utiliser Stripe Elements ou redirection
        console.log("Processing Credit Card Payment...");
      }

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
      <h1 className="font-serif text-3xl text-amber-50 mb-8 text-center">Paiement Sécurisé</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="space-y-6">
          <h2 className="text-xl text-amber-200 border-b border-neutral-800 pb-2">Adresse de Livraison</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Nom Complet" className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" />
            <input type="text" placeholder="Numéro de Téléphone" className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" />
            <input type="text" placeholder="Quartier / Commune" className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none" />
            <textarea placeholder="Instructions pour le livreur (ex: À côté de la mosquée...)" className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none h-32"></textarea>
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-6">
          <h2 className="text-xl text-amber-200 border-b border-neutral-800 pb-2">Paiement</h2>
          <div className="bg-neutral-900/50 p-6 border border-neutral-800">
             <div className="flex justify-between mb-6 text-xl text-amber-500 font-bold">
               <span>Total à payer</span>
               <span>{cartTotal.toLocaleString()} {CURRENCY}</span>
             </div>
             
             <div className="space-y-4 mb-8">
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
                 <div className="flex items-center gap-2">
                   <CreditCard size={20} className="text-white"/>
                   <span className="font-bold text-white">Carte Bancaire (Visa/Mastercard)</span>
                 </div>
                 <div className="w-4 h-4 rounded-full border border-neutral-500 flex items-center justify-center">
                   {paymentMethod === 'CARD' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                 </div>
               </button>
             </div>

             <Button fullWidth onClick={handlePayment} disabled={loading}>
               {loading ? 'Traitement sécurisé...' : 'Payer maintenant'}
             </Button>
             <p className="text-center text-xs text-neutral-500 mt-4">Transaction chiffrée SSL. Aucune donnée bancaire stockée.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;