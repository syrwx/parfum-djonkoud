
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { ContactInfo, SiteSettings, WhatsAppAgent } from '../../types';
import Button from '../../components/ui/Button';
import { Save, MapPin, Layout, Plus, Trash2, Edit2, CreditCard, DollarSign, Smartphone, Check, Users, Globe, Headphones, Target, MessageCircle, ShieldAlert, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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

  // Security State
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    refreshSettings();
  }, []);

  useEffect(() => {
    setContactData(contactInfo);
    setAppearanceData(siteSettings);
  }, [contactInfo, siteSettings]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateContactInfo(contactData);
    setIsSaving(false);
  };

  const handleAppearanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSiteSettings(appearanceData);
    setIsSaving(false);
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    setIsSaving(true);
    const success = await updateProfile(newEmail, newPassword);
    if (success) {
      setNewPassword('');
      setConfirmPassword('');
      toast.success("Profil administrateur mis à jour");
    } else {
      toast.error("Échec de la mise à jour");
    }
    setIsSaving(false);
  };

  const togglePaymentMethod = async (id: string) => {
    const updatedMethods = appearanceData.paymentMethods.map(m => 
      m.id === id ? { ...m, active: !m.active } : m
    );
    const updatedSettings = { ...appearanceData, paymentMethods: updatedMethods };
    setAppearanceData(updatedSettings);
    await updateSiteSettings(updatedSettings);
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

  const getAgentRoleIcon = (role: string) => {
    switch (role) {
      case 'wholesale': return <Users size={16} />;
      case 'export': return <Globe size={16} />;
      case 'retail': return <Target size={16} />;
      default: return <Headphones size={16} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 border-b border-amber-900/30 pb-6">
        <h1 className="text-3xl font-serif text-white">Paramètres Généraux</h1>
        <p className="text-neutral-400 mt-2">Pilotez votre marque en temps réel.</p>
      </div>

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('contact')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap ${activeTab === 'contact' ? 'bg-amber-600 text-white' : 'bg-neutral-900 text-neutral-400'}`}>Base</button>
        <button onClick={() => setActiveTab('whatsapp')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap flex items-center gap-2 ${activeTab === 'whatsapp' ? 'bg-green-700 text-white' : 'bg-neutral-900 text-green-500'}`}><WhatsAppIcon size={16}/> Équipe WhatsApp</button>
        <button onClick={() => setActiveTab('payments')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap flex items-center gap-2 ${activeTab === 'payments' ? 'bg-amber-600 text-white' : 'bg-neutral-900 text-amber-400'}`}><CreditCard size={16}/> Paiements</button>
        <button onClick={() => setActiveTab('appearance')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap ${activeTab === 'appearance' ? 'bg-amber-600 text-white' : 'bg-neutral-900 text-neutral-400'}`}>Design</button>
        <button onClick={() => setActiveTab('security')} className={`px-4 py-3 text-sm uppercase tracking-widest whitespace-nowrap flex items-center gap-2 ${activeTab === 'security' ? 'bg-red-700 text-white' : 'bg-neutral-900 text-red-500'}`}><ShieldAlert size={16}/> Sécurité</button>
      </div>

      {activeTab === 'contact' && (
        <form onSubmit={handleContactSubmit} className="space-y-8 animate-fade-in">
          <div className="bg-black border border-amber-900/30 p-6">
            <h2 className="text-lg font-serif text-amber-100 mb-6 flex items-center gap-2"><MapPin size={18} className="text-amber-500" /> Coordonnées</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-amber-100 text-[10px] uppercase mb-2">Adresse</label>
                <input type="text" name="address" value={contactData.address} onChange={e => setContactData({...contactData, address: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-amber-100 text-[10px] uppercase mb-2">Téléphone principal</label>
                <input type="text" name="phone" value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none font-mono" />
              </div>
              <div>
                <label className="block text-amber-100 text-[10px] uppercase mb-2">Email public</label>
                <input type="email" name="email" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-end"><Button type="submit" disabled={isSaving}><Save size={18} /> Sauvegarder</Button></div>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handleSecuritySubmit} className="space-y-8 animate-fade-in">
          <div className="bg-black border border-red-900/30 p-6">
            <h2 className="text-lg font-serif text-red-500 mb-6 flex items-center gap-2"><Lock size={18} /> Accès Administration</h2>
            <div className="grid gap-6">
              <div>
                <label className="block text-amber-100 text-[10px] uppercase mb-2">Email Administrateur</label>
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={e => setNewEmail(e.target.value)} 
                  className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-100 text-[10px] uppercase mb-2">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Laisser vide pour ne pas changer"
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-amber-100 text-[10px] uppercase mb-2">Confirmer le mot de passe</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    placeholder="Répéter le mot de passe"
                    className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end"><Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-500"><Save size={18} /> Appliquer les changements</Button></div>
        </form>
      )}

      {activeTab === 'whatsapp' && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-neutral-900 border border-green-900/50 p-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-serif text-green-400 flex items-center gap-2"><WhatsAppIcon size={24} /> Routage Intelligent</h2>
               <Button onClick={() => setEditingAgent({ name: '', phone: '', role: 'retail' })} variant="outline" className="border-green-600 text-green-400"><Plus size={18} /> Ajouter un expert</Button>
             </div>
             
             <div className="space-y-4">
               {contactData.whatsAppAgents.map(agent => (
                 <div key={agent.id} className="bg-black border border-neutral-800 p-5 flex items-center justify-between group hover:border-green-800 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-green-900/20 flex items-center justify-center text-green-500 border border-green-900/50">
                        {getAgentRoleIcon(agent.role)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-lg">{agent.name}</span>
                          <span className={`text-[10px] uppercase px-2 py-0.5 font-bold tracking-tighter ${
                            agent.role === 'wholesale' ? 'bg-amber-600 text-black' : 
                            agent.role === 'export' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {agent.role === 'wholesale' ? 'GROSSISTE' : agent.role === 'export' ? 'EXPORT' : 'RETAIL'}
                          </span>
                        </div>
                        <p className="text-green-600 font-mono text-sm mt-1">{agent.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingAgent(agent)} className="p-2 text-neutral-400 hover:text-white transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => deleteAgent(agent.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
          
          {editingAgent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
              <div className="bg-neutral-900 border border-green-700/50 p-8 w-full max-w-md shadow-2xl">
                 <h3 className="text-xl font-serif text-green-400 mb-6">Configuration de l'expert</h3>
                 <div className="space-y-4">
                   <div>
                     <label className="block text-[10px] uppercase text-neutral-500 mb-2">Nom / Titre</label>
                     <input type="text" value={editingAgent.name || ''} onChange={e => setEditingAgent({...editingAgent, name: e.target.value})} className="w-full bg-black border border-neutral-700 p-3 text-white outline-none" placeholder="Ex: M. Traoré - Grossiste" />
                   </div>
                   <div>
                     <label className="block text-[10px] uppercase text-neutral-500 mb-2">Numéro WhatsApp</label>
                     <input type="text" value={editingAgent.phone || ''} onChange={e => setEditingAgent({...editingAgent, phone: e.target.value})} className="w-full bg-black border border-neutral-700 p-3 text-white outline-none" placeholder="+223 ..." />
                   </div>
                   <div>
                     <label className="block text-[10px] uppercase text-neutral-500 mb-2">Rôle / Cible</label>
                     <select value={editingAgent.role || 'retail'} onChange={e => setEditingAgent({...editingAgent, role: e.target.value as any})} className="w-full bg-black border border-neutral-700 p-3 text-white outline-none">
                       <option value="retail">Détaillant / Particulier</option>
                       <option value="wholesale">Grossiste (Panier élevé)</option>
                       <option value="export">Exportation (International)</option>
                       <option value="general">Général / Support</option>
                     </select>
                   </div>
                   <div className="pt-6 flex gap-4">
                     <button onClick={() => setEditingAgent(null)} className="flex-1 py-3 text-neutral-400 hover:text-white">Annuler</button>
                     <Button onClick={saveAgent} fullWidth>Enregistrer l'agent</Button>
                   </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="animate-fade-in space-y-6">
           <div className="bg-black border border-amber-900/30 p-6">
            <h2 className="text-lg font-serif text-amber-100 mb-6 flex items-center gap-2"><CreditCard size={18} className="text-amber-500" /> Options de Paiement</h2>
            <div className="bg-neutral-900/50 p-4 border border-amber-900/10 mb-8">
               <label className="block text-[10px] uppercase text-amber-600 font-bold mb-2">Seuil Grossiste (FCFA)</label>
               <input 
                 type="number" 
                 value={appearanceData.wholesaleThreshold || 200000} 
                 onChange={e => setAppearanceData({...appearanceData, wholesaleThreshold: parseInt(e.target.value)})} 
                 className="w-full bg-black border border-neutral-800 p-3 text-white focus:border-amber-500 outline-none font-mono" 
               />
            </div>
            <div className="space-y-3">
              {appearanceData.paymentMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 group hover:border-amber-900/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-black border border-neutral-800 text-amber-600">
                      {method.id === 'WHATSAPP' ? <MessageCircle size={20}/> : method.id === 'CARD' ? <CreditCard size={20}/> : <Smartphone size={20}/>}
                    </div>
                    <span className="font-bold text-white">{method.name}</span>
                  </div>
                  <button 
                    onClick={() => togglePaymentMethod(method.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${method.active ? 'bg-amber-600' : 'bg-neutral-800'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${method.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
