import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  REPLY_SYSTEM_PROMPT,
  SENTIMENT_PROMPT,
  LEAD_DETECT_PROMPT,
  SUMMARIZE_PROMPT,
} from "./prompts";

// The user mentioned an API key in the prompt, let's use the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiFlash = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateReply(
  conversationHistory: { role: string; content: string }[],
  businessContext: string,
  tone: string
): Promise<string> {
  await delay(200);

  const systemPrompt = REPLY_SYSTEM_PROMPT
    .replace('{{BUSINESS_CONTEXT}}', businessContext)
    .replace('{{TONE}}', tone);

  const historyText = conversationHistory
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = `${systemPrompt}\n\nConversation:\n${historyText}\n\nReply:`;

  try {
    const result = await geminiFlash.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Reply Error:", error);
    return "Thanks for reaching out! Let me check that for you and get back shortly.";
  }
}

export async function detectSentiment(
  message: string
): Promise<{ sentiment: string; confidence: number }> {
  await delay(200);

  const prompt = SENTIMENT_PROMPT.replace('{{MESSAGE}}', message.replace(/"/g, '\\"'));

  try {
    const result = await geminiFlash.generateContent(prompt);
    let text = result.response.text();
    // Clean up potential markdown formatting from Gemini
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/, '').replace(/\n?```/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/, '').replace(/\n?```/, '');
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Sentiment Error:", error);
    return { sentiment: "neutral", confidence: 0.8 };
  }
}

export async function detectLead(
  conversationHistory: { role: string; content: string }[]
): Promise<{ isLead: boolean; priority: string; reason: string }> {
  await delay(200);

  const historyText = conversationHistory
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = LEAD_DETECT_PROMPT.replace('{{HISTORY}}', historyText);

  try {
    const result = await geminiFlash.generateContent(prompt);
    let text = result.response.text();
    // Clean up potential markdown formatting from Gemini
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/, '').replace(/\n?```/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/, '').replace(/\n?```/, '');
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Lead Detect Error:", error);
    return { isLead: false, priority: "cold", reason: "Unable to analyze" };
  }
}

export async function summarizeConversation(
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  await delay(200);

  const historyText = conversationHistory
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = SUMMARIZE_PROMPT.replace('{{HISTORY}}', historyText);

  try {
    const result = await geminiFlash.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Summarize Error:", error);
    return "Conversation with customer regarding their enquiry.";
  }
}
