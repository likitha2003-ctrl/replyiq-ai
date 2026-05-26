'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Flame, Sun, Snowflake, PhoneCall, MessageSquare, Mail, Building2, User } from 'lucide-react';
import { Lead } from '../../types';
import { formatCurrency, formatTime } from '../../lib/utils';

interface RecentLeadsProps {
  leads: Lead[];
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  const router = useRouter();

  const getPriorityBadge = (priority: Lead['priority']) => {
    switch (priority) {
      case 'hot':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.15)]">
            <Flame size={10} /> Hot
          </span>
        );
      case 'warm':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Sun size={10} /> Warm
          </span>
        );
      case 'cold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/20">
            <Snowflake size={10} /> Cold
          </span>
        );
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <PhoneCall size={12} className="text-emerald-400" />;
      case 'sms':
        return <MessageSquare size={12} className="text-cyan-400" />;
      default:
        return <Mail size={12} className="text-blue-400" />;
    }
  };

  const latestLeads = leads.slice(0, 5);

  return (
    <div className="w-full rounded-2xl border border-white/[0.04] bg-slate-950/20 backdrop-blur-xl p-5 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide">Recent Lead Activity</h3>
          <span className="text-[10px] text-slate-500 block mt-0.5">Top commercial opportunities recently identified by AI co-pilot.</span>
        </div>
        <button
          onClick={() => router.push('/leads')}
          className="flex items-center gap-1 text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors"
        >
          View Pipeline <ArrowRight size={10} />
        </button>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto">
        {latestLeads.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-600">No leads captured yet.</div>
        ) : (
          latestLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => router.push('/leads')}
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.03] bg-slate-900/20 hover:bg-slate-900/60 hover:border-violet-500/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                  {lead.contactName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                      {lead.contactName}
                    </span>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1 capitalize">
                      {getChannelIcon(lead.channel)} {lead.channel}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                    {lead.companyName && (
                      <span className="flex items-center gap-1">
                        <Building2 size={9} /> {lead.companyName}
                      </span>
                    )}
                    <span className="text-slate-600">•</span>
                    <span>Added {formatTime(lead.dateCreated)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-white block">{formatCurrency(lead.dealValue)}</span>
                  <span className="text-[9px] text-slate-500 font-bold block">{lead.confidence}% Conf.</span>
                </div>
                {getPriorityBadge(lead.priority)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentLeads;
