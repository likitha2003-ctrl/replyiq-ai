'use client';

import React, { useState } from 'react';
import { CheckSquare, Calendar, CheckCircle2, Clock, AlertTriangle, Play, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromiseStore } from '../../../store/promiseStore';
import { useConversations } from '../../../lib/hooks/useConversations';
import { format } from 'date-fns';
import { PromiseTracker } from '../../../types';

type FilterType = 'All' | 'Overdue' | 'Today' | 'Upcoming' | 'Resolved';

export default function PromisesPage() {
  const { promises, resolvePromise, addPromises } = usePromiseStore();
  const { conversations } = useConversations();
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string>('');
  
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const filteredPromises = promises.filter((p) => {
    const due = new Date(p.dueDate);
    due.setHours(0,0,0,0);
    
    if (activeFilter === 'Resolved') return p.status === 'resolved';
    if (p.status === 'resolved') return false;
    
    if (activeFilter === 'Overdue') return due < today;
    if (activeFilter === 'Today') return due.getTime() === today.getTime();
    if (activeFilter === 'Upcoming') return due > today;
    
    return true; // All
  });

  const getStatusChip = (p: PromiseTracker) => {
    if (p.status === 'resolved') {
      return <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400">Resolved</span>;
    }
    const due = new Date(p.dueDate);
    due.setHours(0,0,0,0);
    if (due < today) {
      return <span className="px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400 flex items-center gap-1"><AlertTriangle size={12}/> Overdue</span>;
    }
    if (due.getTime() === today.getTime()) {
      return <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-500/20 text-amber-400">Due Today</span>;
    }
    return <span className="px-2 py-1 rounded text-xs font-semibold bg-zinc-500/20 text-zinc-300">Upcoming</span>;
  };

  const handleExtract = async () => {
    if (!selectedConvId) return;
    setIsExtracting(true);
    
    const conv = conversations.find(c => c.id === selectedConvId);
    if (!conv) {
      setIsExtracting(false);
      return;
    }

    try {
      const res = await fetch('/api/ai/extract-promises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          conversationHistory: conv.messages,
          conversationId: conv.id 
        })
      });
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const newPromises: PromiseTracker[] = data.map(d => ({
          id: `prom-${Date.now()}-${Math.random()}`,
          conversationId: conv.id,
          promiseText: d.promiseText,
          promisedTo: d.promisedTo,
          dueDate: d.dueDate,
          status: 'pending',
          detectedAt: new Date().toISOString()
        }));
        addPromises(newPromises);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
      setSelectedConvId('');
    }
  };

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <CheckSquare className="text-violet-500" size={32} />
            AI Promises Tracker
          </h1>
          <p className="text-zinc-400">Automatically track and fulfill commitments made to customers.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
          <select 
            className="bg-zinc-950 border border-white/10 text-zinc-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
            value={selectedConvId}
            onChange={(e) => setSelectedConvId(e.target.value)}
          >
            <option value="">Select a conversation...</option>
            {conversations.map(c => (
              <option key={c.id} value={c.id}>{c.contactName} - {c.channel}</option>
            ))}
          </select>
          <button 
            onClick={handleExtract}
            disabled={!selectedConvId || isExtracting}
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExtracting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Extract Promises
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'Overdue', 'Today', 'Upcoming', 'Resolved'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as FilterType)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeFilter === filter 
                ? 'bg-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]' 
                : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-white/5 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                <th className="px-6 py-4 whitespace-nowrap">Contact</th>
                <th className="px-6 py-4">Promise</th>
                <th className="px-6 py-4 whitespace-nowrap">Due Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredPromises.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      No promises found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredPromises.map((p) => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-300">
                        {p.promisedTo}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-200 min-w-[300px]">
                        {p.promiseText}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 flex items-center gap-2">
                        <Calendar size={14} className="text-zinc-500" />
                        {format(new Date(p.dueDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusChip(p)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {p.status === 'pending' ? (
                          <button
                            onClick={() => resolvePromise(p.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                            title="Mark as Resolved"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        ) : (
                          <span className="text-zinc-500 text-sm">Resolved</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
