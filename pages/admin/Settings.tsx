import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ContactInfo, SiteSettings } from '../../types';
import Button from '../../components/ui/Button';
import { Save, MapPin, Phone, Mail, Clock, Globe, Layout, Image as ImageIcon, Type } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { contactInfo, updateContactInfo, siteSettings, updateSiteSettings } = useStore();
  
  const [activeTab, setActiveTab] = useState<'contact' | 'appearance'>('contact');
  const [contactData, setContactData] = useState<ContactInfo>(contactInfo);
  const [appearanceData, setAppearanceData] = useState<SiteSettings>(siteSettings);

  // Sync state with global store
  useEffect(() => {
    setContactData(contactInfo);
    setAppearanceData(siteSettings);
  }, [contactInfo, siteSettings]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactData);
    toast.success("Informations de contact mises à jour");
  };

  const handleAppearanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(appearanceData);
    toast.success("Design de l'accueil mis à jour");
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppearanceData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 border-b border-amber-900/30 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white">Paramètres Généraux</h1>
          <p className="text-neutral-400 mt-2">Pilotez l'identité de votre marque.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-6 py-3 text-sm uppercase tracking-widest transition-all ${
            activeTab === 'contact' 
            ? 'bg-amber-600 text-white font-bold' 
            : 'bg-neutral-900 text-neutral-400 hover:text-amber-500'
          }`}
        >
          Contact & Réseaux
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-6 py-3 text-sm uppercase tracking-widest transition-all ${
            activeTab === 'appearance' 
            ? 'bg-amber-600 text-white font-bold' 
            : 'bg-neutral-900 text-neutral-400 hover:text-amber-500'
          }`}
        >
          Apparence & Accueil
        </button>
      </div>

      {/* CONTACT TAB */}
      {activeTab === 'contact' && (
        <form onSubmit={handleContactSubmit} className="space-y-8 animate-fade-in">
          <div className="bg-black border border-amber-900/30 p-6 relative overflow-hidden">
            <h2 className="text-lg font-serif text-amber-100 mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-amber-500" /> Coordonnées
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div className="md:col-span-2">
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Adresse Complète</label>
                <input 
                  type="text" name="address" value={contactData.address} onChange={handleContactChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2"><Phone size={12} className="inline mr-1"/> Téléphone</label>
                <input 
                  type="text" name="phone" value={contactData.phone} onChange={handleContactChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2"><Mail size={12} className="inline mr-1"/> Email</label>
                <input 
                  type="email" name="email" value={contactData.email} onChange={handleContactChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2"><Clock size={12} className="inline mr-1"/> Horaires</label>
                <input 
                  type="text" name="hours" value={contactData.hours} onChange={handleContactChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-black border border-amber-900/30 p-6">
            <h2 className="text-lg font-serif text-amber-100 mb-6 flex items-center gap-2">
              <Globe size={18} className="text-amber-500" /> Réseaux Sociaux
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Instagram</label>
                <input 
                  type="text" name="instagram" value={contactData.instagram || ''} onChange={handleContactChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Facebook</label>
                <input 
                  type="text" name="facebook" value={contactData.facebook || ''} onChange={handleContactChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Twitter</label>
                <input 
                  type="text" name="twitter" value={contactData.twitter || ''} onChange={handleContactChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit"><Save size={18} /> Sauvegarder Contact</Button>
          </div>
        </form>
      )}

      {/* APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <form onSubmit={handleAppearanceSubmit} className="space-y-8 animate-fade-in">
          <div className="bg-black border border-amber-900/30 p-6">
            <h2 className="text-lg font-serif text-amber-100 mb-6 flex items-center gap-2">
              <Layout size={18} className="text-amber-500" /> Page d'Accueil (Hero Section)
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Titre Principal</label>
                <input 
                  type="text" name="heroTitle" value={appearanceData.heroTitle} onChange={handleAppearanceChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none font-serif text-lg" 
                />
                <p className="text-xs text-neutral-500 mt-1">Le gros titre au centre de la page.</p>
              </div>

              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Slogan / Sous-titre</label>
                <textarea 
                  name="heroSlogan" value={appearanceData.heroSlogan} onChange={handleAppearanceChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none h-24" 
                />
              </div>

              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Badge (Petit texte au dessus du titre)</label>
                <input 
                  type="text" name="heroSubtitle" value={appearanceData.heroSubtitle} onChange={handleAppearanceChange}
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ImageIcon size={14} /> Image de Fond (URL)
                </label>
                <div className="flex gap-4 items-start">
                  <div className="flex-grow">
                    <input 
                      type="text" name="heroImage" value={appearanceData.heroImage} onChange={handleAppearanceChange}
                      className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                    />
                  </div>
                  <div className="w-24 h-24 bg-neutral-800 border border-neutral-700 flex-shrink-0 overflow-hidden">
                    <img src={appearanceData.heroImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit"><Save size={18} /> Sauvegarder Design</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;