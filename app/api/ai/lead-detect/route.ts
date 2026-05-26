import { NextResponse } from 'next/server';
import { detectLead } from '../../../../lib/ai/gemini';
import { Message } from '../../../../types';

export async function POST(req: Request) {
  try {
    const { conversationHistory } = await req.json();

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return NextResponse.json({ error: 'conversationHistory array is required' }, { status: 400 });
    }

    const formattedHistory = conversationHistory.map((m: Message) => ({
      role: m.sender === 'user' ? 'customer' : 'agent',
      content: m.content
    }));

    const leadResult = await detectLead(formattedHistory);

    return NextResponse.json(leadResult);
  } catch (error) {
    console.error('Error in /api/ai/lead-detect:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
