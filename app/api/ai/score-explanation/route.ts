import { NextResponse } from 'next/server';
import { geminiFlash } from '../../../../lib/ai/gemini';
import { SCORE_EXPLANATION_PROMPT } from '../../../../lib/ai/prompts';

export async function POST(req: Request) {
  try {
    const { lead } = await req.json();

    if (!lead) {
      return NextResponse.json({ error: 'lead is required' }, { status: 400 });
    }

    const sb = lead.scoreBreakdown || {};

    const prompt = SCORE_EXPLANATION_PROMPT
      .replace('{{LEAD_NAME}}', lead.contactName || 'Unknown')
      .replace('{{COMPANY}}', lead.companyName || 'Unknown Company')
      .replace('{{SCORE}}', String(lead.score ?? 0))
      .replace('{{PRIORITY}}', lead.priority || 'cold')
      .replace('{{CHANNEL}}', lead.channel || 'email')
      .replace('{{SUMMARY}}', lead.summary || '')
      .replace('{{ENGAGEMENT}}', String(sb.engagement ?? 50))
      .replace('{{INTENT}}', String(sb.intent ?? 50))
      .replace('{{RECENCY}}', String(sb.recency ?? 50))
      .replace('{{SENTIMENT}}', String(sb.sentiment ?? 50));

    const result = await geminiFlash.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip markdown code fences if present
    if (text.startsWith('```json')) text = text.replace(/```json\n?/, '').replace(/\n?```/, '');
    else if (text.startsWith('```')) text = text.replace(/```\n?/, '').replace(/\n?```/, '');

    const parsed = JSON.parse(text);

    return NextResponse.json({
      reasons: parsed.reasons || [],
      recommendedAction: parsed.recommendedAction || 'Follow up with a personalised message.',
    });
  } catch (error) {
    console.error('score-explanation error:', error);
    // Graceful fallback — never crash the UI
    return NextResponse.json({
      reasons: [
        'This lead has demonstrated measurable buying intent through their inquiries.',
        'Engagement frequency and channel activity are consistent with a decision-maker.',
        'Recent interaction suggests an active evaluation window.',
      ],
      recommendedAction: 'Send a personalised follow-up with a clear call-to-action.',
    });
  }
}
