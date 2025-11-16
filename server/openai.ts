import OpenAI from "openai";

// Follow these instructions when using this integration:
// 1. The newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// 2. Use the response_format: { type: "json_object" } option when needed
// 3. Request output in JSON format in the prompt when using json_object
// 4. gpt-5 doesn't support temperature parameter, do not use it.

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY must be set");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateAIResponse(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<string> {
  const messagesToSend = [
    ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
    ...messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    messages: messagesToSend,
    max_completion_tokens: 2048,
  });

  return response.choices[0].message.content || '';
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
  const prompt = `Based on this conversation, analyze the buyer's needs and provide a qualification score (0-100).
Return JSON with: qualificationScore, extractedNeeds (budget, location, propertyType, urgency, features), and outcome (qualified/not_qualified/needs_followup)`;

  const response = await openai.chat.completions.create({
    model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    messages: [
      { role: 'system', content: prompt },
      ...conversationHistory.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 1024,
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  return result;
}

export { openai };
