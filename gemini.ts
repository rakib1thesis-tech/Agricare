
import { GoogleGenAI, Type } from "@google/genai";
import { Field, CropRecommendation } from "../types";

/**
 * Multi-Key Rotation System
 * Cycles through up to 3 keys from environment variables.
 */
class RotatingAIProvider {
  private keys: string[];
  private currentIndex: number = 0;
  private instances: Map<string, any> = new Map();

  constructor() {
    this.keys = [
      process.env.API_KEY,
      (process as any).env.API_KEY_2,
      (process as any).env.API_KEY_3
    ].filter(k => k && k.length > 5) as string[];
  }

  private getClient() {
    if (this.keys.length === 0) {
      throw new Error("No API keys configured. Ensure process.env.API_KEY is defined.");
    }
    const key = this.keys[this.currentIndex];
    if (!this.instances.has(key)) {
      this.instances.set(key, new GoogleGenAI({ apiKey: key }));
    }
    return this.instances.get(key);
  }

  private rotate() {
    if (this.keys.length > 1) {
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    }
  }

  async generate(params: any, retries = 2): Promise<any> {
    try {
      const ai = this.getClient();
      return await ai.models.generateContent(params);
    } catch (error: any) {
      const errorMsg = error.message?.toLowerCase() || "";
      const isRetryable = errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("rate limit");
      
      if (isRetryable && retries > 0) {
        this.rotate();
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.generate(params, retries - 1);
      }
      throw error;
    }
  }
}

const aiProvider = new RotatingAIProvider();

export const isAiReady = async () => {
  return !!process.env.API_KEY;
};

const cleanAndParseJSON = (text: string | undefined) => {
  if (!text) return null;
  try {
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    return null;
  }
};

/**
 * Enhanced Telemetry Context with "Missing" Awareness
 */
const formatDataForPrompt = (data: any) => {
  const format = (key: string, label: string, unit: string = '') => {
    const val = data[key];
    if (val === undefined || val === null) return `${label}: [MISSING - SENSOR NOT REGISTERED]`;
    return `${label}: ${Number(val).toFixed(2)}${unit}`;
  };

  const npkStatus = (data.npk_n !== undefined) 
    ? `Nitrogen=${data.npk_n}, Phosphorus=${data.npk_p}, Potassium=${data.npk_k}` 
    : "[MISSING - NPK ANALYZER NOT REGISTERED]";

  return `
    [INSTALLED SENSOR PILLARS]
    1. MOISTURE: ${format('moisture', 'Current Reading', '%')}
    2. pH LEVEL: ${format('ph_level', 'Current Reading')}
    3. NPK PROFILE: ${npkStatus}
    4. TEMPERATURE: ${format('temperature', 'Current Reading', '°C')}
    
    FIELD CONTEXT: ${data.field_name} at ${data.location}, Soil Type: ${data.soil_type || 'Loamy'}.
    
    IMPORTANT: You MUST NOT invent data for categories marked as [MISSING]. If a category is missing, do not include it in the restoration strategy; instead, briefly note that a sensor is required for that metric.
  `;
};

const MODEL_NAME = 'gemini-2.5-flash-preview-09-2025';

export interface SoilInsight {
  summary: string;
  soil_fertilizer: string;
}

export interface ManagementPrescription {
  irrigation: {
    needed: boolean;
    volume: string;
    schedule: string;
  };
  nutrient: {
    needed: boolean;
    fertilizers: { type: string; amount: string }[];
    advice: string;
  };
}

export const getCropAnalysis = async (field: Field, latestData: any): Promise<CropRecommendation[]> => {
  try {
    const response = await aiProvider.generate({
      model: MODEL_NAME,
      contents: `Suggest 3 crops based ONLY on available telemetry. ${formatDataForPrompt({...latestData, ...field})}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              suitability: { type: Type.NUMBER },
              yield: { type: Type.STRING },
              requirements: { type: Type.STRING },
              fertilizer: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ["name", "suitability", "yield", "requirements", "fertilizer", "icon"]
          }
        }
      }
    });
    return cleanAndParseJSON(response.text) || getFallbackCrops(latestData);
  } catch (error) {
    return getFallbackCrops(latestData);
  }
};

export const getSoilHealthSummary = async (field: Field, latestData: any): Promise<SoilInsight> => {
  try {
    const response = await aiProvider.generate({
      model: MODEL_NAME,
      contents: `Provide Soil Restoration Strategy for these specific pillars. Ignore missing sensors. ${formatDataForPrompt({...latestData, ...field})}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            soil_fertilizer: { type: Type.STRING }
          },
          required: ["summary", "soil_fertilizer"]
        }
      }
    });
    return cleanAndParseJSON(response.text) || getFallbackSoilInsight(latestData);
  } catch (error) {
    return getFallbackSoilInsight(latestData);
  }
};

