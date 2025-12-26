
import { GoogleGenAI, Type } from "@google/genai";

export interface PerfumeRecommendation {
  suggestion: string;
  poeticDescription: string;
  ingredients: string[];
}

/**
 * Predefined fallback recommendations in case the AI is unavailable.
 * Provides a high-quality "human" alternative.
 */
const ANCESTRAL_FALLBACKS: PerfumeRecommendation[] = [
  {
    suggestion: "Thiouraye Royal de Ségou",
    poeticDescription: "Les ancêtres suggèrent la protection. Ce mélange royal, né des terres rouges, enveloppe votre aura d'une dignité ancestrale. C'est le choix de la souveraineté.",
    ingredients: ["Gowé Millénaire", "Musc Noir", "Résines Sacrées"]
  },
  {
    suggestion: "Brume du Djoliba",
    poeticDescription: "L'esprit du fleuve Niger murmure la sérénité. Une fraîcheur qui lave les soucis du jour et prépare l'âme à la clarté. La paix avant tout.",
    ingredients: ["Lotus Bleu", "Santal des Rives", "Notes Aquatiques"]
  },
  {
    suggestion: "Nuit à Tombouctou",
    poeticDescription: "Le désert appelle votre force intérieure. Une fragrance de savoir et de mystère, pour ceux qui tracent leur propre chemin sous les étoiles. La profondeur de l'esprit.",
    ingredients: ["Épices Rares", "Encens de Tombouctou", "Ambre Sombre"]
  }
];

/**
 * Generates a perfume recommendation based on mood and occasion using Gemini.
 * Includes a robust fallback mechanism with 3 predefined responses.
 */
export const getPerfumeRecommendation = async (mood: string, occasion: string): Promise<PerfumeRecommendation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Select a fallback in case of error or missing API key
  const randomFallback = ANCESTRAL_FALLBACKS[Math.floor(Math.random() * ANCESTRAL_FALLBACKS.length)];

  if (!process.env.API_KEY) {
    console.warn("API Key is missing for Gemini, using Ancestral Wisdom fallback.");
    return randomFallback;
  }

  const prompt = `
    Tu es un 'Griot Parfumeur' expert de la marque de luxe malienne 'DJONKOUD PARFUM'.
    L'utilisateur cherche une recommandation pour cette ambiance : Humeur: ${mood}, Occasion: ${occasion}.
    
    1. Suggère un type de parfum ou d'encens (ex: Boisé, Floral, Épicé, Doux).
    2. Rédige une description poétique, courte (max 50 mots), mystique et élégante, évoquant le Mali, le fleuve Niger, le désert, ou les traditions royales.
    3. Liste 3 ingrédients clés imaginaires ou réels (ex: Oud, Santal, Ambre).
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
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["suggestion", "poeticDescription", "ingredients"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as PerfumeRecommendation;
  } catch (error) {
    console.error("Gemini Error, providing Ancestral Fallback:", error);
    // Return one of the high-quality pre-entered responses
    return randomFallback;
  }
};
