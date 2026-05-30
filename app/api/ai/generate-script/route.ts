import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const { businessName, industry, objective } = await req.json();

    const prompt = `Generate a highly converting, natural-sounding voice call script for an AI Voice Agent.
Business Name: ${businessName}
Industry: ${industry}
Call Objective: ${objective}

The script should be concise, sound conversational, and use the variables {{customer_name}}, {{offer}}, and {{callback_time}} where appropriate. Return ONLY the script text, without any additional explanations.`;

    const result = await model.generateContent(prompt);
    const script = result.response.text().trim();

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
  }
}
