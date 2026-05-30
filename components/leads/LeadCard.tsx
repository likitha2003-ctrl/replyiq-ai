'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, PhoneCall, Building2, User2, Calendar, ExternalLink, Sparkles, Flame, Sun, Snowflake } from 'lucide-react';
import { Lead } from '../../types';
import { formatCurrency, formatTime } from '../../lib/utils';

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent, id: string) => void;
  index?: number;
  onClick?: () => void;
}

function ScoreCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let n = 0;
    const inc = value / 50;
    const t = setInterval(() => {
      n += inc;
      if (n >= value) { setCount(value); clearInterval(t); }
      else setCount(Math.floor(n));
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return <>{count}</>;
}

function CurrencyCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const to = setTimeout(() => {
      let n = 0;
      const inc = value / 50;
      const t = setInterval(() => {
        n += inc;
        if (n >= value) { setCount(value); clearInterval(t); }
        else setCount(Math.floor(n));
      }, 20);
      return () => clearInterval(t);
    }, delay * 1000);
    return () => clearTimeout(to);
  }, [value, delay]);
  return <>{formatCurrency(count)}</>;
}

const scoreTheme = (s: number) =>
  s >= 70
    ? { text: 'text-emerald-400', stroke: '#34d399', track: '#064e3b', glow: '0 0 14px rgba(52,211,153,0.4)' }
    : s >= 40
    ? { text: 'text-amber-400', stroke: '#fbbf24', track: '#451a03', glow: '0 0 14px rgba(251,191,36,0.35)' }
    : { text: 'text-red-400', stroke: '#f87171', track: '#450a0a', glow: '0 0 14px rgba(248,113,113,0.4)' };

export function LeadCard({ lead, onDragStart, index = 0, onClick }: LeadCardProps) {
  const router = useRouter();
  const score = lead.score ?? 0;
  const c = scoreTheme(score);
  const r = 20, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
  const sb = lead.scoreBreakdown;

  const bars = sb
    ? [
        { label: 'Engagement',      value: sb.engagement,      color: 'bg-cyan-500'    },
        { label: 'Purchase Intent', value: sb.intent,          color: 'bg-zinc-500'  },
        { label: 'Recency',         value: sb.recency   ?? 50, color: 'bg-violet-500'  },
        { label: 'Sentiment',       value: sb.sentiment ?? 50, color: 'bg-emerald-500' },
      ]
    : null;

  const priorityBadge = {
    hot:  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/20"><Flame size={9} />Hot</span>,
    warm: <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20"><Sun size={9} />Warm</span>,
    cold: <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/20"><Snowflake size={9} />Cold</span>,
  }[lead.priority];

  const channelIcon = { whatsapp: <PhoneCall size={12} className="text-emerald-400" />, sms: <MessageSquare size={12} className="text-cyan-400" />, email: <Mail size={12} className="text-blue-400" />, instagram: <Mail size={12} className="text-pink-400" /> }[lead.channel] ?? <Mail size={12} className="text-blue-400" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ delay: index * 0.05, duration: 0.28 }}
      draggable
      onDragStart={(e) => onDragStart(e as any, lead.id)}
      onClick={onClick}
      className="p-4 rounded-xl border border-white/[0.06] bg-zinc-900/60 hover:bg-zinc-800/70 hover:border-violet-500/30 transition-all duration-300 cursor-grab active:cursor-grabbing group relative overflow-hidden flex flex-col"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-violet-500/[0.04] to-transparent rounded-xl" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">{channelIcon}<span className="text-[10px] text-zinc-500 font-medium capitalize">{lead.channel}</span></div>
          {priorityBadge}
        </div>

        {/* Score gauge */}
        {lead.score !== undefined && (
          <div className="relative w-11 h-11 rounded-full flex items-center justify-center bg-zinc-950/60 shrink-0" style={{ boxShadow: c.glow }}>
            <svg className="w-11 h-11 -rotate-90 absolute inset-0" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r={r} stroke={c.track} strokeWidth="4" fill="none" />
              <motion.circle cx="24" cy="24" r={r} stroke={c.stroke} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.1, ease: 'easeOut', delay: index * 0.05 }} />
            </svg>
            <span className={`text-[13px] font-bold relative z-10 ${c.text}`}><ScoreCounter value={score} /></span>
          </div>
        )}
      </div>

      {/* Deal value */}
      <div className="mt-3">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
          <CurrencyCounter value={lead.dealValue} delay={index * 0.08} />
        </span>
      </div>

      {/* Summary */}
      <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed line-clamp-2">
        <Sparkles size={10} className="inline mr-1 text-violet-400" />{lead.summary}
      </p>

      {/* 4 breakdown bars — 6px height */}
      {bars && (
        <div className="mt-4 flex flex-col gap-[7px] w-full">
          {bars.map((bar, i) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-500 w-[72px] shrink-0">{bar.label}</span>
              <div className="flex-1 h-[6px] bg-zinc-800/80 rounded-full overflow-hidden">
                <motion.div className={`h-full rounded-full ${bar.color}`} initial={{ width: 0 }} animate={{ width: `${bar.value}%` }} transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 + i * 0.07 }} />
              </div>
              <span className="text-[9px] text-zinc-300 w-7 text-right font-semibold shrink-0">{bar.value}%</span>
            </div>
          ))}
        </div>
      )}

      <div className="h-px bg-white/[0.05] my-3" />

      {/* Footer */}
      <div className="flex flex-col gap-1 text-[10px] text-zinc-500 mt-auto">
        <div className="flex items-center gap-1.5">
          <User2 size={11} className="text-zinc-600 shrink-0" />
          <span className="font-semibold text-zinc-300 truncate">{lead.contactName}</span>
          {lead.score !== undefined && <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-zinc-500/15 text-zinc-400 shrink-0"><Sparkles size={7} />AI</span>}
        </div>
        {lead.companyName && <div className="flex items-center gap-1.5"><Building2 size={11} className="text-zinc-600 shrink-0" /><span className="truncate">{lead.companyName}</span></div>}
        <div className="flex items-center gap-1.5 text-[9px] text-zinc-600 mt-0.5"><Calendar size={10} className="shrink-0" /><span>Added {formatTime(lead.dateCreated)}</span></div>
      </div>

      <button onClick={(e) => { e.stopPropagation(); router.push('/inbox'); }} className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-semibold text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-violet-500/10 hover:text-violet-300 hover:border-violet-500/20 transition-all duration-200">
        <ExternalLink size={10} /> View Conversation
      </button>
    </motion.div>
  );
}

export default LeadCard;
