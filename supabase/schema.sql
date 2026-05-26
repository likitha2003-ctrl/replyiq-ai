-- ============================================
-- ReplyIQ AI — Complete Supabase Schema
-- Run this SQL in the Supabase SQL Editor
-- ============================================

-- 1. User / Business Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  business_type TEXT,
  knowledge_base TEXT,
  ai_mode TEXT DEFAULT 'supervised' CHECK (ai_mode IN ('auto', 'supervised')),
  response_tone TEXT DEFAULT 'professional' CHECK (response_tone IN ('professional', 'casual', 'empathetic', 'persuasive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  contact_avatar TEXT,
  contact_channel TEXT NOT NULL CHECK (contact_channel IN ('whatsapp', 'instagram', 'website')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'snoozed', 'resolved')),
  sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative', 'urgent')),
  urgency_score INTEGER DEFAULT 30,
  is_lead BOOLEAN DEFAULT FALSE,
  lead_priority TEXT CHECK (lead_priority IN ('hot', 'warm', 'cold')),
  lead_reason TEXT,
  summary TEXT,
  ai_draft TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'agent', 'ai')),
  content TEXT NOT NULL,
  channel TEXT CHECK (channel IN ('whatsapp', 'instagram', 'website')),
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative', 'urgent')),
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Leads (CRM Pipeline)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  company_name TEXT,
  channel TEXT CHECK (channel IN ('whatsapp', 'instagram', 'website')),
  deal_value NUMERIC DEFAULT 0,
  confidence INTEGER DEFAULT 50,
  priority TEXT DEFAULT 'warm' CHECK (priority IN ('hot', 'warm', 'cold')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'won', 'lost')),
  reason TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Knowledge Base (one row per user)
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  content TEXT DEFAULT '',
  word_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_channel ON conversations(contact_channel);
CREATE INDEX idx_conversations_last_msg ON conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_leads_user ON leads(user_id);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_status ON leads(status);

-- ============================================
-- Enable Supabase Realtime
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON conversations FOR DELETE USING (auth.uid() = user_id);

-- messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid()));
CREATE POLICY "Users can insert messages in own conversations" ON messages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid()));

-- leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own leads" ON leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own leads" ON leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leads" ON leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own leads" ON leads FOR DELETE USING (auth.uid() = user_id);

-- knowledge_base
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own knowledge base" ON knowledge_base FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own knowledge base" ON knowledge_base FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own knowledge base" ON knowledge_base FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- Auto-update knowledge_base word count trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_kb_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count := array_length(string_to_array(trim(COALESCE(NEW.content, '')), ' '), 1);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_kb_word_count
  BEFORE INSERT OR UPDATE ON knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_kb_word_count();

-- ============================================
-- Auto-create profile on signup (auth trigger)
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  INSERT INTO public.knowledge_base (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
