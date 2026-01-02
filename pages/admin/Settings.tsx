import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { ContactInfo, SiteSettings, WhatsAppAgent, Billboard } from '../../types';
import Button from '../../components/ui/Button';
import { 
  Save, MapPin, Plus, Trash2, Edit2, Globe, Headphones, 
  Target, MessageCircle, ShieldAlert, Lock, Instagram, 
  Facebook, Twitter, Send, Video, Layout, Image as ImageIcon, 
  Users, X, Loader2, Sparkles, Monitor
} from 'lucide-react';
import toast from 'react-hot-toast';

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const Settings: React.FC = () => {
  const { contactInfo, updateContactInfo, siteSettings, updateSiteSettings, refreshSettings } = useStore();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'contact' | 'whatsapp' | 'ads' | 'appearance' | 'security'>('contact');
  const [contactData, setContactData] = useState<ContactInfo>(contactInfo);
  const [appearanceData, setAppearanceData] = useState<SiteSettings>(siteSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Partial<WhatsAppAgent> | null>(null);

  const [billboardData, setBillboardData] = useState<Billboard>(siteSettings.billboard || {
    active: false,
    title: '',
    subtitle: '',
    buttonText: 'Découvrir',
    link: '/collection',
    image: ''
  });

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  useEffect(() => {
    setContactData(contactInfo);
    setAppearanceData(siteSettings);
    if (siteSettings.billboard) {
      setBillboardData(siteSettings.billboard);
    }
  }, [contactInfo, siteSettings]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateContactInfo(contactData);
    setIsSaving(false);
    toast.success("Paramètres mis à jour");
  };

  const handleAppearanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSiteSettings(appearanceData);
    setIsSaving(false);
    toast.success("Design mis à jour");
  };

  const handleAdsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSiteSettings({ ...appearanceData, billboard: billboardData });
    setIsSaving(false);
    toast.success("Publicité mise à jour");
  };

  const saveAgent = async () => {
    if (!editingAgent || !editingAgent.name || !editingAgent.phone) {
      toast.error("Veuillez remplir tous les champs de l'agent");
      return;
    }
    
    let newAgents = [...contactData.whatsAppAgents];
    const existingIndex = newAgents.findIndex(a => a.id === editingAgent.id);
    
    if (existingIndex >= 0) {
      newAgents[existingIndex] = editingAgent as WhatsAppAgent;
    } else {
      newAgents.push({ 
        ...editingAgent, 
        id: Date.now().toString(), 
        active: true 
      } as WhatsAppAgent);
    }

    const newInfo = { ...contactData, whatsAppAgents: newAgents };
    setContactData(newInfo);
    await updateContactInfo(newInfo);
    setEditingAgent(null);
    toast.success("Agent WhatsApp enregistré");
  };

  const deleteAgent = async (id: string) => {
    if (!confirm("Supprimer cet agent ?")) return;
    const newAgents = contactData.whatsAppAgents.filter(a => a.id !== id);
    const newInfo = { ...contactData, whatsAppAgents: newAgents };
    setContactData(newInfo);
    await updateContactInfo(newInfo);
    toast.success("Agent supprimé");
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 border-b border-amber-900/30 pb-6">
        <h1 className="text-3xl font-serif text-white">Administration Centrale</h1>
        <p className="text-neutral-400 mt-2">Pilotez votre présence digitale et votre image de marque.</p>
      </div>

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setActiveTab('contact')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'contact' ? 'bg-amber-600 text-black font-bold' : 'bg-neutral-900 text-neutral-400'}`}>Contact & Social</button>
        <button onClick={() => setActiveTab('whatsapp')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'whatsapp' ? 'bg-[#25D366] text-black font-bold' : 'bg-neutral-900 text-[#25D366]'}`}><WhatsAppIcon size={16}/> WhatsApp</button>
        <button onClick={() => setActiveTab('ads')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'ads' ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-900 text-neutral-400'}`}><Layout size={16}/> Publicité</button>
        <button onClick={() => setActiveTab('appearance')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'appearance' ? 'bg-amber-600 text-black font-bold' : 'bg-neutral-900 text-neutral-400'}`}><Monitor size={16}/> Design</button>
        <button onClick={() => setActiveTab('security')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'security' ? 'bg-red-700 text-white font-bold' : 'bg-neutral-900 text-red-500'}`}><Lock size={16}/> Sécurité</button>
      </div>

      {activeTab === 'contact' && (
        <form onSubmit={handleContactSubmit} className="space-y-8 animate-fade-in">
          <div className="bg-black border border-amber-900/30 p-8 shadow-2xl">
            <h2 className="text-xl font-serif text-amber-100 mb-8 flex items-center gap-2"><MapPin size={20} className="text-amber-500" /> Coordonnées Maison</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Adresse</label>
                <input type="text" value={contactData.address} onChange={e => setContactData({...contactData, address: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Téléphone</label>
                <input type="text" value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none font-mono" />
              </div>
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Email</label>
                <input type="email" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-end"><Button type="submit" disabled={isSaving} className="px-12 py-4">{isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} Sauvegarder</Button></div>
        </form>
      )}

      {activeTab === 'ads' && (
        <form onSubmit={handleAdsSubmit} className="space-y-8 animate-fade-in">
          <div className="bg-black border border-amber-900/30 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-serif text-amber-100 flex items-center gap-2"><Layout size={20} className="text-amber-500" /> Panneau Publicitaire</h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">Statut</span>
                <button 
                  type="button"
                  onClick={() => setBillboardData({...billboardData, active: !billboardData.active})}
                  className={`w-12 h-6 flex items-center p-1 transition-colors ${billboardData.active ? 'bg-green-600' : 'bg-neutral-800'}`}
                >
                  <div className={`w-4 h-4 bg-white transition-transform ${billboardData.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Titre de la Publicité</label>
                <input type="text" value={billboardData.title} onChange={e => setBillboardData({...billboardData, title: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" placeholder="Ex: Promotion de Tabaski" />
              </div>
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Sous-titre / Description</label>
                <textarea value={billboardData.subtitle} onChange={e => setBillboardData({...billboardData, subtitle: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none h-24" placeholder="Ex: Profitez de -20% sur toute la collection Heritage." />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Texte du Bouton</label>
                  <input type="text" value={billboardData.buttonText} onChange={e => setBillboardData({...billboardData, buttonText: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Lien de redirection</label>
                  <input type="text" value={billboardData.link} onChange={e => setBillboardData({...billboardData, link: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">URL de l'image de fond</label>
                <div className="flex gap-4 items-center">
                  <input type="text" value={billboardData.image} onChange={e => setBillboardData({...billboardData, image: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" placeholder="https://..." />
                  <div className="w-20 h-20 bg-neutral-800 border border-neutral-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {billboardData.image ? <img src={billboardData.image} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-neutral-600" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end"><Button type="submit" disabled={isSaving} className="px-12 py-4"><Save size={18} /> Publier la Publicité</Button></div>
        </form>
      )}

      {activeTab === 'whatsapp' && (
        <div className="animate-fade-in space-y-8">
          <div className="bg-neutral-900 border border-[#25D366]/20 p-8 shadow-2xl">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-serif text-[#25D366] flex items-center gap-3"><WhatsAppIcon size={24}/> Experts WhatsApp</h2>
               <Button onClick={() => setEditingAgent({ name: '', phone: '', role: 'retail' })} variant="outline" className="border-[#25D366] text-[#25D366]"><Plus size={18} /> Ajouter</Button>
             </div>
             <div className="space-y-4">
               {contactData.whatsAppAgents.map(agent => (
                 <div key={agent.id} className="bg-black border border-neutral-800 p-5 flex items-center justify-between group hover:border-[#25D366]/40 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-[#25D366]/10 flex items-center justify-center text-[#25D366] border border-[#25D366]/20">
                        {agent.role === 'wholesale' ? <Users size={18}/> : agent.role === 'export' ? <Globe size={18}/> : <Headphones size={18}/>}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-lg">{agent.name}</span>
                          <span className="text-[8px] bg-neutral-800 text-neutral-400 px-2 py-0.5 font-black uppercase tracking-tighter">{agent.role}</span>
                        </div>
                        <p className="text-[#25D366] font-mono text-sm mt-1">{agent.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingAgent(agent)} className="p-2 text-neutral-500 hover:text-white transition-all"><Edit2 size={18} /></button>
                      <button onClick={() => deleteAgent(agent.id)} className="p-2 text-neutral-500 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                    </div>
                 </div>
               ))}
               {contactData.whatsAppAgents.length === 0 && (
                 <p className="text-center py-12 text-neutral-600 italic">Aucun agent configuré.</p>
               )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <form onSubmit={handleAppearanceSubmit} className="space-y-8 animate-fade-in">
          <div className="bg-black border border-amber-900/30 p-8 shadow-2xl">
            <h2 className="text-xl font-serif text-amber-100 mb-8 flex items-center gap-2"><Monitor size={20} className="text-amber-500" /> Design du Site</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Titre Principal (Hero)</label>
                <input type="text" value={appearanceData.heroTitle} onChange={e => setAppearanceData({...appearanceData, heroTitle: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Slogan de la Maison</label>
                <input type="text" value={appearanceData.heroSlogan} onChange={e => setAppearanceData({...appearanceData, heroSlogan: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Image d'accueil (URL)</label>
                <input type="text" value={appearanceData.heroImage} onChange={e => setAppearanceData({...appearanceData, heroImage: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-end"><Button type="submit" disabled={isSaving} className="px-12 py-4"><Save size={18} /> Enregistrer le Design</Button></div>
        </form>
      )}

      {activeTab === 'security' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-black border border-red-900/30 p-8 shadow-2xl">
            <h2 className="text-xl font-serif text-red-500 mb-8 flex items-center gap-2"><Lock size={20} /> Sécurité de l'accès</h2>
            <p className="text-neutral-400 text-sm mb-8">Utilisez ces paramètres pour sécuriser votre accès à l'interface d'administration.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Email Administrateur</label>
                <input type="email" value={user?.email || ''} readOnly className="w-full bg-neutral-950 border border-neutral-800 p-4 text-neutral-500 outline-none cursor-not-allowed" />
              </div>
              <div className="pt-4">
                <Button variant="outline" className="border-red-900/50 text-red-500 hover:bg-red-950/20">Changer le mot de passe</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal WhatsApp Agent */}
      {editingAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-neutral-900 border border-amber-900/40 w-full max-w-md p-8 shadow-2xl relative">
              <button onClick={() => setEditingAgent(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white"><X size={24}/></button>
              <h3 className="text-2xl font-serif text-amber-500 mb-8 flex items-center gap-3">
                <WhatsAppIcon size={24}/> {editingAgent.id ? 'Modifier l\'Expert' : 'Nouvel Expert'}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Nom de l'Expert</label>
                  <input 
                    type="text" 
                    value={editingAgent.name || ''} 
                    onChange={e => setEditingAgent({...editingAgent, name: e.target.value})}
                    className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-amber-500 outline-none"
                    placeholder="Ex: Aminata Diop"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Numéro WhatsApp</label>
                  <input 
                    type="text" 
                    value={editingAgent.phone || ''} 
                    onChange={e => setEditingAgent({...editingAgent, phone: e.target.value})}
                    className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-amber-500 outline-none font-mono"
                    placeholder="+223..."
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 text-[10px] uppercase mb-2 tracking-[0.2em] font-black">Spécialisation</label>
                  <select 
                    value={editingAgent.role || 'retail'} 
                    onChange={e => setEditingAgent({...editingAgent, role: e.target.value as any})}
                    className="w-full bg-black border border-neutral-800 p-4 text-white focus:border-amber-500 outline-none appearance-none"
                  >
                    <option value="retail">Service Client (Détail)</option>
                    <option value="wholesale">Direction Commerciale (Gros)</option>
                    <option value="export">Service Export (International)</option>
                    <option value="general">Assistance Générale</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-10 flex gap-4">
                <Button variant="ghost" fullWidth onClick={() => setEditingAgent(null)}>Annuler</Button>
                <Button fullWidth onClick={saveAgent}>Enregistrer</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;