import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FounderProfile, GameStats, TurnResponse } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    narrative: {
      type: Type.STRING,
      description: "The story paragraph describing the current situation, world events, and consequences. Be vivid and realistic.",
    },
    feedback: {
      type: Type.STRING,
      description: "A direct, short reaction to the user's previous action (e.g., 'Investors loved that' or 'The code crashed').",
    },
    eventSummary: {
      type: Type.STRING,
      description: "A 3-5 word headline for this turn (e.g., 'Series A Funding Secured').",
    },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING, description: "The action the user can take." },
          type: { type: Type.STRING, enum: ['risky', 'safe', 'expensive', 'innovative'] }
        },
        required: ["id", "text", "type"]
      }
    },
    statChanges: {
      type: Type.OBJECT,
      properties: {
        cash: { type: Type.INTEGER, description: "Change in cash (positive or negative)." },
        users: { type: Type.INTEGER, description: "Change in active users." },
        productQuality: { type: Type.INTEGER, description: "Change in product quality (-10 to 10)." },
        hype: { type: Type.INTEGER, description: "Change in market hype (-10 to 10)." },
        stress: { type: Type.INTEGER, description: "Change in founder stress (-10 to 10)." },
        valuation: { type: Type.INTEGER, description: "Change in company valuation." }
      },
      required: ["cash", "users", "productQuality", "hype", "stress", "valuation"]
    },
    isGameOver: { type: Type.BOOLEAN },
    gameOverReason: { type: Type.STRING, description: "If game over, explain why (e.g., Bankruptcy, Burnout, Bought out)." }
  },
  required: ["narrative", "feedback", "choices", "statChanges", "eventSummary", "isGameOver"]
};

export const generateInitialScenario = async (profile: FounderProfile): Promise<TurnResponse> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Start a new startup simulation roleplay.
    Founder: ${profile.name}, ${profile.degree} in ${profile.background}.
    Specialty: ${profile.specialty}.
    
    Create a scenario where they are just coming up with an idea. It can be anything from a boring SaaS to something wild or controversial.
    Establish the initial context.
    
    Current Stats:
    Cash: $10,000
    Users: 0
    Valuation: $0
    
    Provide 3 distinct choices for the initial startup concept.
  `;

  const response = await genAI.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      systemInstruction: "You are the Game Master for a realistic, gritty, and sometimes humorous startup simulator. Your goal is to guide the user through the lifecycle of a startup: Idea -> Prototype -> Funding -> Marketing -> Scale. Actions have consequences on the world society. Be tough but fair. If cash runs out or stress hits 100, the game ends."
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TurnResponse;
};

export const generateNextTurn = async (
  profile: FounderProfile,
  currentStats: GameStats,
  lastChoiceId: string,
  history: string[] // Summary of last few events to keep context
): Promise<TurnResponse> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Continue the simulation.
    Founder: ${profile.name} (${profile.specialty}).
    Current Stats:
    - Cash: $${currentStats.cash}
    - Users: ${currentStats.users}
    - Product Quality: ${currentStats.productQuality}/100
    - Hype: ${currentStats.hype}/100
    - Stress: ${currentStats.stress}/100
    - Valuation: $${currentStats.valuation}
    
    Recent History: ${history.slice(-3).join(" -> ")}
    
    The user chose action ID: "${lastChoiceId}".
    
    Determine the outcome of this action. Did it succeed? Did it fail? How does it affect the world?
    Update the stats accordingly (be realistic: marketing costs money, development increases quality but adds stress).
    Provide the next set of strategic options (e.g., Pivot, Hire, Raise Funds, Launch Feature).
  `;

  const response = await genAI.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      systemInstruction: "You are a sophisticated economic and narrative engine. Calculate realistic outcomes. If the user makes bad choices, punish them with lost cash or users. If they innovate, reward them. Introduce random events occasionally (market crash, viral tweet, lawsuit)."
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TurnResponse;
};
