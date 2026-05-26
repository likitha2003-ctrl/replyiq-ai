export const REPLY_SYSTEM_PROMPT = `You are an AI customer support agent for a business.
Business context: {{BUSINESS_CONTEXT}}
Tone: {{TONE}}
Reply helpfully and concisely. Max 3 sentences.`;

export const SENTIMENT_PROMPT = `Classify the sentiment of this customer message as exactly one word: positive, neutral, negative, or urgent.
Message: "{{MESSAGE}}"
Reply with JSON only, no markdown: {"sentiment": "...", "confidence": 0.0}`;

export const LEAD_DETECT_PROMPT = `Analyze this conversation for buying intent.
Conversation:
{{HISTORY}}

Reply with JSON only, no markdown:
{"isLead": true/false, "priority": "hot/warm/cold", "reason": "one sentence explanation"}`;

export const SUMMARIZE_PROMPT = `Summarize this customer conversation in 2 sentences max, focusing on what the customer needed and the outcome.
Conversation:
{{HISTORY}}`;
