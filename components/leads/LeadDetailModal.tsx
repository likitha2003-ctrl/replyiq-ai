'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Sparkles, User2, Building2, Calendar, Activity,
  Target, Clock, DollarSign, RefreshCw, ChevronRight,
  CheckCircle2, Zap, TrendingUp,
} from 'lucide-react';
import { Lead } from '../../types';
import { formatCurrency, formatTime } from '../../lib/utils';
import { useLeads } from '../../lib/hooks/useLeads';

interface Props {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

/* ── Animated integer counter ── */
function Counter({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let cur = 0;
    const inc = value / 55;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= value) { setN(value); clearInterval(t); }
      else setN(Math.floor(cur));
    }, 18);
    return () => clearInterval(t);
  }, [value]);
  return <>{n}</>;
}

/* ── Score colour theme ── */
const theme = (s: number) =>
  s >= 70
    ? { ring: '#34d399', track: '#064e3b', text: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'Excellent', glow: 'shadow-[0_0_32px_rgba(52,211,153,0.3)]' }
    : s >= 40
    ? { ring: '#fbbf24', track: '#451a03', text: 'text-amber-400',   badge: 'bg-amber-500/15  text-amber-400  border-amber-500/30',  label: 'Moderate', glow: 'shadow-[0_0_32px_rgba(251,191,36,0.3)]'  }
    : { ring: '#f87171', track: '#450a0a', text: 'text-red-400',     badge: 'bg-red-500/15    text-red-400    border-red-500/30',    label: 'Low',      glow: 'shadow-[0_0_32px_rgba(248,113,113,0.3)]' };

