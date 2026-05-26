import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { detectSentiment } from '../../../../lib/ai/gemini';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

const messageTemplates = [
  // WhatsApp
  { content: 'Hi, what are your timings today?', channel: 'whatsapp' },
  { content: 'Do you do home delivery? I\'m near the downtown area.', channel: 'whatsapp' },
  { content: 'What\'s the price for the deluxe package?', channel: 'whatsapp' },
  { content: 'Hey! Can I get a bulk order discount for 50 units?', channel: 'whatsapp' },
  { content: 'I placed an order 3 days ago and still haven\'t received it. Very frustrated.', channel: 'whatsapp' },
  { content: 'Do you accept UPI payments?', channel: 'whatsapp' },
  { content: 'I need to cancel my subscription. How do I do that?', channel: 'whatsapp' },
  { content: 'Your product is amazing! Just wanted to share that our team loves it.', channel: 'whatsapp' },

  // Instagram
  { content: 'Saw your post! Do you ship to Hyderabad?', channel: 'instagram' },
  { content: 'How much for a custom order? I want something personalized.', channel: 'instagram' },
  { content: 'OMG love your designs! Are these available in store?', channel: 'instagram' },
  { content: 'Can I become a brand ambassador? I have 15K followers.', channel: 'instagram' },
  { content: 'Is the summer sale still going on? I saw 40% off on stories.', channel: 'instagram' },
  { content: 'I messaged yesterday but no response. Kind of disappointed.', channel: 'instagram' },
  { content: 'Do you have a referral program? I want to share with my friends.', channel: 'instagram' },

  // Website Chat
  { content: 'Can I book an appointment for tomorrow at 3 PM?', channel: 'website' },
  { content: 'What payment methods do you accept?', channel: 'website' },
  { content: 'I\'m comparing your enterprise plan vs competitors. Can you send me a detailed comparison?', channel: 'website' },
  { content: 'The checkout page is showing an error. I can\'t complete my purchase.', channel: 'website' },
  { content: 'Do you offer a free trial before committing to an annual plan?', channel: 'website' },
  { content: 'We\'re a team of 25. What would be the best plan for us?', channel: 'website' },
  { content: 'Just signed up! Everything looks great so far. Quick question about integrations.', channel: 'website' },
  { content: 'I need to upgrade from Starter to Business. Will I lose any data?', channel: 'website' },
];

const contactPool = [
  { name: 'Priya Sharma', email: 'priya@startupindia.co' },
  { name: 'James Wilson', email: 'james.w@techflow.io' },
  { name: 'Aisha Khan', email: 'aisha@designlab.pk' },
  { name: 'Carlos Mendez', email: 'carlos@retailpro.mx' },
  { name: 'Sophie Laurent', email: 'sophie@modehub.fr' },
  { name: 'Raj Patel', email: 'raj@cloudscale.in' },
  { name: 'Emma Johnson', email: 'emma.j@greenleaf.co.uk' },
  { name: 'David Kim', email: 'david@nexgen.kr' },
  { name: 'Fatima Al-Rashid', email: 'fatima@oasisretail.ae' },
  { name: 'Lucas Schmidt', email: 'lucas@autohaus.de' },
];

export async function POST() {
  try {
    const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
    const contact = contactPool[Math.floor(Math.random() * contactPool.length)];

    // Step 1: Detect Sentiment via Gemini
    const { sentiment } = await detectSentiment(template.content);

    // Step 2: Create a conversation in Supabase
    // Using a mocked user_id for simulation if actual auth isn't present
    // You might want to grab the user_id from auth or pass it in the body, but for generic simulation we can skip or use a dummy.
    const { data: convData, error: convError } = await supabase.from('conversations').insert({
      contact_name: contact.name,
      contact_email: contact.email,
      contact_channel: template.channel,
      sentiment: sentiment,
      last_message_at: new Date().toISOString()
    }).select().single();

    if (convError || !convData) {
      console.error('Simulate Message - Conversation Insert Error:', convError);
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }

    // Step 3: Insert Message
    const { data: msgData, error: msgError } = await supabase.from('messages').insert({
      conversation_id: convData.id,
      role: 'user',
      content: template.content,
      channel: template.channel,
      sentiment: sentiment
    }).select().single();

    if (msgError || !msgData) {
      console.error('Simulate Message - Message Insert Error:', msgError);
      return NextResponse.json({ error: 'Failed to insert message' }, { status: 500 });
    }

    return NextResponse.json({
      conversation: convData,
      message: msgData
    });
  } catch (error) {
    console.error('Error in /api/simulate/message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
