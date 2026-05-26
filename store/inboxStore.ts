import { create } from 'zustand';
import { Conversation, Message, Lead, ConversationStatus, Channel, Sentiment } from '../types';

interface InboxState {
  conversations: Conversation[];
  activeConversationId: string | null;
  searchFilter: string;
  statusFilter: 'all' | ConversationStatus;
  channelFilter: 'all' | Channel;
  sentimentFilter: 'all' | Sentiment;
  leads: Lead[];
  activeLeadId: string | null;
  
  // Actions
  setSearchFilter: (filter: string) => void;
  setStatusFilter: (filter: 'all' | ConversationStatus) => void;
  setChannelFilter: (filter: 'all' | Channel) => void;
  setSentimentFilter: (filter: 'all' | Sentiment) => void;
  setActiveConversationId: (id: string | null) => void;
  addConversation: (conv: Conversation) => void;
  addMessageToConversation: (convId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateConversationStatus: (convId: string, status: ConversationStatus) => void;
  updateConversationAIDraft: (convId: string, draft: string) => void;
  
  // Lead Actions
  addLead: (lead: Lead) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  setActiveLeadId: (id: string | null) => void;
}

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    contactName: 'Sarah Jenkins',
    contactEmail: 'sjenkins@enterprise.com',
    lastMessage: "I'm trying to purchase the enterprise license but checkout keeps throwing a 500 error. Quarter end closes today, please help!",
    lastMessageTime: new Date(Date.now() - 5 * 60000).toISOString(),
    status: 'open',
    channel: 'email',
    sentiment: 'urgent',
    urgencyScore: 92,
    summary: 'Checkout 500 error on enterprise license. Quarter end today.',
    aiDraft: 'Hi Sarah, I apologize for the checkout error. I am looking into this immediately and can manually process your enterprise license to ensure it gets done before quarter close.',
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        sender: 'user',
        content: "I'm trying to purchase the enterprise license but checkout keeps throwing a 500 error. Quarter end closes today, please help!",
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        channel: 'email',
        sentiment: 'urgent'
      }
    ]
  },
  {
    id: 'conv-2',
    contactName: 'Marco Rossi',
    contactEmail: 'marco@rossi.com',
    lastMessage: "Hi, I saw your product on ProductHunt. Does it support 25+ agent seats?",
    lastMessageTime: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'open',
    channel: 'whatsapp',
    sentiment: 'positive',
    urgencyScore: 40,
    summary: 'Inquiry from ProductHunt regarding 25+ agent seats.',
    aiDraft: 'Hi Marco, yes! We fully support teams of 25+ agents. Let me send you our pricing breakdown.',
    messages: [
      {
        id: 'msg-2',
        conversationId: 'conv-2',
        sender: 'user',
        content: "Hi, I saw your product on ProductHunt. Does it support 25+ agent seats?",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        channel: 'whatsapp',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'conv-3',
    contactName: 'Elena Rostova',
    contactEmail: 'elena@example.com',
    lastMessage: "Why haven't I received my refund yet? It's been 4 business days.",
    lastMessageTime: new Date(Date.now() - 45 * 60000).toISOString(),
    status: 'open',
    channel: 'sms',
    sentiment: 'negative',
    urgencyScore: 85,
    summary: 'Refund missing after 4 business days.',
    aiDraft: 'Hi Elena, I am so sorry for the delay. Refunds typically take 5-10 business days to reflect in your account. Let me double-check the transaction ID for you.',
    messages: [
      {
        id: 'msg-3',
        conversationId: 'conv-3',
        sender: 'user',
        content: "Why haven't I received my refund yet? It's been 4 business days.",
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        channel: 'sms',
        sentiment: 'negative'
      }
    ]
  },
  {
    id: 'conv-4',
    contactName: 'David Kim',
    contactEmail: 'david@cloudlabs.io',
    lastMessage: "The webhooks work exactly as documented. Really impressed with the API.",
    lastMessageTime: new Date(Date.now() - 120 * 60000).toISOString(),
    status: 'resolved',
    channel: 'email',
    sentiment: 'positive',
    urgencyScore: 10,
    summary: 'Feedback: webhooks work well.',
    messages: [
      {
        id: 'msg-4',
        conversationId: 'conv-4',
        sender: 'user',
        content: "The webhooks work exactly as documented. Really impressed with the API.",
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        channel: 'email',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'conv-5',
    contactName: 'Priya Sharma',
    contactEmail: 'priya@finance.in',
    lastMessage: "Can I get a custom plan for my fintech startup? We need compliance features.",
    lastMessageTime: new Date(Date.now() - 180 * 60000).toISOString(),
    status: 'open',
    channel: 'whatsapp',
    sentiment: 'neutral',
    urgencyScore: 50,
    summary: 'Wants custom plan with compliance features.',
    aiDraft: 'Hi Priya, absolutely. We offer custom SLA and compliance features on our Enterprise plan. Let me connect you with an account executive.',
    messages: [
      {
        id: 'msg-5',
        conversationId: 'conv-5',
        sender: 'user',
        content: "Can I get a custom plan for my fintech startup? We need compliance features.",
        timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
        channel: 'whatsapp',
        sentiment: 'neutral'
      }
    ]
  },
  {
    id: 'conv-6',
    contactName: 'Lucas Schmidt',
    contactEmail: 'lucas@team.de',
    lastMessage: "How much for a custom order? I want something personalized for my team of 50.",
    lastMessageTime: new Date(Date.now() - 240 * 60000).toISOString(),
    status: 'open',
    channel: 'sms',
    sentiment: 'positive',
    urgencyScore: 60,
    summary: 'Asking for pricing on a custom order for a team of 50.',
    aiDraft: 'Hi Lucas, I would love to help you with a custom order. For 50 personalized units, we offer a 15% bulk discount. Can I send you the catalog?',
    messages: [
      {
        id: 'msg-6',
        conversationId: 'conv-6',
        sender: 'user',
        content: "How much for a custom order? I want something personalized for my team of 50.",
        timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
        channel: 'sms',
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'conv-7',
    contactName: 'Amanda Cole',
    contactEmail: 'amanda@agency.co',
    lastMessage: "Does your platform integrate with Salesforce? That's a dealbreaker for us.",
    lastMessageTime: new Date(Date.now() - 300 * 60000).toISOString(),
    status: 'open',
    channel: 'email',
    sentiment: 'neutral',
    urgencyScore: 70,
    summary: 'Asking about Salesforce integration. Dealbreaker.',
    aiDraft: 'Hi Amanda, yes! We have a native 2-way Salesforce integration. I can send you the documentation.',
    messages: [
      {
        id: 'msg-7',
        conversationId: 'conv-7',
        sender: 'user',
        content: "Does your platform integrate with Salesforce? That's a dealbreaker for us.",
        timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
        channel: 'email',
        sentiment: 'neutral'
      }
    ]
  },
  {
    id: 'conv-8',
    contactName: 'Raj Patel',
    contactEmail: 'raj@design.io',
    lastMessage: "OMG love your designs! Are these available in store or only online?",
    lastMessageTime: new Date(Date.now() - 360 * 60000).toISOString(),
    status: 'open',
    channel: 'instagram',
    sentiment: 'positive',
    urgencyScore: 20,
    summary: 'Loves designs, asking if available in store.',
    aiDraft: 'Hi Raj! Thank you! Currently we only sell online, but we offer free 2-day shipping.',
    messages: [
      {
        id: 'msg-8',
        conversationId: 'conv-8',
        sender: 'user',
        content: "OMG love your designs! Are these available in store or only online?",
        timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
        channel: 'instagram',
        sentiment: 'positive'
      }
    ]
  }
];

const initialLeads: Lead[] = [
  {
    id: 'lead-1',
    conversationId: 'conv-1',
    contactName: 'Sarah Jenkins',
    contactEmail: 'sjenkins@enterprise.com',
    companyName: 'Enterprise',
    dealValue: 5000,
    confidence: 90,
    priority: 'hot',
    status: 'new',
    channel: 'email',
    dateCreated: new Date(Date.now() - 5 * 60000).toISOString(),
    summary: 'Hot lead trying to checkout for enterprise license.',
  },
  {
    id: 'lead-2',
    conversationId: 'conv-2',
    contactName: 'Marco Rossi',
    contactEmail: 'marco@rossi.com',
    companyName: 'Rossi Co',
    dealValue: 1800,
    confidence: 75,
    priority: 'warm',
    status: 'contacted',
    channel: 'whatsapp',
    dateCreated: new Date(Date.now() - 15 * 60000).toISOString(),
    summary: 'Interested in 25+ agent seats.',
  },
  {
    id: 'lead-3',
    conversationId: 'conv-5',
    contactName: 'Priya Sharma',
    contactEmail: 'priya@finance.in',
    companyName: 'Fintech Startup',
    dealValue: 3500,
    confidence: 60,
    priority: 'warm',
    status: 'qualified',
    channel: 'whatsapp',
    dateCreated: new Date(Date.now() - 180 * 60000).toISOString(),
    summary: 'Needs custom compliance features.',
  },
  {
    id: 'lead-4',
    conversationId: 'conv-6',
    contactName: 'Lucas Schmidt',
    contactEmail: 'lucas@team.de',
    companyName: 'Personalized Orders Inc',
    dealValue: 2000,
    confidence: 85,
    priority: 'hot',
    status: 'new',
    channel: 'sms',
    dateCreated: new Date(Date.now() - 240 * 60000).toISOString(),
    summary: 'Custom order for team of 50.',
  },
  {
    id: 'lead-5',
    conversationId: 'conv-7',
    contactName: 'Amanda Cole',
    contactEmail: 'amanda@agency.co',
    companyName: 'Cole Agency',
    dealValue: 4000,
    confidence: 70,
    priority: 'warm',
    status: 'qualified',
    channel: 'email',
    dateCreated: new Date(Date.now() - 300 * 60000).toISOString(),
    summary: 'Needs Salesforce integration.',
  }
];

export const useInboxStore = create<InboxState>((set) => ({
  conversations: initialConversations,
  activeConversationId: null,
  searchFilter: '',
  statusFilter: 'all',
  channelFilter: 'all',
  sentimentFilter: 'all',
  leads: initialLeads,
  activeLeadId: null,

  setSearchFilter: (searchFilter) => set({ searchFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setChannelFilter: (channelFilter) => set({ channelFilter }),
  setSentimentFilter: (sentimentFilter) => set({ sentimentFilter }),
  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
  
  addConversation: (conv) => set((state) => ({
    conversations: [conv, ...state.conversations]
  })),

  addMessageToConversation: (convId, msg) =>
    set((state) => {
      const timestamp = new Date().toISOString();
      const newMsg: Message = {
        ...msg,
        id: `msg-${Date.now()}`,
        conversationId: convId,
        timestamp,
      };

      const updatedConversations = state.conversations.map((c) => {
        if (c.id === convId) {
          const messages = [...c.messages, newMsg];
          return {
            ...c,
            lastMessage: newMsg.content,
            lastMessageTime: timestamp,
            messages,
            sentiment: msg.sentiment || c.sentiment,
          };
        }
        return c;
      });

      return { conversations: updatedConversations };
    }),

  updateConversationStatus: (convId, status) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === convId ? { ...c, status } : c
      ),
    })),

  updateConversationAIDraft: (convId, aiDraft) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === convId ? { ...c, aiDraft } : c
      ),
    })),

  addLead: (lead) =>
    set((state) => ({
      leads: [lead, ...state.leads],
    })),

  updateLeadStatus: (leadId, status) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === leadId ? { ...l, status } : l
      ),
    })),

  updateLead: (leadId, updates) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === leadId ? { ...l, ...updates } : l
      ),
    })),

  setActiveLeadId: (activeLeadId) => set({ activeLeadId }),
}));
