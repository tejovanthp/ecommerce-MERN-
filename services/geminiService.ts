
import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (name: string, category: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a compelling e-commerce product description for a product named "${name}" in the "${category}" category. Keep it under 50 words and focus on features and benefits.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description.";
  }
};

export const getAdminInsights = async (totalSales: number, totalOrders: number, lowStockCount: number) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a business analyst, provide a very short executive summary (max 3 sentences) for an e-commerce dashboard showing: Total Sales: $${totalSales}, Total Orders: ${totalOrders}, Low Stock Items: ${lowStockCount}. Offer one actionable piece of advice.`,
    });
    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Insights unavailable.";
  }
};
