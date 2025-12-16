
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Logo from '../../components/Logo';
import { Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await login(email, password)) {
      history.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 relative">
      <div className="absolute inset-0 bogolan-pattern opacity-5 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-black border border-amber-900/30 p-8 shadow-2xl relative z-10">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <h2 className="text-2xl font-serif text-center text-amber-500 mb-8">Accès Administration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none"
              placeholder="admin@djonkoud.ml"
            />
          </div>
          <div>
            <label className="block text-amber-100 text-xs uppercase tracking-widest mb-2">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white focus:border-amber-600 outline-none"
              placeholder="••••••••"
            />
          </div>
          
          <Button fullWidth type="submit">
            <Lock size={16} /> Se Connecter
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">Accès réservé au personnel autorisé.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;