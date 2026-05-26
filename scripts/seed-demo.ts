import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDemoData() {
  console.log('🌱 Starting Demo Data Seeding...');

  const demoUserId = '00000000-0000-0000-0000-000000000000';

  console.log('Setting up profile for demo user...');
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: demoUserId,
    business_name: 'Spice Garden Restaurant, Hyderabad',
    business_type: 'Restaurant',
    knowledge_base: 'We are Spice Garden, a South Indian restaurant in Hyderabad. Open daily 11am–11pm. Dine-in, takeaway, and Swiggy delivery available. Signature dishes: Hyderabadi Biryani (₹280), Pesarattu (₹120), Gongura Chicken (₹320). We accept UPI, cards, and cash. Reservations: call +91-98765-43210.',
    ai_mode: 'auto',
    response_tone: 'friendly'
  });

  if (profileError) console.error('Profile error:', profileError);

  console.log('Setting up Knowledge Base...');
  await supabase.from('knowledge_base').upsert({
    user_id: demoUserId,
    content: 'We are Spice Garden, a South Indian restaurant in Hyderabad. Open daily 11am–11pm. Dine-in, takeaway, and Swiggy delivery available. Signature dishes: Hyderabadi Biryani (₹280), Pesarattu (₹120), Gongura Chicken (₹320). We accept UPI, cards, and cash. Reservations: call +91-98765-43210.',
  });

  console.log('Seeding conversations...');
  
  const now = new Date();
  const getPastTime = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString();

  const { data: convData, error: convError } = await supabase.from('conversations').insert([
    {
      user_id: demoUserId,
      contact_name: 'Karan Mehra',
      contact_channel: 'whatsapp',
      sentiment: 'positive',
      is_lead: true,
      lead_priority: 'hot',
      lead_reason: 'Looking to book a table for a party of 20.',
      summary: 'Large group reservation inquiry.',
      last_message_at: getPastTime(5),
    },
    {
      user_id: demoUserId,
      contact_name: 'Neha Reddy',
      contact_channel: 'instagram',
      sentiment: 'neutral',
      is_lead: true,
      lead_priority: 'warm',
      lead_reason: 'Asking about catering for a corporate event.',
      summary: 'Corporate catering inquiry.',
      last_message_at: getPastTime(15),
    },
    {
      user_id: demoUserId,
      contact_name: 'Rohit Sharma',
      contact_channel: 'website',
      sentiment: 'urgent',
      is_lead: false,
      summary: 'Checking Swiggy order status.',
      last_message_at: getPastTime(20),
    },
    {
      user_id: demoUserId,
      contact_name: 'Anjali Desai',
      contact_channel: 'whatsapp',
      sentiment: 'positive',
      is_lead: true,
      lead_priority: 'hot',
      lead_reason: 'Wants to order 50 Biryanis for an event tomorrow.',
      summary: 'Bulk order for Biryani.',
      last_message_at: getPastTime(45),
    },
    {
      user_id: demoUserId,
      contact_name: 'Vikram Singh',
      contact_channel: 'instagram',
      sentiment: 'neutral',
      is_lead: false,
      summary: 'Asking about parking availability.',
      last_message_at: getPastTime(60),
    },
    {
      user_id: demoUserId,
      contact_name: 'Sneha Kapoor',
      contact_channel: 'website',
      sentiment: 'negative',
      is_lead: false,
      summary: 'Complaint about a delayed takeaway order.',
      last_message_at: getPastTime(80),
    },
    {
      user_id: demoUserId,
      contact_name: 'Aditya Varma',
      contact_channel: 'whatsapp',
      sentiment: 'neutral',
      is_lead: true,
      lead_priority: 'warm',
      lead_reason: 'Inquiring about a private dining room.',
      summary: 'Private dining room availability.',
      last_message_at: getPastTime(100),
    },
    {
      user_id: demoUserId,
      contact_name: 'Pooja Iyer',
      contact_channel: 'instagram',
      sentiment: 'positive',
      is_lead: false,
      summary: 'Complimented the Gongura Chicken.',
      last_message_at: getPastTime(120),
    }
  ]).select();

  if (convError) {
    console.error('Conversation error:', convError);
  } else if (convData) {
    console.log(`✅ Seeded ${convData.length} conversations.`);

    console.log('Seeding messages...');
    await supabase.from('messages').insert([
      { conversation_id: convData[0].id, role: 'user', content: 'Hi, I want to book a table for 20 people this Saturday.' },
      { conversation_id: convData[0].id, role: 'ai', content: 'Hello Karan! We would love to host your party. Do you have a preferred time?', is_ai_generated: true },
      { conversation_id: convData[1].id, role: 'user', content: 'Do you provide catering for office events?' },
      { conversation_id: convData[2].id, role: 'user', content: 'Where is my Swiggy order? It is 30 mins late!' },
      { conversation_id: convData[3].id, role: 'user', content: 'I need to order 50 Hyderabadi Biryanis for tomorrow. Can you do it?' },
      { conversation_id: convData[4].id, role: 'user', content: 'Is there parking available near the restaurant?' },
      { conversation_id: convData[5].id, role: 'user', content: 'My takeaway order was cold by the time I picked it up.' },
      { conversation_id: convData[6].id, role: 'user', content: 'Do you have a private dining room for a small family gathering?' },
      { conversation_id: convData[7].id, role: 'user', content: 'Your Gongura Chicken was absolutely amazing!' },
    ]);
    
    console.log('Seeding leads...');
    await supabase.from('leads').insert([
      { conversation_id: convData[0].id, user_id: demoUserId, contact_name: 'Karan Mehra', channel: 'whatsapp', priority: 'hot', reason: 'Booking for 20 people', status: 'new', deal_value: 6000 },
      { conversation_id: convData[1].id, user_id: demoUserId, contact_name: 'Neha Reddy', channel: 'instagram', priority: 'warm', reason: 'Corporate catering inquiry', status: 'contacted', deal_value: 15000 },
      { conversation_id: convData[3].id, user_id: demoUserId, contact_name: 'Anjali Desai', channel: 'whatsapp', priority: 'hot', reason: 'Bulk order 50 Biryanis', status: 'new', deal_value: 14000 }
    ]);
  }

  console.log('🎉 Demo data seeded successfully!');
}

seedDemoData();
