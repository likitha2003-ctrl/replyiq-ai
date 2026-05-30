import { create } from 'zustand';
import { FollowUp } from '../types';

interface FollowUpState {
  followUps: FollowUp[];
  addFollowUp: (f: FollowUp) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
}

const today = new Date();

const t1 = new Date(today);
t1.setHours(t1.getHours() + 2);

const t2 = new Date(today);
t2.setHours(t2.getHours() + 1);

const t3 = new Date(today);
t3.setDate(t3.getDate() + 1);
t3.setHours(9, 0, 0, 0);

const initialFollowUps: FollowUp[] = [
  {
    id: 'f1',
    contactName: 'Marco Rossi',
    channel: 'WhatsApp',
    triggerType: 'no_reply',
    scheduledAt: t1.toISOString(),
    status: 'pending',
    aiMessage: "Hi Marco! Just following up on your question about the 25-agent plan. I have put together a custom proposal for DesignCo IT — would love to walk you through it. Are you free for a 15-minute call this week?",
    createdAt: new Date().toISOString()
  },
  {
    id: 'f2',
    contactName: 'Amanda Cole',
    channel: 'Email',
    triggerType: 'lead_inactive',
    scheduledAt: t2.toISOString(),
    status: 'pending',
    aiMessage: "Hi Amanda, I wanted to circle back on your Salesforce integration question. Our team has confirmed full bi-directional sync is available on the Pro plan. Can I send over the technical spec sheet?",
    createdAt: new Date().toISOString()
  },
  {
    id: 'f3',
    contactName: 'Priya Sharma',
    channel: 'WhatsApp',
    triggerType: 'post_demo',
    scheduledAt: t3.toISOString(),
    status: 'pending',
    aiMessage: "Hi Priya! It was great speaking with you about the compliance features. As promised, here is the SOC2 documentation link. Let me know if your team has any questions!",
    createdAt: new Date().toISOString()
  }
];

export const useFollowUpStore = create<FollowUpState>((set) => ({
  followUps: initialFollowUps,
  addFollowUp: (f) =>
    set((state) => ({ followUps: [...state.followUps, f] })),
  updateFollowUp: (id, updates) =>
    set((state) => ({
      followUps: state.followUps.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),
}));
