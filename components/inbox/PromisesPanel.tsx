'use client';

import React, { useState } from 'react';
import { Clock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromiseStore } from '../../store/promiseStore';
import { format } from 'date-fns';

export default function PromisesPanel({ conversationId }: { conversationId: string }) {
  const { promises, resolvePromise } = usePromiseStore();
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  // Filter pending promises for the active conversation
  const activePromises = promises.filter(
    (p) => p.conversationId === conversationId && p.status === 'pending'
  );

  const handleResolve = (id: string) => {
    setResolvedIds(new Set(resolvedIds).add(id));
    setTimeout(() => {
      resolvePromise(id);
    }, 800);
  };

  const getDueDateChip = (dueDateStr: string) => {
    const due = new Date(dueDateStr);
    const now = new Date();
    
    // reset time to midnight for comparison
    due.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (due < today) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Overdue
        </span>
      );
    } else if (due.getTime() === today.getTime()) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
          Due Today
        </span>
      );
    } else {
      let label = format(due, 'MMM d');
      if (due.getTime() === tomorrow.getTime()) label = 'Tomorrow';
      
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-500/15 text-zinc-300 border border-zinc-500/20">
          {label}
        </span>
      );
    }
  };

  if (activePromises.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 shrink-0 mt-2 border border-white/5 bg-zinc-900/20 rounded-xl p-4 shadow-[inset_0_0_20px_rgba(255,255,255,0.01)] relative">
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-1">
        <div className="flex items-center gap-2 text-white">
          <Clock size={14} className="text-violet-400" />
          <h3 className="text-xs font-bold tracking-wide">Promises Tracker</h3>
        </div>
        <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold">
          {activePromises.length}
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {activePromises.map((p) => {
            const isResolving = resolvedIds.has(p.id);

            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isResolving ? 0.5 : 1, 
                  scale: isResolving ? 0.98 : 1,
                  backgroundColor: isResolving ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                className="flex items-start gap-3 group relative rounded-lg transition-colors p-1 -mx-1"
              >
                <button
                  onClick={() => handleResolve(p.id)}
                  disabled={isResolving}
                  className={`mt-0.5 shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                    isResolving 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : 'border-white/20 hover:border-violet-500 bg-white/5'
                  }`}
                >
                  <Check size={12} className={`text-white transition-opacity ${isResolving ? 'opacity-100' : 'opacity-0'}`} />
                </button>
                
                <div className="flex flex-col gap-1 min-w-0 flex-1 relative">
                  <p className={`text-[11px] leading-snug transition-colors ${isResolving ? 'text-zinc-500' : 'text-zinc-200'}`}>
                    {p.promiseText}
                    {isResolving && (
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.4 }}
                        className="absolute left-0 top-1/2 h-px bg-zinc-500"
                        style={{ marginTop: '-1px' }}
                      />
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-zinc-500 truncate">To: {p.promisedTo}</span>
                    {getDueDateChip(p.dueDate)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {Array.from(resolvedIds).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-500 text-zinc-950 px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Check size={16} />
              Promise marked as kept ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
