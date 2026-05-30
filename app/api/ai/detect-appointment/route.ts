import { NextResponse } from 'next/server';
import { detectAppointment } from '../../../../lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const { message, contactName } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const result = await detectAppointment(message, contactName || 'Customer');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/ai/detect-appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
