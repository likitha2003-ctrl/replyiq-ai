import { NextResponse } from 'next/server';
import { generateReply } from '../../../../lib/ai/gemini';
import { Message } from '../../../../types';

export async function POST(req: Request) {
  try {
    const { conversationHistory, businessContext, tone } = await req.json();

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return NextResponse.json({ error: 'conversationHistory array is required' }, { status: 400 });
    }

    // Map your frontend Message format to the simple format expected by Gemini
    const formattedHistory = conversationHistory.map((m: Message) => ({
      role: m.sender === 'user' ? 'customer' : 'agent',
      content: m.content
    }));

    const reply = await generateReply(
      formattedHistory,
      businessContext || "Our business helps customers with their inquiries quickly.",
      tone || "professional"
    );

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in /api/ai/reply:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
