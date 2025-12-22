import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { CURRENCY } from '../constants';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-3xl text-amber-500 mb-4">Votre panier est vide</h2>
        <p className="text-neutral-400 mb-8">Laissez-vous tenter par nos senteurs d'exception.</p>
        <Link to="/collection">
          <Button>Découvrir la collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-4xl text-white mb-12">Votre Panier</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-6 p-4 bg-neutral-900/50 border border-neutral-800">
              <div className="w-24 h-24 flex-shrink-0 bg-neutral-800">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-lg text-amber-100">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-neutral-600 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-amber-600 text-sm">{(item.price || 0).toLocaleString()} {CURRENCY}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border border-neutral-700">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-neutral-800 text-neutral-400"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm text-neutral-200 w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-neutral-800 text-neutral-400"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-neutral-900 border border-amber-900/30 p-6 sticky top-24">
            <h3 className="font-serif text-xl text-amber-100 mb-6 border-b border-neutral-800 pb-4">Résumé</h3>
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>Sous-total</span>
                <span>{(cartTotal || 0).toLocaleString()} {CURRENCY}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Livraison</span>
                <span className="italic text-xs">Calculé à l'étape suivante</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-amber-500 pt-4 border-t border-neutral-800">
                <span>Total</span>
                <span>{(cartTotal || 0).toLocaleString()} {CURRENCY}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button fullWidth>
                Procéder au paiement <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;