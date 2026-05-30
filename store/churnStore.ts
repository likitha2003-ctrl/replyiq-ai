import { create } from 'zustand';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface ChurnSignal {
  id: string;
  contactName: string;
  email: string;
  churnProbability: number;
  riskLevel: RiskLevel;
  signals: string[];
  suggestedAction: string;
  recoveryMessage: string;
  detectedAt: string;
  resolved: boolean;
}

interface ChurnState {
  churnSignals: ChurnSignal[];
  markAsResolved: (id: string) => void;
  updateRecoveryMessage: (id: string, message: string) => void;
}

const initialChurnSignals: ChurnSignal[] = [
  {
    id: 'churn-1',
    contactName: 'Elena Rostova',
    email: 'elena@example.com',
    churnProbability: 73,
    riskLevel: 'critical',
    signals: [
      '3 unresolved complaints in 7 days',
      'Sentiment declined from Neutral to Frustrated',
      'Mentioned competitor Freshdesk twice',
      'Response time from agent exceeded 4 hours'
    ],
    suggestedAction: 'Offer 20% retention discount immediately',
    recoveryMessage: 'Hi Elena, I wanted to personally reach out and apologize for the delays you have experienced. I have escalated your case and would like to offer you an exclusive loyalty discount as an appreciation for your patience. Can we schedule a quick call this week?',
    detectedAt: new Date().toISOString(),
    resolved: false
  },
  {
    id: 'churn-2',
    contactName: 'Carlos Mendez',
    email: 'carlos@startup.io',
    churnProbability: 45,
    riskLevel: 'high',
    signals: [
      '2 billing questions unanswered',
      'Reduced message frequency this week'
    ],
    suggestedAction: 'Send proactive check-in message',
    recoveryMessage: 'Hi Carlos, just checking in to make sure everything is going smoothly. Is there anything I can help clarify?',
    detectedAt: new Date(Date.now() - 3600000).toISOString(),
    resolved: false
  }
];

export const useChurnStore = create<ChurnState>((set) => ({
  churnSignals: initialChurnSignals,
  
  markAsResolved: (id) =>
    set((state) => ({
      churnSignals: state.churnSignals.map((signal) =>
        signal.id === id ? { ...signal, resolved: true } : signal
      ),
    })),

  updateRecoveryMessage: (id, message) =>
    set((state) => ({
      churnSignals: state.churnSignals.map((signal) =>
        signal.id === id ? { ...signal, recoveryMessage: message } : signal
      ),
    })),
}));
