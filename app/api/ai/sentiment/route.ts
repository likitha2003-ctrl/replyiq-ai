import { NextResponse } from 'next/server';
import { detectSentiment } from '../../../../lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message string is required' }, { status: 400 });
    }

    const sentimentResult = await detectSentiment(message);

    return NextResponse.json(sentimentResult);
  } catch (error) {
    console.error('Error in /api/ai/sentiment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
