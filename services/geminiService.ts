
import { GoogleGenAI, Type } from "@google/genai";

export interface PerfumeRecommendation {
  suggestion: string;
  poeticDescription: string;
  ingredients: string[];
}

/**
 * RÉPONSES DE SECOURS (Sagesse Ancestrale)
 * Ces réponses sont utilisées si l'IA ne répond pas ou si la clé API est désactivée.
 */
const ANCESTRAL_WISDOM: PerfumeRecommendation[] = [
  {
    suggestion: "Le Trésor de l'Empire (Édition Spéciale)",
    poeticDescription: "Les astres indiquent que vous portez en vous une force royale. Pour cette occasion, le Griot vous suggère une fragrance boisée et profonde, rappelant la noblesse des anciens rois du Mandé.",
    ingredients: ["Oud Noir", "Résine de Luban", "Cèdre de l'Atlas"]
  },
  {
    suggestion: "Brise du Niger au Crépuscule",
    poeticDescription: "Votre humeur appelle à la sérénité. Comme une pirogue glissant sur le fleuve au coucher du soleil, cette essence florale et légère apportera la paix à votre esprit.",
    ingredients: ["Lotus Bleu", "Santal Blanc", "Musc Végétal"]
  },
  {
    suggestion: "Éclat des Sables de Tombouctou",
    poeticDescription: "Le vent du désert murmure des secrets de sagesse. Pour vous, une note épicée et mystérieuse qui révèle votre charisme et votre soif d'aventure sous les étoiles.",
    ingredients: ["Ambre Doré", "Safran de Taliouine", "Vanille Sauvage"]
  }
];

/**
 * Génère une recommandation.
 * Tente d'utiliser Gemini, mais bascule sur la Sagesse Ancestrale en cas d'erreur (Clé expirée, 403, etc.)
 */
export const getPerfumeRecommendation = async (mood: string, occasion: string): Promise<PerfumeRecommendation> => {
  // Sélectionner une réponse de secours au hasard par défaut
  const fallback = ANCESTRAL_WISDOM[Math.floor(Math.random() * ANCESTRAL_WISDOM.length)];
  
  const apiKey = process.env.API_KEY;

  // Si pas de clé, on ne perd pas de temps, on envoie le secours
  if (!apiKey || apiKey.includes("AIzaSyCC")) { // On vérifie si c'est la clé qui a fuité
     console.warn("Utilisation de la Sagesse Ancestrale (IA en pause).");
     // On simule un petit délai pour le réalisme
     await new Promise(resolve => setTimeout(resolve, 1500));
     return fallback;
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Tu es le 'Griot Parfumeur' de DJONKOUD PARFUM. 
    Recommande une fragrance pour : Humeur: ${mood}, Occasion: ${occasion}.
    Réponds en JSON avec :
    - suggestion (nom du type de parfum)
    - poeticDescription (max 50 mots, style mystique malien)
    - ingredients (liste de 3 ingrédients).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: { type: Type.STRING },
            poeticDescription: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["suggestion", "poeticDescription", "ingredients"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Réponse vide");
    
    return JSON.parse(text) as PerfumeRecommendation;
  } catch (error) {
    console.error("Erreur Gemini (Clé bloquée ou réseau), basculement secours:", error);
    // En cas d'erreur 403 (leaked key) ou autre, on renvoie la réponse pré-enregistrée
    return fallback;
  }
};
