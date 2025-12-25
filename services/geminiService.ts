
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FounderProfile, GameStats, TurnResponse, WorldState } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    narrative: {
      type: Type.STRING,
      description: "Descriptive story. Incorporate the theme (Light/Dark/Neon) into the prose.",
    },
    feedback: {
      type: Type.STRING,
      description: "Strategy advice based on difficulty.",
    },
    visualVibe: {
      type: Type.STRING,
      description: "A CSS color or mood keyword (e.g., 'calm', 'tense', 'explosive').",
    },
    eventSummary: {
      type: Type.STRING,
      description: "Headline for the turn.",
    },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['risky', 'safe', 'expensive', 'innovative'] },
          icon: { type: Type.STRING, description: "One relevant emoji icon." }
        },
        required: ["id", "text", "type", "icon"]
      }
    },
    statChanges: {
      type: Type.OBJECT,
      properties: {
        cash: { type: Type.INTEGER },
        users: { type: Type.INTEGER },
        productQuality: { type: Type.INTEGER },
        marketFit: { type: Type.INTEGER },
        stress: { type: Type.INTEGER },
        valuation: { type: Type.INTEGER }
      },
      required: ["cash", "users", "productQuality", "marketFit", "stress", "valuation"]
    },
    worldUpdate: {
      type: Type.OBJECT,
      properties: {
        marketCycle: { type: Type.STRING, enum: ['Bull', 'Bear', 'Stagnant'] },
        trendingTech: { type: Type.ARRAY, items: { type: Type.STRING } },
        globalEvent: { type: Type.STRING }
      }
    },
    isGameOver: { type: Type.BOOLEAN },
    gameOverReason: { type: Type.STRING }
  },
  required: ["narrative", "feedback", "choices", "statChanges", "eventSummary", "isGameOver", "visualVibe"]
};

const getSystemInstruction = (profile: FounderProfile) => `
You are a high-fidelity Startup Simulation Engine.
Difficulty: ${profile.difficulty === 'bootstrapper' ? 'Bootstrapper (Simpler wording, forgiving economics)' : 'Venture Scale (Complex business terminology, aggressive market shifts)'}.
Theme Atmosphere: ${profile.theme}.

Logic:
1. Economics are grounded in reality.
2. User provides actions (either from list or custom text).
3. If custom text is provided, interpret its realistic impact on the startup world.
4. Don't be cliché; use current market realities (venture debt, churn, LTV/CAC, pivot fatigue).
5. Always describe the environment visually (post-modern architecture, high-tech energy grids).
`;

export const generateInitialScenario = async (profile: FounderProfile): Promise<TurnResponse> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Start game for ${profile.name}. Degree: ${profile.degree}. Background: ${profile.background}. Initial ideas?`;

  const response = await genAI.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      systemInstruction: getSystemInstruction(profile)
    }
  });
  return JSON.parse(response.text) as TurnResponse;
};

export const generateNextTurn = async (
  profile: FounderProfile,
  currentStats: GameStats,
  action: string,
  isCustom: boolean,
  world: WorldState
): Promise<TurnResponse> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Turn ${currentStats.turn}. Action: ${isCustom ? '[CUSTOM ACTION]: ' : ''}${action}.
    Stats: Cash $${currentStats.cash}, Users ${currentStats.users}, Quality ${currentStats.productQuality}, Market Fit ${currentStats.marketFit}.
    Market: ${world.marketCycle}. 
    Calculate outcome. If it's a custom action, be critical but fair.
  `;

  const response = await genAI.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      systemInstruction: getSystemInstruction(profile)
    }
  });
  return JSON.parse(response.text) as TurnResponse;
};
