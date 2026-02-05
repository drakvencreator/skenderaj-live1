
import { GoogleGenAI } from "@google/genai";

export const summarizeNews = async (articleTitle: string, excerpt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Përmblidhe këtë lajm nga Skenderaji në shqip, shkurt dhe me stil gazetarie moderne (maksimumi 2 fjali): Titulli: ${articleTitle}. Përmbajtja: ${excerpt}`,
      config: {
        temperature: 0.5,
        topK: 40,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI për momentin është në pushim. Provoni përsëri pas pak!";
  }
};