export function LeadDetailModal({ lead, isOpen, onClose }: Props) {
  const { updateLead } = useLeads();

  const [aiReasons, setAiReasons]         = useState<string[]>([]);
  const [aiAction, setAiAction]           = useState('');
  const [aiLoading, setAiLoading]         = useState(false);
  const [rescoring, setRescoring]         = useState(false);
  const [actionDone, setActionDone]       = useState(false);

  /* Fetch AI explanation when the panel opens for this lead */
  const fetchExplanation = useCallback(async (l: Lead) => {
    if (l.aiExplanation?.length) {
      setAiReasons(l.aiExplanation);
      setAiAction(l.recommendation || '');
      return;
    }
    setAiLoading(true);
    setAiReasons([]);
    setAiAction('');
    try {
      const res = await fetch('/api/ai/score-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: l }),
      });
      const data = await res.json();
      setAiReasons(data.reasons || []);
      setAiAction(data.recommendedAction || '');
      // Cache on lead object so we don't re-fetch
      updateLead(l.id, {
        aiExplanation: data.reasons,
        recommendation: data.recommendedAction,
      });
    } catch {
      setAiReasons([
        'High engagement and recent activity signal active purchase evaluation.',
        'Explicit interest in pricing or demo suggests decision-maker intent.',
        'Sentiment analysis indicates a positive or neutral disposition.',
      ]);
      setAiAction('Send a personalised follow-up with a tailored pricing proposal.');
    } finally {
      setAiLoading(false);
    }
  }, [updateLead]);

  useEffect(() => {
    if (isOpen && lead) {
      setActionDone(false);
      fetchExplanation(lead);
    }
  }, [isOpen, lead, fetchExplanation]);

  /* Re-score via Gemini */
  const handleRescore = async () => {
    if (!lead) return;
    setRescoring(true);
    try {
      const res = await fetch('/api/ai/score-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadData: lead }),
      });
      const data = await res.json();
      if (data.score) {
        const updated = { score: data.score, scoreBreakdown: data.breakdown, recommendation: data.recommendation, scoreUpdatedAt: new Date().toISOString(), aiExplanation: undefined };
        updateLead(lead.id, updated);
      }
    } catch { /* silent */ }
    finally { setRescoring(false); }
  };

  if (!lead) return null;

  const score = lead.score ?? 0;
  const c = theme(score);
  const R = 52, CIRC = 2 * Math.PI * R;
  const dashOffset = CIRC - (score / 100) * CIRC;

  const sb = lead.scoreBreakdown;
  const bars = sb ? [
    { label: 'Engagement',      icon: Activity,   value: sb.engagement,      color: 'bg-cyan-500',    text: 'text-cyan-400'    },
    { label: 'Purchase Intent', icon: Target,      value: sb.intent,          color: 'bg-zinc-500',  text: 'text-zinc-400'  },
    { label: 'Recency',         icon: Clock,       value: sb.recency   ?? 50, color: 'bg-violet-500',  text: 'text-violet-400'  },
    { label: 'Sentiment',       icon: TrendingUp,  value: sb.sentiment ?? 50, color: 'bg-emerald-500', text: 'text-emerald-400' },
  ] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
          />

          {/* Slide-in panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative h-full w-full max-w-[460px] bg-zinc-900 border-l border-white/[0.08] shadow-[−20px_0_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Ambient gradient top-right */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-20" style={{ background: `radial-gradient(circle at top right, ${c.ring}33, transparent 70%)` }} />

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                  <Sparkles size={18} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">Lead Intelligence</h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">AI-powered qualification</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 scrollbar-thin">

              {/* Contact info strip */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-zinc-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {lead.contactName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{lead.contactName}</div>
                  {lead.companyName && (
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                      <Building2 size={11} />{lead.companyName}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-white">{formatCurrency(lead.dealValue)}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Deal value</div>
                </div>
              </div>

              {/* ── Score ring + badge ── */}
              <div className="flex items-center gap-5 p-5 rounded-2xl bg-zinc-950/50 border border-white/[0.06] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-violet-500/[0.04] pointer-events-none" />

                {/* Ring */}
                <div className={`relative w-[120px] h-[120px] shrink-0 rounded-full flex items-center justify-center bg-zinc-900 ${c.glow}`}>
                  <svg className="w-[120px] h-[120px] -rotate-90 absolute inset-0" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={R} stroke={c.track} strokeWidth="8" fill="none" />
                    <motion.circle
                      cx="60" cy="60" r={R}
                      stroke={c.ring} strokeWidth="8" fill="none" strokeLinecap="round"
                      strokeDasharray={CIRC}
                      initial={{ strokeDashoffset: CIRC }}
                      animate={{ strokeDashoffset: dashOffset }}
                      transition={{ duration: 1.3, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="flex flex-col items-center relative z-10">
                    <span className={`text-4xl font-bold ${c.text}`}><Counter value={score} /></span>
                    <span className="text-[10px] text-zinc-500 font-medium">/ 100</span>
                  </div>
                </div>

                {/* Labels */}
                <div className="flex flex-col gap-2.5 flex-1">
                  <div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${c.badge}`}>{c.label} Score</span>
                  </div>
                  <p className="text-[12px] text-zinc-400 leading-snug">{lead.summary}</p>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <Calendar size={10} />{formatTime(lead.dateCreated)}
                  </div>

                  {/* Re-score button */}
                  <button
                    onClick={handleRescore}
                    disabled={rescoring}
                    className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw size={12} className={rescoring ? 'animate-spin' : ''} />
                    {rescoring ? 'Re-scoring…' : 'Re-score with AI'}
                  </button>
                </div>
              </div>

              {/* ── Score breakdown bars ── */}
              {bars.length > 0 && (
                <div className="p-5 rounded-xl bg-zinc-950/40 border border-white/[0.06] space-y-4">
                  <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Score Breakdown</h3>
                  {bars.map((bar, i) => (
                    <div key={bar.label} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[12px] text-zinc-300">
                          <bar.icon size={13} className={bar.text} />{bar.label}
                        </span>
                        <span className={`text-[13px] font-bold ${bar.text}`}>{bar.value}%</span>
                      </div>
                      <div className="h-[6px] bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${bar.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.value}%` }}
                          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Why this score? (AI bullets) ── */}
              <div className="p-5 rounded-xl bg-violet-500/[0.06] border border-violet-500/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-violet-400" />
                  <h3 className="text-[12px] font-bold text-violet-300 uppercase tracking-wider">Why this score?</h3>
                </div>

                {aiLoading ? (
                  <div className="space-y-2.5 pt-1">
                    {[80, 65, 75].map((w, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 mt-1.5 shrink-0 animate-pulse" />
                        <div className="h-3 rounded-full bg-violet-500/20 animate-pulse" style={{ width: `${w}%` }} />
                      </div>
                    ))}
                    <p className="text-[10px] text-zinc-500 pt-1">Gemini is analysing this lead…</p>
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {aiReasons.map((reason, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className="flex items-start gap-2.5 text-[12px] text-zinc-300 leading-relaxed"
                      >
                        <ChevronRight size={13} className="text-violet-400 shrink-0 mt-0.5" />
                        {reason}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* ── Sticky footer: recommended action ── */}
            <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-zinc-900/80 backdrop-blur-sm space-y-3">
              {aiAction && !aiLoading && (
                <p className="text-[11px] text-zinc-400 leading-snug flex items-start gap-1.5">
                  <Zap size={11} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="text-zinc-300 font-semibold">Recommended: </span>{aiAction}</span>
                </p>
              )}

              <button
                onClick={() => setActionDone(true)}
                disabled={aiLoading || actionDone}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  actionDone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                    : 'bg-gradient-to-r from-violet-600 to-zinc-500 hover:from-violet-500 hover:to-zinc-400 text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] disabled:opacity-50'
                }`}
              >
                {actionDone
                  ? <><CheckCircle2 size={16} /> Action Logged</>
                  : <><Zap size={16} /> {aiLoading ? 'Loading action…' : 'Take Recommended Action'}</>
                }
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default LeadDetailModal;
