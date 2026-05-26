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
}

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const interval = 20;
    const steps = duration / interval;
    const increment = value / steps;
    
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, interval);
      return () => clearInterval(timer);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return <>{formatCurrency(Math.floor(count))}</>;
}

export function LeadCard({ lead, onDragStart, index = 0 }: LeadCardProps) {
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, lead.id);
  };

  const getChannelIcon = () => {
    switch (lead.channel) {
      case 'whatsapp':
        return <PhoneCall size={12} className="text-emerald-400" />;
      case 'sms':
        return <MessageSquare size={12} className="text-cyan-400" />;
      default:
        return <Mail size={12} className="text-blue-400" />;
    }
  };

  const getPriorityBadge = () => {
    switch (lead.priority) {
      case 'hot':
        return (
          <span className="group-hover:shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-shadow duration-200 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.15)]">
            <Flame size={10} /> Hot
          </span>
        );
      case 'warm':
        return (
          <span className="group-hover:shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-shadow duration-200 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Sun size={10} /> Warm
          </span>
        );
      case 'cold':
        return (
          <span className="group-hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-shadow duration-200 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/20">
            <Snowflake size={10} /> Cold
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(124, 58, 237, 0.2)" }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      draggable
      onDragStart={handleDragStart as any}
      className="p-4 rounded-xl border border-white/[0.06] bg-slate-900/60 hover:bg-slate-800/70 hover:border-violet-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 cursor-grab active:cursor-grabbing group relative overflow-hidden"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-violet-500/[0.03] to-transparent" />

      {/* Header Row */}
      <div className="flex items-start justify-between relative">
        <div className="flex items-center gap-2">
          {getChannelIcon()}
          <span className="text-[10px] text-slate-500 font-medium capitalize">{lead.channel}</span>
        </div>
        {getPriorityBadge()}
      </div>

      {/* Deal Value */}
      <div className="mt-3">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
          <AnimatedCounter value={lead.dealValue} delay={index * 0.1} />
        </span>
      </div>

      {/* AI Reason / Summary */}
      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-2">
        <Sparkles size={10} className="inline mr-1 text-violet-400" />
        {lead.summary}
      </p>

      {/* Divider */}
      <div className="h-px bg-white/5 my-3" />

      {/* Footer Details */}
      <div className="flex flex-col gap-1.5 text-[10px] text-slate-500 relative">
        <div className="flex items-center gap-1.5">
          <User2 size={12} className="text-slate-600" />
          <span className="font-semibold text-slate-300 truncate">{lead.contactName}</span>
        </div>
        
        {lead.companyName && (
          <div className="flex items-center gap-1.5">
            <Building2 size={12} className="text-slate-600" />
            <span className="truncate">{lead.companyName}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-600">
          <Calendar size={10} />
          <span>Added {formatTime(lead.dateCreated)}</span>
        </div>
      </div>

      {/* View Conversation Button — visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push('/inbox');
        }}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-violet-500/10 hover:text-violet-300 hover:border-violet-500/20 transition-all duration-200"
      >
        <ExternalLink size={10} /> View Conversation
      </button>
    </motion.div>
  );
}

export default LeadCard;
