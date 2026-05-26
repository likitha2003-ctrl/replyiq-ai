export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          contact_name: string;
          contact_email: string;
          contact_avatar: string | null;
          last_message: string | null;
          last_message_time: string;
          status: 'open' | 'snoozed' | 'resolved';
          channel: 'email' | 'whatsapp' | 'sms';
          sentiment: 'positive' | 'neutral' | 'negative' | 'urgent';
          urgency_score: number;
          summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_name: string;
          contact_email: string;
          contact_avatar?: string | null;
          last_message?: string | null;
          last_message_time?: string;
          status?: 'open' | 'snoozed' | 'resolved';
          channel: 'email' | 'whatsapp' | 'sms';
          sentiment?: 'positive' | 'neutral' | 'negative' | 'urgent';
          urgency_score?: number;
          summary?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          contact_name?: string;
          contact_email?: string;
          contact_avatar?: string | null;
          last_message?: string | null;
          last_message_time?: string;
          status?: 'open' | 'snoozed' | 'resolved';
          channel?: 'email' | 'whatsapp' | 'sms';
          sentiment?: 'positive' | 'neutral' | 'negative' | 'urgent';
          urgency_score?: number;
          summary?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender: 'user' | 'agent' | 'ai';
          content: string;
          timestamp: string;
          channel: 'email' | 'whatsapp' | 'sms';
          sentiment: string | null;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender: 'user' | 'agent' | 'ai';
          content: string;
          timestamp?: string;
          channel: 'email' | 'whatsapp' | 'sms';
          sentiment?: string | null;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender?: 'user' | 'agent' | 'ai';
          content?: string;
          timestamp?: string;
          channel?: 'email' | 'whatsapp' | 'sms';
          sentiment?: string | null;
        };
      };
      leads: {
        Row: {
          id: string;
          conversation_id: string;
          contact_name: string;
          contact_email: string;
          company_name: string | null;
          deal_value: number;
          confidence: number;
          status: 'new' | 'contacted' | 'qualified' | 'won';
          channel: 'email' | 'whatsapp' | 'sms';
          date_created: string;
          summary: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          contact_name: string;
          contact_email: string;
          company_name?: string | null;
          deal_value?: number;
          confidence?: number;
          status?: 'new' | 'contacted' | 'qualified' | 'won';
          channel: 'email' | 'whatsapp' | 'sms';
          date_created?: string;
          summary: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          contact_name?: string;
          contact_email?: string;
          company_name?: string | null;
          deal_value?: number;
          confidence?: number;
          status?: 'new' | 'contacted' | 'qualified' | 'won';
          channel?: 'email' | 'whatsapp' | 'sms';
          date_created?: string;
          summary?: string;
        };
      };
    };
  };
}
