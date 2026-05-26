export type Channel = 'email' | 'whatsapp' | 'sms' | 'instagram';

export type Sentiment = 'positive' | 'neutral' | 'negative' | 'urgent';

export type ConversationStatus = 'open' | 'snoozed' | 'resolved';

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'agent' | 'ai';
  content: string;
  timestamp: string;
  channel: Channel;
  sentiment?: Sentiment;
}

export interface Conversation {
  id: string;
  contactName: string;
  contactEmail: string;
  contactAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  status: ConversationStatus;
  channel: Channel;
  sentiment: Sentiment;
  urgencyScore: number; // 0 - 100
  summary?: string;
  messages: Message[];
  aiDraft?: string;
}

export interface Lead {
  id: string;
  conversationId: string;
  contactName: string;
  contactEmail: string;
  companyName?: string;
  dealValue: number;
  confidence: number; // 0 - 100
  priority: 'hot' | 'warm' | 'cold';
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
  channel: Channel;
  dateCreated: string;
  summary: string;
}

export interface NotificationLog {
  id: string;
  type: 'message' | 'lead' | 'ai_reply' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AISettings {
  autoPilot: boolean;
  tone: 'professional' | 'casual' | 'empathetic' | 'persuasive';
  agentName: string;
  customInstructions: string;
}
