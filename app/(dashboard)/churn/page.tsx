'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Activity, Send, CheckCircle2, User2, MessageSquare, X, Smartphone } from 'lucide-react';
import { useChurnStore, ChurnSignal } from '../../../store/churnStore';
import { formatCurrency } from '../../../lib/utils';

function RecoveryModal({ 
  signal, 
  isOpen, 
  onClose,
  onSuccess 
}: { 
  signal: ChurnSignal | null, 
  isOpen: boolean, 
  onClose: () => void,
  onSuccess: (name: string) => void
}) {
  const [message, setMessage] = useState(signal?.recoveryMessage || '');
  const [tone, setTone] = useState<'empathetic' | 'professional'>('empathetic');
  const [isSending, setIsSending] = useState(false);
  const { updateRecoveryMessage, markAsResolved } = useChurnStore();

  React.useEffect(() => {
    if (signal) {
      setMessage(signal.recoveryMessage);
    }
  }, [signal]);

  if (!signal) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      updateRecoveryMessage(signal.id, message);
      markAsResolved(signal.id);
      setIsSending(false);
      onSuccess(signal.contactName);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-red-500/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Recovery Message</h3>
                  <p className="text-xs text-zinc-400">AI-drafted response for {signal.contactName}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tone</span>
                <div className="flex bg-zinc-950/50 rounded-lg p-1 border border-white/5">
                  <button
                    onClick={() => setTone('empathetic')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${tone === 'empathetic' ? 'bg-red-500/20 text-red-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Empathetic
                  </button>
                  <button
                    onClick={() => setTone('professional')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${tone === 'professional' ? 'bg-red-500/20 text-red-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Professional
                  </button>
                </div>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-40 bg-zinc-950/50 border border-white/10 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-red-500/50 resize-none transition-colors"
              />

              <button
                onClick={handleSend}
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold transition-all disabled:opacity-50"
              >
                {isSending ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <AlertTriangle size={18} />
                  </motion.div>
                ) : (
                  <>
                    <Smartphone size={18} />
                    Send via WhatsApp
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ChurnShieldPage() {
  const { churnSignals, markAsResolved } = useChurnStore();
  const [selectedSignal, setSelectedSignal] = useState<ChurnSignal | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeSignals = churnSignals.filter(s => !s.resolved);
  
  const avgProbability = activeSignals.length 
    ? Math.round(activeSignals.reduce((acc, curr) => acc + curr.churnProbability, 0) / activeSignals.length)
    : 0;

  const handleSuccess = (name: string) => {
    setToastMessage(`Recovery message sent to ${name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex h-full flex-col p-6 lg:p-8 space-y-8 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="text-red-500" size={32} />
          Churn Shield
        </h1>
        <p className="text-zinc-400 mt-2">AI prediction and proactive retention center</p>
      </div>

      {/* Top Stat Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
          <div className="relative z-10">
            <h3 className="text-zinc-400 text-sm font-medium mb-2">Customers At Risk</h3>
            <div className="text-4xl font-bold text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.4)]">
              {activeSignals.length}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
          <div className="relative z-10">
            <h3 className="text-zinc-400 text-sm font-medium mb-2">Revenue At Risk</h3>
            <div className="text-4xl font-bold text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]">
              {formatCurrency(18500, 'INR')}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
          <div className="relative z-10">
            <h3 className="text-zinc-400 text-sm font-medium mb-2">Avg Churn Probability</h3>
            <div className="text-4xl font-bold text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.4)] flex items-end gap-2">
              {avgProbability}%
              <Activity className="mb-2 text-rose-500/50" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* List of At Risk Customers */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white mb-4">Critical Interventions Required</h2>
        
        {activeSignals.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <ShieldAlert size={48} className="mx-auto mb-4 text-emerald-500/50" />
            <p>No critical churn risks detected. Great job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence>
              {activeSignals.map((signal, idx) => {
                const getRiskColor = (level: string) => {
                  if (level === 'critical') return 'text-red-400 bg-red-500/10 border-red-500/30 shadow-[0_0_12px_rgba(248,113,113,0.4)]';
                  if (level === 'high') return 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_12px_rgba(251,191,36,0.3)]';
                  return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
                };

                return (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                    className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-6 hover:bg-zinc-800/80 transition-colors"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-ping opacity-75" />
                          <div className="relative w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-red-500">
                            <User2 className="text-red-400" size={20} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{signal.contactName}</h3>
                          <p className="text-sm text-zinc-400">{signal.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRiskColor(signal.riskLevel)}`}>
                          {signal.riskLevel}
                        </div>
                        
                        {/* Thermometer */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-red-400">{signal.churnProbability}%</span>
                          <div className="w-2 h-12 bg-zinc-800 rounded-full overflow-hidden flex flex-col justify-end">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${signal.churnProbability}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="w-full bg-gradient-to-t from-red-600 to-rose-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Signals */}
                    <div className="bg-red-950/20 border border-red-500/10 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-red-400/80 uppercase tracking-wider mb-3">Detected Risk Signals</h4>
                      <ul className="space-y-2">
                        {signal.signals.map((sig, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                            <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-500" />
                            {sig}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Action & Buttons */}
                    <div className="flex flex-col gap-4 mt-auto">
                      <div className="flex items-center gap-2 text-sm italic text-zinc-400">
                        <MessageSquare size={14} />
                        Action: {signal.suggestedAction}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedSignal(signal)}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white text-sm font-bold shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all flex items-center justify-center gap-2"
                        >
                          <Send size={16} />
                          Send Recovery Message
                        </button>
                        <button
                          onClick={() => markAsResolved(signal.id)}
                          className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <CheckCircle2 size={16} />
                          Resolve
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <RecoveryModal 
        signal={selectedSignal} 
        isOpen={!!selectedSignal} 
        onClose={() => setSelectedSignal(null)}
        onSuccess={handleSuccess}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[100] bg-emerald-500 text-[#06080f] px-6 py-3 rounded-xl font-bold flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <CheckCircle2 size={20} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
