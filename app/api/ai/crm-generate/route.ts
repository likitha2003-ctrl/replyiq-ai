import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const { type, context } = await req.json();

    let prompt = '';

    if (type === 'next_action') {
      prompt = `Draft a concise, personalized outreach message for a contact. 
Context: ${context}
The message should directly address the context and invite a response. Return ONLY the message text.`;
    } else if (type === 'stage_outreach') {
      prompt = `Draft a professional sales outreach message to unblock a deal.
Context: ${context}
The message should be helpful, provide value, and encourage the prospect to take the next step. Return ONLY the message text.`;
    } else if (type === 're_engage') {
      prompt = `Draft a personalized re-engagement message for a cold or at-risk contact.
Context: ${context}
The message should be warm, non-pushy, and designed to revive the relationship. Return ONLY the message text.`;
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error generating CRM insight message:', error);
    return NextResponse.json({ error: 'Failed to generate message' }, { status: 500 });
  }
}
