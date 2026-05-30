import { NextResponse } from 'next/server';
import { extractPromises } from '../../../../lib/ai/gemini';
import { Message } from '../../../../types';

export async function POST(req: Request) {
  try {
    const { conversationHistory, conversationId } = await req.json();

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return NextResponse.json({ error: 'conversationHistory array is required' }, { status: 400 });
    }

    const formattedHistory = conversationHistory.map((m: Message) => ({
      role: m.sender === 'user' ? 'customer' : 'agent',
      content: m.content
    }));

    const promises = await extractPromises(formattedHistory);

    // If we have a conversationId and extracted promises, we could save to Supabase here
    if (promises.length > 0 && conversationId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const inserts = promises.map(p => ({
          conversation_id: conversationId,
          promise_text: p.promiseText,
          promised_to: p.promisedTo,
          due_date: p.dueDate,
          status: 'pending'
        }));

        await supabase.from('promises').insert(inserts);
      } catch (err) {
        console.error('Error saving promises to Supabase:', err);
      }
    }

    return NextResponse.json(promises);
  } catch (error) {
    console.error('Error in /api/ai/extract-promises:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
