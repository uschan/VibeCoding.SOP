import { GoogleGenAI, Type } from "@google/genai";
import { PlannerResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateExecutionPlan = async (taskDescription: string, lang: 'en' | 'zh' = 'en'): Promise<PlannerResponse | null> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }

  const langInstruction = lang === 'zh' 
    ? "OUTPUT MUST BE IN CHINESE (Simplified). Translate titles, strategies, and risks to Chinese." 
    : "Output in English.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert Senior Technical Architect and "Vibe Coding" specialist. 
      Your goal is to break down a complex coding requirement into a strictly phased execution plan to prevent AI confusion and code rot.
      
      User Task: "${taskDescription}"
      
      ${langInstruction}

      Provide a JSON response with a list of steps. For each step, include:
      - title: A short, action-oriented title.
      - promptStrategy: Specific advice on what to tell the AI coder in this step (e.g., "Only generate the interface definitions").
      - risk: What usually goes wrong here if not careful (e.g., "AI hallucinates imports").
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  promptStrategy: { type: Type.STRING },
                  risk: { type: Type.STRING },
                },
                required: ["title", "promptStrategy", "risk"],
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as PlannerResponse;

  } catch (error) {
    console.error("Error generating plan:", error);
    return null;
  }
};