import { create } from 'zustand';
import { Appointment } from '../types';
import { addDays, setHours, subDays } from 'date-fns';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (app: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
}

const today = new Date();

const initialAppointments: Appointment[] = [
  {
    id: 'app-1',
    contactName: 'James Wilson',
    contactChannel: 'whatsapp',
    scheduledAt: setHours(addDays(today, 1), 15).toISOString(),
    durationMinutes: 30,
    meetingType: 'Product Demo',
    status: 'pending',
    aiDetected: true,
    notes: 'James asked to book at 3 PM tomorrow. Extracted from conversation.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'app-2',
    contactName: 'Sarah Jenkins',
    contactChannel: 'email',
    scheduledAt: setHours(addDays(today, 2), 10).toISOString(),
    durationMinutes: 45,
    meetingType: 'Onboarding',
    status: 'confirmed',
    aiDetected: true,
    createdAt: subDays(today, 1).toISOString()
  },
  {
    id: 'app-3',
    contactName: 'Marco Rossi',
    contactChannel: 'sms',
    scheduledAt: setHours(today, 14).toISOString(),
    durationMinutes: 30,
    meetingType: 'Follow-up Call',
    status: 'confirmed',
    aiDetected: false,
    createdAt: subDays(today, 2).toISOString()
  },
  {
    id: 'app-4',
    contactName: 'Amanda Cole',
    contactChannel: 'instagram',
    scheduledAt: setHours(addDays(today, 5), 11).toISOString(),
    durationMinutes: 15,
    meetingType: 'Technical Support',
    status: 'cancelled',
    aiDetected: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'app-5',
    contactName: 'Priya Sharma',
    contactChannel: 'whatsapp',
    scheduledAt: setHours(subDays(today, 1), 16).toISOString(),
    durationMinutes: 60,
    meetingType: 'Product Demo',
    status: 'completed',
    aiDetected: true,
    createdAt: subDays(today, 5).toISOString()
  }
];

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: initialAppointments,
  addAppointment: (app) =>
    set((state) => ({ appointments: [...state.appointments, app] })),
  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
}));
