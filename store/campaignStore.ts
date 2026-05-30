import { create } from 'zustand';

export type CampaignStatus = 'active' | 'scheduled' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  channel: string;
  audience: string;
  audienceSize: number;
  sent: number;
  delivered: number;
  replied: number;
  dateSent: string;
  openRate?: number;
  replyRate?: number;
}

interface CampaignState {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
}

const initialCampaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Q3 Enterprise Promotion',
    status: 'completed',
    channel: 'WhatsApp',
    audience: 'Hot Leads',
    audienceSize: 125,
    sent: 125,
    delivered: 120,
    replied: 45,
    dateSent: '2026-05-20T10:00:00Z',
    openRate: 96,
    replyRate: 36
  },
  {
    id: 'c2',
    name: 'Churn Risk Re-engagement',
    status: 'completed',
    channel: 'WhatsApp',
    audience: 'At-risk',
    audienceSize: 42,
    sent: 42,
    delivered: 40,
    replied: 12,
    dateSent: '2026-05-25T14:30:00Z',
    openRate: 95,
    replyRate: 28
  },
  {
    id: 'c3',
    name: 'Feature Announcement',
    status: 'active',
    channel: 'WhatsApp',
    audience: 'All Contacts',
    audienceSize: 1200,
    sent: 850,
    delivered: 840,
    replied: 120,
    dateSent: new Date(Date.now() - 3600000).toISOString(),
    openRate: 85,
    replyRate: 14
  }
];

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: initialCampaigns,
  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [campaign, ...state.campaigns] })),
}));
