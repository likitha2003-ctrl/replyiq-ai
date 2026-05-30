import { create } from 'zustand';
import { PromiseTracker } from '../types';

interface PromiseState {
  promises: PromiseTracker[];
  resolvePromise: (id: string) => void;
  addPromises: (newPromises: PromiseTracker[]) => void;
}

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const today = new Date();

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const initialPromises: PromiseTracker[] = [
  {
    id: 'prom-1',
    conversationId: 'conv-1',
    promiseText: 'Send security portal link to Sarah Jenkins',
    promisedTo: 'Sarah Jenkins',
    dueDate: yesterday.toISOString(),
    status: 'pending',
    detectedAt: yesterday.toISOString()
  },
  {
    id: 'prom-2',
    conversationId: 'conv-2',
    promiseText: 'Share enterprise pricing deck with Marco Rossi',
    promisedTo: 'Marco Rossi',
    dueDate: today.toISOString(),
    status: 'pending',
    detectedAt: today.toISOString()
  },
  {
    id: 'prom-3',
    conversationId: 'conv-7',
    promiseText: 'Schedule onboarding call with Amanda Cole',
    promisedTo: 'Amanda Cole',
    dueDate: tomorrow.toISOString(),
    status: 'pending',
    detectedAt: today.toISOString()
  }
];

export const usePromiseStore = create<PromiseState>((set) => ({
  promises: initialPromises,
  resolvePromise: (id) =>
    set((state) => ({
      promises: state.promises.map((p) =>
        p.id === id ? { ...p, status: 'resolved' } : p
      ),
    })),
  addPromises: (newPromises) =>
    set((state) => ({
      promises: [...newPromises, ...state.promises],
    })),
}));
