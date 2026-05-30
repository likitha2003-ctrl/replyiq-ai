import { NextResponse } from 'next/server';
import { scoreLead } from '../../../../lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadData } = body;

    if (!leadData) {
      return NextResponse.json({ error: 'leadData is required' }, { status: 400 });
    }

    const leadResult = await scoreLead(leadData);

    // Save to Supabase (if configured)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        await supabase
          .from('leads')
          .update({
            score: leadResult.score,
            score_breakdown: leadResult.breakdown,
            score_updated_at: new Date().toISOString()
          })
          .eq('id', leadData.id);
      } catch (err) {
        console.error('Error updating Supabase:', err);
      }
    }

    return NextResponse.json(leadResult);
  } catch (error) {
    console.error('Error in /api/ai/score-lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
