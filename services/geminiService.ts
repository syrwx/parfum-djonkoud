import { GoogleGenAI, Type } from "@google/genai";

// Note: In a real deployment, this key comes from process.env.
// For this frontend-only generation, we assume the environment is set up.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface PerfumeRecommendation {
  suggestion: string;
  poeticDescription: string;
  ingredients: string[];
}

export const getPerfumeRecommendation = async (mood: string, occasion: string): Promise<PerfumeRecommendation> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing for Gemini");
    return {
      suggestion: "Thiouraye Royal de Ségou",
      poeticDescription: "L'API Key est manquante, mais nous vous recommandons notre classique intemporel.",
      ingredients: ["Gowé", "Ambre"]
    };
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
      model: 'gemini-2.5-flash',
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
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as PerfumeRecommendation;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      suggestion: "Sélection Mystère",
      poeticDescription: "Les esprits du parfum sont silencieux pour le moment. Laissez votre cœur choisir parmi nos trésors.",
      ingredients: ["Mystère", "Passion", "Tradition"]
    };
  }
};