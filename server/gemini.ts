import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAIResponse(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const formattedMessages = messages.map(m => m.content).join('\n\n');
  const prompt = systemPrompt 
    ? `${systemPrompt}\n\nConversation:\n${formattedMessages}`
    : formattedMessages;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function qualifyBuyer(
  conversationHistory: Array<{ role: string; content: string }>
): Promise<{
  qualificationScore: number;
  extractedNeeds: {
    budget?: { min?: number; max?: number };
    location?: string[];
    propertyType?: string[];
    urgency?: string;
    features?: string[];
  };
  outcome: string;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const conversationText = conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n');
  const prompt = `Based on this real estate conversation, analyze the buyer's needs and provide a qualification score (0-100).

Conversation:
${conversationText}

Return ONLY a valid JSON object with this exact structure:
{
  "qualificationScore": <number 0-100>,
  "extractedNeeds": {
    "budget": {"min": <number or null>, "max": <number or null>},
    "location": [<array of strings or empty>],
    "propertyType": [<array of strings or empty>],
    "urgency": "<low/medium/high or null>",
    "features": [<array of strings or empty>]
  },
  "outcome": "<qualified/not_qualified/needs_followup>"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error('Failed to parse qualification response:', err);
  }

  return {
    qualificationScore: 50,
    extractedNeeds: {},
    outcome: 'needs_followup'
  };
}
