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
  setWorkspaceData: (workspaceId: string) => void;
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
    score: 94,
    scoreBreakdown: { intent: 95, urgency: 100, budget: 90, engagement: 90, recency: 98, sentiment: 72 },
    recommendation: 'Extremely high intent. Attempting to purchase enterprise tier. Follow up immediately to resolve checkout issue.',
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
    score: 78,
    scoreBreakdown: { intent: 80, urgency: 60, budget: 85, engagement: 85, recency: 82, sentiment: 80 },
    recommendation: 'High budget potential. Asking about large seat count. Needs pricing details to convert.',
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
    score: 71,
    scoreBreakdown: { intent: 70, urgency: 50, budget: 90, engagement: 75, recency: 58, sentiment: 65 },
    recommendation: 'Enterprise feature requirements (compliance). Route to AE for custom SLA discussion.',
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
    score: 88,
    scoreBreakdown: { intent: 85, urgency: 80, budget: 90, engagement: 95, recency: 74, sentiment: 88 },
    recommendation: 'Strong intent for bulk order (50). Provide bulk discount code and catalog immediately.',
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
    score: 65,
    scoreBreakdown: { intent: 80, urgency: 60, budget: 40, engagement: 80, recency: 52, sentiment: 60 },
    recommendation: 'Conditional intent based on integration requirements. Send Salesforce integration docs to qualify further.',
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

  setWorkspaceData: (workspaceId) => set(() => {
    const now = Date.now();
    
    // --- Spice Garden: Restaurant conversations ---
    const spiceGardenConversations: Conversation[] = [
      {
        id: 'sg-1', contactName: 'Raj Patel', contactEmail: 'raj@gmail.com',
        lastMessage: 'Can we book a table for 6 at 8 PM this Friday? It\'s a birthday dinner.',
        lastMessageTime: new Date(now - 5 * 60000).toISOString(), status: 'open', channel: 'whatsapp', sentiment: 'positive', urgencyScore: 65,
        summary: 'Table reservation for 6 — birthday dinner Friday 8 PM.',
        aiDraft: 'Hi Raj! We\'d love to host your birthday dinner. Table for 6 at 8 PM this Friday is confirmed. Shall I arrange a complimentary dessert?',
        messages: [{ id: 'sg-m1', conversationId: 'sg-1', sender: 'user', content: 'Can we book a table for 6 at 8 PM this Friday? It\'s a birthday dinner.', timestamp: new Date(now - 5 * 60000).toISOString(), channel: 'whatsapp', sentiment: 'positive' }]
      },
      {
        id: 'sg-2', contactName: 'Priya Sharma', contactEmail: 'priya@sharma.com',
        lastMessage: 'Do you offer vegan catering for corporate events? We need options for 50 people.',
        lastMessageTime: new Date(now - 20 * 60000).toISOString(), status: 'open', channel: 'email', sentiment: 'neutral', urgencyScore: 70,
        summary: 'Vegan catering inquiry — 50 people corporate event.',
        aiDraft: 'Hi Priya, absolutely! Our vegan catering menu is very popular for corporate events. I\'ll send you our full menu with pricing for 50 guests.',
        messages: [{ id: 'sg-m2', conversationId: 'sg-2', sender: 'user', content: 'Do you offer vegan catering for corporate events? We need options for 50 people.', timestamp: new Date(now - 20 * 60000).toISOString(), channel: 'email', sentiment: 'neutral' }]
      },
      {
        id: 'sg-3', contactName: 'David Kim', contactEmail: 'david@foodie.com',
        lastMessage: 'The biryani was absolutely incredible! How do I order for delivery?',
        lastMessageTime: new Date(now - 60 * 60000).toISOString(), status: 'open', channel: 'whatsapp', sentiment: 'positive', urgencyScore: 30,
        summary: 'Positive review + delivery order inquiry.',
        messages: [{ id: 'sg-m3', conversationId: 'sg-3', sender: 'user', content: 'The biryani was absolutely incredible! How do I order for delivery?', timestamp: new Date(now - 60 * 60000).toISOString(), channel: 'whatsapp', sentiment: 'positive' }]
      },
      {
        id: 'sg-4', contactName: 'Elena Rostova', contactEmail: 'elena@example.com',
        lastMessage: 'I found a hair in my food last visit. Very disappointed. I want a refund.',
        lastMessageTime: new Date(now - 90 * 60000).toISOString(), status: 'open', channel: 'sms', sentiment: 'negative', urgencyScore: 88,
        summary: 'Complaint — hygiene issue, requesting refund.',
        aiDraft: 'Hi Elena, I\'m deeply sorry about your experience. This is completely unacceptable. I\'d like to offer you a full refund and a complimentary meal on your next visit.',
        messages: [{ id: 'sg-m4', conversationId: 'sg-4', sender: 'user', content: 'I found a hair in my food last visit. Very disappointed. I want a refund.', timestamp: new Date(now - 90 * 60000).toISOString(), channel: 'sms', sentiment: 'negative' }]
      },
      {
        id: 'sg-5', contactName: 'Carlos Mendez', contactEmail: 'carlos@events.com',
        lastMessage: 'Thanks for the amazing wedding catering! Everyone loved the tikka masala.',
        lastMessageTime: new Date(now - 180 * 60000).toISOString(), status: 'resolved', channel: 'email', sentiment: 'positive', urgencyScore: 10,
        summary: 'Positive feedback on wedding catering.',
        messages: [{ id: 'sg-m5', conversationId: 'sg-5', sender: 'user', content: 'Thanks for the amazing wedding catering! Everyone loved the tikka masala.', timestamp: new Date(now - 180 * 60000).toISOString(), channel: 'email', sentiment: 'positive' }]
      }
    ];

    // --- TechFlow Solutions: SaaS/Software conversations ---
    const techFlowConversations: Conversation[] = [
      {
        id: 'tf-1', contactName: 'James Wilson', contactEmail: 'james@startup.io',
        lastMessage: 'The API keeps returning 429 errors. We\'re way under our rate limit. This is blocking production.',
        lastMessageTime: new Date(now - 3 * 60000).toISOString(), status: 'open', channel: 'email', sentiment: 'urgent', urgencyScore: 95,
        summary: 'Production-blocking API 429 errors despite being under rate limit.',
        aiDraft: 'Hi James, I\'m escalating this immediately to our infrastructure team. Can you share your API key prefix so we can check your rate limit bucket?',
        messages: [{ id: 'tf-m1', conversationId: 'tf-1', sender: 'user', content: 'The API keeps returning 429 errors. We\'re way under our rate limit. This is blocking production.', timestamp: new Date(now - 3 * 60000).toISOString(), channel: 'email', sentiment: 'urgent' }]
      },
      {
        id: 'tf-2', contactName: 'Aisha Khan', contactEmail: 'aisha@enterprise.co',
        lastMessage: 'We need SSO and SAML support before we can proceed. Is this on your roadmap?',
        lastMessageTime: new Date(now - 25 * 60000).toISOString(), status: 'open', channel: 'email', sentiment: 'neutral', urgencyScore: 75,
        summary: 'Enterprise SSO/SAML requirement — deal blocker.',
        aiDraft: 'Hi Aisha, great news — SSO with SAML 2.0 is available on our Enterprise plan and ships next quarter on Growth. Want me to connect you with our solutions architect?',
        messages: [{ id: 'tf-m2', conversationId: 'tf-2', sender: 'user', content: 'We need SSO and SAML support before we can proceed. Is this on your roadmap?', timestamp: new Date(now - 25 * 60000).toISOString(), channel: 'email', sentiment: 'neutral' }]
      },
      {
        id: 'tf-3', contactName: 'Marco Rossi', contactEmail: 'marco@devstudio.com',
        lastMessage: 'Can we get 15 more seats added to our plan? The team is growing fast.',
        lastMessageTime: new Date(now - 45 * 60000).toISOString(), status: 'open', channel: 'instagram', sentiment: 'positive', urgencyScore: 50,
        summary: 'Wants to add 15 more seats to their current plan.',
        messages: [{ id: 'tf-m3', conversationId: 'tf-3', sender: 'user', content: 'Can we get 15 more seats added to our plan? The team is growing fast.', timestamp: new Date(now - 45 * 60000).toISOString(), channel: 'instagram', sentiment: 'positive' }]
      },
      {
        id: 'tf-4', contactName: 'Amanda Cole', contactEmail: 'amanda@analytics.io',
        lastMessage: 'The webhook integration docs are outdated. Steps 3 and 5 reference endpoints that no longer exist.',
        lastMessageTime: new Date(now - 120 * 60000).toISOString(), status: 'open', channel: 'email', sentiment: 'negative', urgencyScore: 60,
        summary: 'Documentation outdated — webhook endpoints missing.',
        aiDraft: 'Hi Amanda, thank you for flagging this. I\'ve notified our docs team and they\'ll have the webhook guide updated within 24 hours. In the meantime, here are the correct endpoints...',
        messages: [{ id: 'tf-m4', conversationId: 'tf-4', sender: 'user', content: 'The webhook integration docs are outdated. Steps 3 and 5 reference endpoints that no longer exist.', timestamp: new Date(now - 120 * 60000).toISOString(), channel: 'email', sentiment: 'negative' }]
      },
      {
        id: 'tf-5', contactName: 'Lucas Gray', contactEmail: 'lucas@gray.dev',
        lastMessage: 'Just deployed using your SDK — incredibly smooth. Love the DX!',
        lastMessageTime: new Date(now - 200 * 60000).toISOString(), status: 'resolved', channel: 'whatsapp', sentiment: 'positive', urgencyScore: 5,
        summary: 'Positive SDK feedback from developer.',
        messages: [{ id: 'tf-m5', conversationId: 'tf-5', sender: 'user', content: 'Just deployed using your SDK — incredibly smooth. Love the DX!', timestamp: new Date(now - 200 * 60000).toISOString(), channel: 'whatsapp', sentiment: 'positive' }]
      }
    ];

    // --- Bloom Boutique: Fashion/Retail conversations ---
    const bloomConversations: Conversation[] = [
      {
        id: 'bb-1', contactName: 'Sophie Laurent', contactEmail: 'sophie@fashionista.com',
        lastMessage: 'Is the summer floral dress available in size M? The website says out of stock but I need it for Saturday!',
        lastMessageTime: new Date(now - 8 * 60000).toISOString(), status: 'open', channel: 'whatsapp', sentiment: 'urgent', urgencyScore: 80,
        summary: 'Urgent stock check — summer floral dress size M needed by Saturday.',
        aiDraft: 'Hi Sophie! Let me check our warehouse stock for you right away. We sometimes have pieces that haven\'t been listed online yet. I\'ll get back to you within the hour!',
        messages: [{ id: 'bb-m1', conversationId: 'bb-1', sender: 'user', content: 'Is the summer floral dress available in size M? The website says out of stock but I need it for Saturday!', timestamp: new Date(now - 8 * 60000).toISOString(), channel: 'whatsapp', sentiment: 'urgent' }]
      },
      {
        id: 'bb-2', contactName: 'Emma Thompson', contactEmail: 'emma@style.co',
        lastMessage: 'I need to return my order — the color looks completely different from the photos. Very misleading.',
        lastMessageTime: new Date(now - 30 * 60000).toISOString(), status: 'open', channel: 'email', sentiment: 'negative', urgencyScore: 75,
        summary: 'Return request — color mismatch from product photos.',
        aiDraft: 'Hi Emma, I\'m sorry the color didn\'t match your expectations. I\'ve initiated a free return label for you. Would you prefer a full refund or an exchange for a different shade?',
        messages: [{ id: 'bb-m2', conversationId: 'bb-2', sender: 'user', content: 'I need to return my order — the color looks completely different from the photos. Very misleading.', timestamp: new Date(now - 30 * 60000).toISOString(), channel: 'email', sentiment: 'negative' }]
      },
      {
        id: 'bb-3', contactName: 'Michael Chen', contactEmail: 'michael@gifts.net',
        lastMessage: 'I want to buy a gift card for my girlfriend. Do you have physical ones or only digital?',
        lastMessageTime: new Date(now - 55 * 60000).toISOString(), status: 'open', channel: 'sms', sentiment: 'neutral', urgencyScore: 40,
        summary: 'Gift card inquiry — physical vs digital options.',
        messages: [{ id: 'bb-m3', conversationId: 'bb-3', sender: 'user', content: 'I want to buy a gift card for my girlfriend. Do you have physical ones or only digital?', timestamp: new Date(now - 55 * 60000).toISOString(), channel: 'sms', sentiment: 'neutral' }]
      },
      {
        id: 'bb-4', contactName: 'Isabella Rossi', contactEmail: 'bella@influencer.com',
        lastMessage: 'I\'d love to collab! I have 50K followers on IG. Do you have an influencer program?',
        lastMessageTime: new Date(now - 100 * 60000).toISOString(), status: 'open', channel: 'instagram', sentiment: 'positive', urgencyScore: 55,
        summary: 'Influencer collaboration proposal — 50K IG followers.',
        aiDraft: 'Hi Isabella! We\'d love to explore a collaboration. I\'ll send you our influencer partnership kit with all the details. What\'s your Instagram handle?',
        messages: [{ id: 'bb-m4', conversationId: 'bb-4', sender: 'user', content: 'I\'d love to collab! I have 50K followers on IG. Do you have an influencer program?', timestamp: new Date(now - 100 * 60000).toISOString(), channel: 'instagram', sentiment: 'positive' }]
      },
      {
        id: 'bb-5', contactName: 'Olivia Park', contactEmail: 'olivia@park.com',
        lastMessage: 'Just received my order. The packaging is gorgeous and the dress fits perfectly! 💖',
        lastMessageTime: new Date(now - 240 * 60000).toISOString(), status: 'resolved', channel: 'instagram', sentiment: 'positive', urgencyScore: 5,
        summary: 'Customer received order and loves the packaging and fit.',
        messages: [{ id: 'bb-m5', conversationId: 'bb-5', sender: 'user', content: 'Just received my order. The packaging is gorgeous and the dress fits perfectly! 💖', timestamp: new Date(now - 240 * 60000).toISOString(), channel: 'instagram', sentiment: 'positive' }]
      }
    ];

    const conversationMap: Record<string, Conversation[]> = {
      'ws-1': spiceGardenConversations,
      'ws-2': techFlowConversations,
      'ws-3': bloomConversations,
    };

    return { 
      conversations: conversationMap[workspaceId] || initialConversations, 
      activeConversationId: null 
    };
  }),
}));
