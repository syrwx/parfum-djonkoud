import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPerfumeRecommendation, PerfumeRecommendation } from '../services/geminiService';
import Button from '../components/ui/Button';
import { Sparkles, Loader2, Feather } from 'lucide-react';

const AiGuide: React.FC = () => {
  const [mood, setMood] = useState('');
  const [occasion, setOccasion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PerfumeRecommendation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood || !occasion) return;
    
    setLoading(true);
    setResult(null);
    const recommendation = await getPerfumeRecommendation(mood, occasion);
    setResult(recommendation);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/20 text-amber-500 border border-amber-900/30 text-xs tracking-widest uppercase">
            <Sparkles size={14} /> Intelligence Artificielle
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-white">Le Griot Parfumeur</h1>
          <p className="text-neutral-400">
            Confiez-nous votre état d'esprit et l'occasion. Notre IA, inspirée des traditions maliennes, composera une recommandation poétique pour vous.
          </p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-amber-100 text-sm uppercase tracking-wider mb-2">Comment vous sentez-vous ?</label>
              <input 
                type="text" 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Ex: Sereine, Ambitieux, Nostalgique..." 
                className="w-full bg-neutral-950 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-amber-100 text-sm uppercase tracking-wider mb-2">Pour quelle occasion ?</label>
              <input 
                type="text" 
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Ex: Dîner romantique, Méditation, Réception..." 
                className="w-full bg-neutral-950 border border-neutral-700 p-4 text-white focus:border-amber-500 outline-none transition-colors"
              />
            </div>
            <Button fullWidth type="submit" disabled={loading || !mood || !occasion}>
              {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Consultation des esprits...</span> : 'Obtenir la Révélation'}
            </Button>
          </form>

          {result && (
            <div className="mt-8 pt-8 border-t border-amber-900/30 animate-fade-in">
              <div className="text-center space-y-4">
                <p className="text-amber-600 uppercase tracking-widest text-sm font-bold">Suggestion</p>
                <h3 className="font-serif text-3xl text-white">{result.suggestion}</h3>
                
                <div className="py-6 px-4 relative">
                  <Feather className="absolute top-0 left-0 text-neutral-800 w-8 h-8 opacity-50" />
                  <p className="text-lg text-amber-100 italic font-serif leading-relaxed">
                    "{result.poeticDescription}"
                  </p>
                  <Feather className="absolute bottom-0 right-0 text-neutral-800 w-8 h-8 opacity-50 transform rotate-180" />
                </div>

                <div className="flex justify-center gap-3 flex-wrap">
                  {result.ingredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 border border-amber-500/30 text-amber-400 text-xs uppercase tracking-wide">
                      {ing}
                    </span>
                  ))}
                </div>
                
                <div className="pt-6">
                  <Link to="/shop">
                    <Button variant="outline">Voir les produits correspondants</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiGuide;