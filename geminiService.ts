
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function suggestMenu(currentItems: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on these grocery items: ${currentItems.join(', ')}, suggest a healthy and budget-friendly Lunch and Dinner menu for a student mess. Format your response strictly as JSON with keys 'lunch' and 'dinner'. Do not include breakfast.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini error:", error);
    return null;
  }
}
