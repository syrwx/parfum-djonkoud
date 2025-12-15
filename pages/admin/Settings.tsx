
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { ContactInfo, SiteSettings, WhatsAppAgent } from '../../types';
import Button from '../../components/ui/Button';
import { Save, MapPin, Mail, Clock, Globe, Layout, Image as ImageIcon, Plus, Trash2, Edit2, ShieldCheck, Users, Phone, Lock, Key, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Composant SVG officiel WhatsApp pour un rendu net
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const Settings: React.FC = () => {
  const { contactInfo, updateContactInfo, siteSettings, updateSiteSettings } = useStore();
  const { updateProfile, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'contact' | 'whatsapp' | 'appearance' | 'security'>('contact');
  const [contactData, setContactData] = useState<ContactInfo>(contactInfo);
  const [appearanceData, setAppearanceData] = useState<SiteSettings>(siteSettings);
  
  // Security State
  const [securityData, setSecurityData] = useState({
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });
  
  // State pour l'édition d'un agent
  const [editingAgent, setEditingAgent] = useState<Partial<WhatsAppAgent> | null>(null);

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

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.password && securityData.password !== securityData.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
    }
    
    if (securityData.password && securityData.password.length < 6) {
        toast.error("Le mot de passe doit faire au moins 6 caractères");
        return;
    }
    
    const toastId = toast.loading("Mise à jour des accès...");
    
    const success = await updateProfile(securityData.email, securityData.password || undefined);
    if (success) {
        toast.success("Profil administrateur et mot de passe mis à jour avec succès !", { id: toastId });
        setSecurityData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } else {
        toast.error("Erreur lors de la mise à jour", { id: toastId });
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppearanceData(prev => ({ ...prev, [name]: value }));
  };

  // --- GESTION AGENTS WHATSAPP ---
  const handleAddAgent = () => {
    const newAgent: WhatsAppAgent = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      role: 'general',
      active: true
    };
    setEditingAgent(newAgent);
  };

  const saveAgent = () => {
    if (!editingAgent || !editingAgent.name || !editingAgent.phone) return;
    
    let newAgents = [...contactData.whatsAppAgents];
    const existingIndex = newAgents.findIndex(a => a.id === editingAgent.id);
    
    if (existingIndex >= 0) {
      newAgents[existingIndex] = editingAgent as WhatsAppAgent;
    } else {
      newAgents.push(editingAgent as WhatsAppAgent);
    }

    const newContactInfo = { ...contactData, whatsAppAgents: newAgents };
    setContactData(newContactInfo);
    updateContactInfo(newContactInfo); 
    setEditingAgent(null);
    toast.success("Numéro WhatsApp enregistré");
  };

  const deleteAgent = (id: string) => {
    const newAgents = contactData.whatsAppAgents.filter(a => a.id !== id);
    const newContactInfo = { ...contactData, whatsAppAgents: newAgents };
    setContactData(newContactInfo);
    updateContactInfo(newContactInfo);
    toast.success("Numéro supprimé");
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'export': return <Globe size={16} className="text-blue-400"/>;
      case 'wholesale': return <Users size={16} className="text-purple-400"/>;
      case 'support': return <ShieldCheck size={16} className="text-red-400"/>;
      default: return <WhatsAppIcon size={16} className="text-green-500"/>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 border-b border-amber-900/30 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white">Paramètres Généraux</h1>
          <p className="text-neutral-400 mt-2">Pilotez l'identité de votre marque.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('contact')} className={`px-4 py-3 text-sm uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'contact' ? 'bg-amber-600 text-white font-bold' : 'bg-neutral-900 text-neutral-400 hover:text-amber-500'}`}>Info Base</button>
        <button onClick={() => setActiveTab('whatsapp')} className={`px-4 py-3 text-sm uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'whatsapp' ? 'bg-green-700 text-white font-bold' : 'bg-neutral-900 text-green-500 hover:text-green-400'}`}><WhatsAppIcon size={16} /> Équipe WhatsApp</button>
        <button onClick={() => setActiveTab('appearance')} className={`px-4 py-3 text-sm uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'appearance' ? 'bg-amber-600 text-white font-bold' : 'bg-neutral-900 text-neutral-400 hover:text-amber-500'}`}>Design Site</button>
        <button onClick={() => setActiveTab('security')} className={`px-4 py-3 text-sm uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'security' ? 'bg-red-900 text-white font-bold' : 'bg-neutral-900 text-red-400 hover:text-red-300'}`}><Lock size={16} /> Sécurité Admin</button>
      </div>

      {/* CONTACT TAB */}
      {activeTab === 'contact' && (
        <form onSubmit={handleContactSubmit} className="space-y-8 animate-fade-in">
          <div className="bg-black border border-amber-900/30 p-6 relative overflow-hidden">
            <h2 className="text-lg font-serif text-amber-100 mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-amber-500" /> Coordonnées Générales
            </h2>
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div className="md:col-span-2">
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Adresse Complète</label>
                <input type="text" name="address" value={contactData.address} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2"><Phone size={12} className="inline mr-1"/> Téléphone Principal</label>
                <input type="text" name="phone" value={contactData.phone} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2"><Mail size={12} className="inline mr-1"/> Email</label>
                <input type="email" name="email" value={contactData.email} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2"><Clock size={12} className="inline mr-1"/> Horaires</label>
                <input type="text" name="hours" value={contactData.hours} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" />
              </div>
            </div>
          </div>
          <div className="bg-black border border-amber-900/30 p-6">
            <h2 className="text-lg font-serif text-amber-100 mb-6 flex items-center gap-2">
              <Globe size={18} className="text-amber-500" /> Réseaux Sociaux
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div><label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Instagram</label><input type="text" name="instagram" value={contactData.instagram || ''} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" /></div>
              <div><label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Facebook</label><input type="text" name="facebook" value={contactData.facebook || ''} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" /></div>
              <div><label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Twitter</label><input type="text" name="twitter" value={contactData.twitter || ''} onChange={handleContactChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" /></div>
            </div>
          </div>
          <div className="flex justify-end"><Button type="submit"><Save size={18} /> Sauvegarder Contact</Button></div>
        </form>
      )}

      {/* WHATSAPP TEAM TAB */}
      {activeTab === 'whatsapp' && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-neutral-900 border border-green-900/50 p-6 relative overflow-hidden">
             {/* Background subtil WhatsApp */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             
             <div className="flex justify-between items-start mb-6 relative z-10">
               <div>
                 <h2 className="text-xl font-serif text-green-400 mb-2 flex items-center gap-2">
                   <WhatsAppIcon size={24} /> Segmentation WhatsApp
                 </h2>
                 <p className="text-neutral-400 text-sm">Gérez les numéros qui recevront les commandes.</p>
               </div>
               <Button onClick={handleAddAgent} variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/20 hover:text-green-300"><Plus size={18} /> Ajouter un numéro</Button>
             </div>
             <div className="space-y-3 relative z-10">
               {contactData.whatsAppAgents.map(agent => (
                 <div key={agent.id} className="bg-black border border-neutral-800 p-4 flex items-center justify-between group hover:border-green-600/50 transition-colors shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800 group-hover:border-green-900 transition-colors">
                        {getRoleIcon(agent.role)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2"><span className="font-bold text-white">{agent.name}</span><span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-sm">{agent.role}</span></div>
                        <p className="text-green-600 font-mono text-sm tracking-wide">{agent.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingAgent(agent)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => deleteAgent(agent.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-900/20 rounded"><Trash2 size={16} /></button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
          {editingAgent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-neutral-900 w-full max-w-md border border-green-900/50 p-6 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-green-400"></div>
                <h3 className="text-xl font-serif text-green-400 mb-6 flex items-center gap-2"><WhatsAppIcon size={20}/> Configuration Numéro</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-green-100/50 text-xs uppercase tracking-widest mb-1">Nom du contact</label>
                    <input type="text" placeholder="Ex: Service Commercial" value={editingAgent.name || ''} onChange={e => setEditingAgent({...editingAgent, name: e.target.value})} className="w-full bg-black border border-neutral-700 p-3 text-white outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-green-100/50 text-xs uppercase tracking-widest mb-1">Numéro (avec indicatif)</label>
                    <input type="text" placeholder="+223 00 00 00 00" value={editingAgent.phone || ''} onChange={e => setEditingAgent({...editingAgent, phone: e.target.value})} className="w-full bg-black border border-neutral-700 p-3 text-white outline-none focus:border-green-500 font-mono" />
                  </div>
                  <div>
                    <label className="block text-green-100/50 text-xs uppercase tracking-widest mb-1">Rôle</label>
                    <select value={editingAgent.role || 'general'} onChange={e => setEditingAgent({...editingAgent, role: e.target.value as any})} className="w-full bg-black border border-neutral-700 p-3 text-white outline-none focus:border-green-500">
                        <option value="general">Général</option><option value="export">Export</option><option value="wholesale">Grossistes</option><option value="support">SAV</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4"><Button onClick={() => setEditingAgent(null)} variant="ghost" fullWidth>Annuler</Button><Button onClick={saveAgent} fullWidth className="bg-green-600 hover:bg-green-500 text-white border-none">Enregistrer</Button></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <form onSubmit={handleAppearanceSubmit} className="space-y-8 animate-fade-in">
           <div className="bg-black border border-amber-900/30 p-6">
            <h2 className="text-lg font-serif text-amber-100 mb-6 flex items-center gap-2"><Layout size={18} className="text-amber-500" /> Page d'Accueil</h2>
            <div className="space-y-6">
              <div><label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Titre Principal</label><input type="text" name="heroTitle" value={appearanceData.heroTitle} onChange={handleAppearanceChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none font-serif text-lg" /></div>
              <div><label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Slogan</label><textarea name="heroSlogan" value={appearanceData.heroSlogan} onChange={handleAppearanceChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none h-24" /></div>
              <div><label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Badge</label><input type="text" name="heroSubtitle" value={appearanceData.heroSubtitle} onChange={handleAppearanceChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" /></div>
              <div>
                <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><ImageIcon size={14} /> Image de Fond (URL)</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-grow"><input type="text" name="heroImage" value={appearanceData.heroImage} onChange={handleAppearanceChange} className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-amber-500 outline-none" /></div>
                  <div className="w-24 h-24 bg-neutral-800 border border-neutral-700 flex-shrink-0 overflow-hidden"><img src={appearanceData.heroImage} alt="Preview" className="w-full h-full object-cover" /></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end"><Button type="submit"><Save size={18} /> Sauvegarder Design</Button></div>
        </form>
      )}
      
      {/* SECURITY TAB */}
      {activeTab === 'security' && (
         <form onSubmit={handleSecuritySubmit} className="space-y-8 animate-fade-in">
           <div className="bg-black border border-red-900/30 p-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-red-900/5 pointer-events-none"></div>
             <div className="relative z-10 flex justify-between items-start">
                 <h2 className="text-lg font-serif text-red-400 mb-6 flex items-center gap-2">
                    <Lock size={18} /> Sécurité Administrateur
                 </h2>
                 <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 border border-red-900/50">Zone Sensible</span>
             </div>
             
             <div className="space-y-6 relative z-10">
                <p className="text-neutral-400 text-sm">
                  Utilisez ce formulaire pour mettre à jour l'email de connexion ou le mot de passe de l'administrateur.
                  <br/>La modification est immédiate.
                </p>
                
                <div>
                   <label className="block text-neutral-400 text-xs uppercase tracking-widest mb-2">Email Administrateur</label>
                   <input 
                     type="email" 
                     value={securityData.email}
                     onChange={e => setSecurityData({...securityData, email: e.target.value})}
                     className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-red-500 outline-none"
                   />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-neutral-400 text-xs uppercase tracking-widest mb-2">Nouveau Mot de passe</label>
                     <input 
                       type="password" 
                       placeholder="Laisser vide si inchangé"
                       value={securityData.password}
                       onChange={e => setSecurityData({...securityData, password: e.target.value})}
                       className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-red-500 outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-neutral-400 text-xs uppercase tracking-widest mb-2">Confirmer Mot de passe</label>
                     <input 
                       type="password" 
                       placeholder="Répéter nouveau mot de passe"
                       value={securityData.confirmPassword}
                       onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})}
                       className="w-full bg-neutral-900 border border-neutral-700 p-3 text-white focus:border-red-500 outline-none"
                     />
                   </div>
                </div>
             </div>
           </div>
           
           <div className="flex justify-end">
             <Button type="submit" className="bg-red-900 hover:bg-red-800 border border-red-700 shadow-lg shadow-red-900/20">
               <Key size={18} /> Mettre à jour les accès
             </Button>
           </div>
         </form>
      )}
    </div>
  );
};

export default Settings;
