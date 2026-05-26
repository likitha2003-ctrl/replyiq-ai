import { NextResponse } from 'next/server';
import { summarizeConversation } from '../../../../lib/ai/gemini';
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

    const summary = await summarizeConversation(formattedHistory);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in /api/ai/summarize:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
