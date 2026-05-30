'use client';

import React, { useState } from 'react';
import { CalendarClock, Sparkles, Clock, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppointmentStore } from '../../store/appointmentStore';
import { Conversation } from '../../types';
import { useToast } from '../shared/ToastProvider';

interface AppointmentPanelProps {
  conversation: Conversation;
}

export default function AppointmentPanel({ conversation }: AppointmentPanelProps) {
  const { appointments, addAppointment } = useAppointmentStore();
  const { toast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [meetingType, setMeetingType] = useState('demo');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(30);

  const contactName = conversation.contactName;

  // Find upcoming appointment for this contact
  const upcomingApp = appointments.find(a => 
    a.contactName === contactName && 
    a.status === 'confirmed' && 
    new Date(a.scheduledAt).getTime() > new Date().getTime()
  );

  // Check if AI detects intent from the last customer message
  const lastMsg = conversation.messages[conversation.messages.length - 1];
  const lastCustomerMsg = [...conversation.messages].reverse().find(m => m.sender === 'user');
  
  const text = lastCustomerMsg?.content.toLowerCase() || '';
  const aiDetectedIntent = text.includes('schedule') || text.includes('meet') || text.includes('call') || text.includes('demo') || text.includes('time');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    
    addAppointment({
      id: `app-${Date.now()}`,
      contactName,
      contactChannel: conversation.channel,
      scheduledAt,
      durationMinutes: duration,
      meetingType,
      status: 'confirmed',
      aiDetected: aiDetectedIntent,
      createdAt: new Date().toISOString()
    });

    toast({
      type: 'system',
      title: 'Appointment Booked ✓',
      description: `Meeting scheduled with ${contactName}.`,
    });

    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Mini Section */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <CalendarIcon size={14} className="text-blue-400" /> Appointments
          </div>
        </div>

        {upcomingApp ? (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Clock size={10} /> Upcoming
              </span>
              <span className="text-[10px] text-zinc-400">{upcomingApp.durationMinutes}m</span>
            </div>
            <div className="text-sm font-semibold text-white truncate">{upcomingApp.meetingType}</div>
            <div className="text-xs text-zinc-300">
              {new Date(upcomingApp.scheduledAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded-lg border-dashed text-center gap-2">
            <span className="text-[10px] text-zinc-500">No upcoming meetings</span>
            <button 
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 transition-colors"
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>

      {/* Floating AI Suggestion */}
      <AnimatePresence>
        {aiDetectedIntent && !upcomingApp && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-zinc-500/20 to-blue-500/10 border border-zinc-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-zinc-500/20 to-transparent pointer-events-none" />
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <Sparkles size={12} /> AI Detected Request
            </div>
            <p className="text-xs text-white mb-3">
              <span className="font-semibold">{contactName}</span> wants to schedule a meeting.
            </p>
            <button 
              onClick={() => setShowModal(true)}
              className="w-full py-1.5 rounded-lg bg-zinc-600 hover:bg-zinc-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg transition-colors"
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-2xl z-10">
              <div className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <CalendarClock size={16} className="text-blue-400" /> Book with {contactName}
              </div>
              <form onSubmit={handleBook} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Type</label>
                  <select value={meetingType} onChange={e => setMeetingType(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-white/10 bg-zinc-950/50 text-xs text-white">
                    <option value="demo">Product Demo</option>
                    <option value="follow_up">Follow-up Call</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Date</label>
                    <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-white/10 bg-zinc-950/50 text-xs text-white [color-scheme:dark]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Time</label>
                    <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-2 py-1.5 rounded-lg border border-white/10 bg-zinc-950/50 text-xs text-white [color-scheme:dark]" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg">Schedule</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
