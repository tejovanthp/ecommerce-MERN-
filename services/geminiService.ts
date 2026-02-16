
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("❌ CRITICAL: Gemini API_KEY is missing from environment variables.");
    throw new Error("Missing API Key");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (name: string, category: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a compelling e-commerce product description for a product named "${name}" in the "${category}" category. Keep it under 50 words and focus on features and benefits.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Description Error:", error);
    return "Description generation is temporarily unavailable. Check your API configuration.";
  }
};

export const getAdminInsights = async (totalSales: number, totalOrders: number, lowStockCount: number) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a business analyst, provide a very short executive summary (max 3 sentences) for an e-commerce dashboard showing: Total Sales: $${totalSales}, Total Orders: ${totalOrders}, Low Stock Items: ${lowStockCount}. Offer one actionable piece of advice.`,
    });
    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Business insights currently unavailable. Ensure your Google AI API key is correctly configured in your environment settings.";
  }
};
