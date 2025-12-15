import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Logo from '../Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-neutral-950/95 backdrop-blur-md shadow-lg border-b border-amber-900/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-amber-500 hover:text-amber-400 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-auto absolute md:relative left-0 md:left-auto pointer-events-none md:pointer-events-auto">
             <Link to="/" className="pointer-events-auto">
               <Logo className="h-10 md:h-12" />
             </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm uppercase tracking-widest hover:text-amber-400 transition-colors ${location.pathname === '/' ? 'text-amber-400 font-bold' : 'text-amber-100'}`}>Accueil</Link>
            <Link to="/shop" className={`text-sm uppercase tracking-widest hover:text-amber-400 transition-colors ${location.pathname === '/shop' ? 'text-amber-400 font-bold' : 'text-amber-100'}`}>Collection</Link>
            <Link to="/guide" className={`text-sm uppercase tracking-widest hover:text-amber-400 transition-colors ${location.pathname === '/guide' ? 'text-amber-400 font-bold' : 'text-amber-100'}`}>Guide IA</Link>
            <Link to="/about" className={`text-sm uppercase tracking-widest hover:text-amber-400 transition-colors ${location.pathname === '/about' ? 'text-amber-400 font-bold' : 'text-amber-100'}`}>La Maison</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link to="/shop" className="text-amber-100 hover:text-amber-400 transition-colors hidden sm:block" title="Rechercher un produit">
              <Search size={20} />
            </Link>
            {/* Lien Admin retiré pour invisibilité */}
            <Link to="/cart" className="relative text-amber-100 hover:text-amber-400 transition-colors">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-20 left-0 w-full bg-neutral-900 border-b border-amber-900/50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link to="/" className="block px-3 py-3 text-amber-100 hover:text-amber-400 uppercase tracking-widest border-b border-neutral-800">Accueil</Link>
          <Link to="/shop" className="block px-3 py-3 text-amber-100 hover:text-amber-400 uppercase tracking-widest border-b border-neutral-800">Collection</Link>
          <Link to="/guide" className="block px-3 py-3 text-amber-100 hover:text-amber-400 uppercase tracking-widest border-b border-neutral-800">Guide IA</Link>
          <Link to="/about" className="block px-3 py-3 text-amber-100 hover:text-amber-400 uppercase tracking-widest border-b border-neutral-800">La Maison</Link>
          {/* Lien Admin retiré du menu mobile */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;