export const getManagementPrescriptions = async (field: Field, latestData: any): Promise<ManagementPrescription> => {
  try {
    const response = await aiProvider.generate({
      model: MODEL_NAME,
      contents: `Create management prescriptions for these registered sensors only. ${formatDataForPrompt({...latestData, ...field})}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            irrigation: {
              type: Type.OBJECT,
              properties: {
                needed: { type: Type.BOOLEAN },
                volume: { type: Type.STRING },
                schedule: { type: Type.STRING }
              },
              required: ["needed", "volume", "schedule"]
            },
            nutrient: {
              type: Type.OBJECT,
              properties: {
                needed: { type: Type.BOOLEAN },
                fertilizers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      amount: { type: Type.STRING }
                    },
                    required: ["type", "amount"]
                  }
                },
                advice: { type: Type.STRING }
              },
              required: ["needed", "fertilizers", "advice"]
            }
          },
          required: ["irrigation", "nutrient"]
        }
      }
    });
    return cleanAndParseJSON(response.text) || getFallbackPrescription(latestData);
  } catch (error) {
    return getFallbackPrescription(latestData);
  }
};

export const getDetailedManagementPlan = async (field: Field, latestData: any) => {
  try {
    const response = await aiProvider.generate({
      model: MODEL_NAME,
      contents: `Build a 4-step Operational Roadmap based ONLY on these detected sensors. ${formatDataForPrompt({...latestData, ...field})}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              priority: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ["priority", "title", "description", "icon"]
          }
        }
      }
    });
    return cleanAndParseJSON(response.text) || getFallbackPlan(latestData);
  } catch (error) {
    return getFallbackPlan(latestData);
  }
};

// --- DYNAMIC DATA-AWARE FALLBACKS ---

const getFallbackCrops = (data: any): CropRecommendation[] => {
  const isDry = data.moisture !== undefined && data.moisture < 20;
  return [
    { name: isDry ? "Millets" : "Hybrid Rice", suitability: 90, yield: isDry ? "2.0t/ha" : "7.5t/ha", requirements: "Resilient to current profile.", fertilizer: "Urea", icon: "fa-wheat-awn" },
    { name: "Potato", suitability: 82, yield: "22t/ha", requirements: "Needs loose soil.", fertilizer: "MOP", icon: "fa-potato" },
    { name: "Eggplant", suitability: 75, yield: "18t/ha", requirements: "High Nitrogen needs.", fertilizer: "Organic", icon: "fa-seedling" }
  ];
};

const getFallbackSoilInsight = (data: any): SoilInsight => {
  const hasMoisture = data.moisture !== undefined;
  const isDry = hasMoisture && data.moisture < 20;
  return {
    summary: hasMoisture 
      ? `System diagnostics focusing on ${isDry ? 'water replenishment' : 'soil stability'}.`
      : "Awaiting primary sensor registration for moisture profiling.",
    soil_fertilizer: isDry ? "Priority: Drip irrigation cycle." : "Register pH probe for accurate NPK strategy."
  };
};

const getFallbackPrescription = (data: any): ManagementPrescription => {
  const isDry = data.moisture !== undefined && data.moisture < 20;
  return {
    irrigation: { needed: isDry, volume: isDry ? "12,000L/ha" : "Monitoring", schedule: "Pre-dawn" },
    nutrient: { needed: data.npk_n !== undefined, fertilizers: [], advice: "NPK probe required for prescription." }
  };
};

const getFallbackPlan = (data: any) => {
  const roadmap = [];
  if (data.moisture !== undefined) roadmap.push({ priority: "HIGH", title: "Moisture Balance", description: "Correcting water volume based on FDR sensor.", icon: "fa-droplet" });
  if (data.ph_level !== undefined) roadmap.push({ priority: "MEDIUM", title: "pH Correction", description: "Neutralizing soil based on probe data.", icon: "fa-scale-balanced" });
  if (data.npk_n !== undefined) roadmap.push({ priority: "MEDIUM", title: "Nutrient Sync", description: "Applying supplement based on NPK analyzer.", icon: "fa-flask" });
  
  if (roadmap.length === 0) {
    roadmap.push({ priority: "URGENT", title: "Sensor Installation", description: "No sensors detected. Please register hardware at the Sensors page.", icon: "fa-satellite-dish" });
  }
  return roadmap;
};
