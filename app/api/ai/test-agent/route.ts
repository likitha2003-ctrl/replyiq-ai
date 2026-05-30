import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const { message, history, persona, tone, escalationRules, useFAQ, autoAppointment } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = `You are an AI Sales Agent for a business.
Persona: ${persona}
Tone: ${tone}
Rules:
- Escalation rules: ${escalationRules}
- Use FAQ: ${useFAQ}
- Auto-appointment: ${autoAppointment}

You are chatting with a customer in a simulated environment. Keep your responses short, conversational, and tailored to the requested persona and tone. If the customer asks to book an appointment and auto-appointment is true, pretend to schedule it. If they are angry and escalation rules apply, state that you are escalating to a human.
`;

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Understood. I will act as the sales agent." }] },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
      }
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error in /api/ai/test-agent:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
