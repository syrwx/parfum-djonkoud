
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { ContactInfo, SiteSettings, WhatsAppAgent } from '../../types';
import Button from '../../components/ui/Button';
import { Save, MapPin, Plus, Trash2, Edit2, CreditCard, Smartphone, Users, Globe, Headphones, Target, MessageCircle, ShieldAlert, Lock, Instagram, Facebook, Twitter, Send, Video } from 'lucide-react';
import toast from 'react-hot-toast';

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const Settings: React.FC = () => {
  const { contactInfo, updateContactInfo, siteSettings, updateSiteSettings, refreshSettings } = useStore();
  const { user, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'contact' | 'whatsapp' | 'appearance' | 'payments' | 'security'>('contact');
  const [contactData, setContactData] = useState<ContactInfo>(contactInfo);
  const [appearanceData, setAppearanceData] = useState<SiteSettings>(siteSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Partial<WhatsAppAgent> | null>(null);

  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  useEffect(() => {
    setContactData(contactInfo);
    setAppearanceData(siteSettings);
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

  const saveAgent = async () => {
    if (!editingAgent || !editingAgent.name || !editingAgent.phone) return;
    let newAgents = [...contactData.whatsAppAgents];
    const existingIndex = newAgents.findIndex(a => a.id === editingAgent.id);
    if (existingIndex >= 0) newAgents[existingIndex] = editingAgent as WhatsAppAgent;
    else newAgents.push({ ...editingAgent, id: Date.now().toString(), active: true } as WhatsAppAgent);

    const newInfo = { ...contactData, whatsAppAgents: newAgents };
    setContactData(newInfo);
    await updateContactInfo(newInfo);
    setEditingAgent(null);
  };

  const deleteAgent = async (id: string) => {
    const newAgents = contactData.whatsAppAgents.filter(a => a.id !== id);
    const newInfo = { ...contactData, whatsAppAgents: newAgents };
    setContactData(newInfo);
    await updateContactInfo(newInfo);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 border-b border-amber-900/30 pb-6">
        <h1 className="text-3xl font-serif text-white">Administration Centrale</h1>
        <p className="text-neutral-400 mt-2">Pilotez votre présence digitale.</p>
      </div>

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setActiveTab('contact')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'contact' ? 'bg-amber-600 text-black font-bold' : 'bg-neutral-900 text-neutral-400'}`}>Contact & Social</button>
        <button onClick={() => setActiveTab('whatsapp')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'whatsapp' ? 'bg-[#25D366] text-black font-bold' : 'bg-neutral-900 text-[#25D366]'}`}><WhatsAppIcon size={16}/> WhatsApp</button>
        <button onClick={() => setActiveTab('payments')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'payments' ? 'bg-amber-600 text-black font-bold' : 'bg-neutral-900 text-neutral-400'}`}>Paiements</button>
        <button onClick={() => setActiveTab('appearance')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'appearance' ? 'bg-amber-600 text-black font-bold' : 'bg-neutral-900 text-neutral-400'}`}>Design</button>
        <button onClick={() => setActiveTab('security')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'security' ? 'bg-red-700 text-white font-bold' : 'bg-neutral-900 text-red-500'}`}>Sécurité</button>
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

          <div className="bg-black border border-amber-900/30 p-8 shadow-2xl">
            <h2 className="text-xl font-serif text-amber-100 mb-8 flex items-center gap-2"><Globe size={20} className="text-amber-500" /> Écosystème Social</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-neutral-500 text-[10px] uppercase tracking-widest font-black"><Instagram size={14} className="text-pink-500"/> Instagram</label>
                <input type="text" value={contactData.instagram || ''} onChange={e => setContactData({...contactData, instagram: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" placeholder="nom_utilisateur" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-neutral-500 text-[10px] uppercase tracking-widest font-black"><Video size={14} className="text-white"/> TikTok</label>
                <input type="text" value={contactData.tiktok || ''} onChange={e => setContactData({...contactData, tiktok: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" placeholder="@nom_utilisateur" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-neutral-500 text-[10px] uppercase tracking-widest font-black"><Send size={14} className="text-blue-400"/> Telegram</label>
                <input type="text" value={contactData.telegram || ''} onChange={e => setContactData({...contactData, telegram: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" placeholder="lien_ou_nom" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-neutral-500 text-[10px] uppercase tracking-widest font-black"><Facebook size={14} className="text-blue-600"/> Facebook</label>
                <input type="text" value={contactData.facebook || ''} onChange={e => setContactData({...contactData, facebook: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none" placeholder="nom_page" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end"><Button type="submit" disabled={isSaving} className="px-12 py-4"><Save size={18} /> Sauvegarder</Button></div>
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
             </div>
          </div>
          
          {editingAgent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
              <div className="bg-neutral-900 border border-[#25D366]/40 p-10 w-full max-w-lg shadow-2xl">
                 <h3 className="text-2xl font-serif text-[#25D366] mb-8">Fiche Conseiller</h3>
                 <div className="space-y-6">
                   <input type="text" value={editingAgent.name || ''} onChange={e => setEditingAgent({...editingAgent, name: e.target.value})} className="w-full bg-black border border-neutral-700 p-4 text-white outline-none focus:border-[#25D366]" placeholder="Nom & Rôle" />
                   <input type="text" value={editingAgent.phone || ''} onChange={e => setEditingAgent({...editingAgent, phone: e.target.value})} className="w-full bg-black border border-neutral-700 p-4 text-white outline-none focus:border-[#25D366] font-mono" placeholder="+223" />
                   <select value={editingAgent.role || 'retail'} onChange={e => setEditingAgent({...editingAgent, role: e.target.value as any})} className="w-full bg-black border border-neutral-700 p-4 text-white outline-none focus:border-[#25D366]">
                     <option value="retail">Service Client / Détail</option>
                     <option value="wholesale">Ventes en Gros</option>
                     <option value="export">Service Export</option>
                   </select>
                   <div className="pt-8 flex gap-4">
                     <button onClick={() => setEditingAgent(null)} className="flex-1 py-4 text-neutral-500 font-bold uppercase tracking-widest text-xs">Annuler</button>
                     <Button onClick={saveAgent} fullWidth className="bg-[#25D366] text-black">Enregistrer</Button>
                   </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
