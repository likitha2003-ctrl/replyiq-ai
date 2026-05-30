import { NextResponse } from 'next/server';
import { generateFollowUp } from '../../../../lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const { conversationHistory, contactName, triggerType, businessContext } = await req.json();

    if (!conversationHistory) {
      return NextResponse.json({ error: 'conversationHistory is required' }, { status: 400 });
    }

    const result = await generateFollowUp(
      conversationHistory,
      contactName || 'Customer',
      triggerType || 'manual',
      businessContext || 'software product'
    );

    return NextResponse.json({ message: result });
  } catch (error) {
    console.error('Error in /api/ai/generate-followup:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
