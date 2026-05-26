'use client';

import React from 'react';
import { Sparkles, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { useConversations } from '../../lib/hooks/useConversations';
import GlowCard from '../shared/GlowCard';

export function SummaryPanel() {
  const { activeConversation } = useConversations();

  if (!activeConversation) return null;

  const getKeyBullets = () => {
    const text = activeConversation.lastMessage.toLowerCase();
    const bullets = [];

    if (text.includes('500') || text.includes('error') || text.includes('broken')) {
      bullets.push('Encountering 500 server block during payment verification.');
      bullets.push('Transaction value threatened due to technical roadblock.');
    } else if (text.includes('whatsapp') || text.includes('crm') || text.includes('setup')) {
      bullets.push('Looking to integrate WhatsApp Business CRM channel.');
      bullets.push('Evaluation covers 25 support representatives.');
    } else if (text.includes('refund') || text.includes('cancel')) {
      bullets.push('Requesting immediate transaction cancellation.');
      bullets.push('Inquiring about 4-day bank processing delay.');
    } else {
      bullets.push('Contacted via custom messaging gateway.');
      bullets.push('Requested technical details regarding settings or webhooks.');
    }

    return bullets;
  };

  const bullets = getKeyBullets();

  return (
    <GlowCard glowColor="rgba(139, 92, 246, 0.08)" className="p-4 flex flex-col justify-between h-full bg-slate-950/40 border-white/5">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-3">
          <Sparkles size={14} className="text-purple-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">Copilot Insights</span>
        </div>

        {/* Summary Description */}
        <div className="space-y-3">
          <div>
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Summary</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-white/5 font-light">
              {activeConversation.summary || 'AI is compiling discussion details... Select a conversation to start compiling context.'}
            </p>
          </div>

          {/* Bullet highlights */}
          <div>
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Key Highlights</h4>
            <ul className="space-y-2">
              {bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={12} className="text-purple-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed font-light">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Suggested action block */}
      <div className="border-t border-white/5 pt-3 mt-4 space-y-2">
        <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Next Step</h4>
        
        {activeConversation.urgencyScore > 75 ? (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
            <ShieldAlert size={14} />
            <span>Escalate & refund/diagnose immediately.</span>
          </div>
        ) : activeConversation.lastMessage.toLowerCase().includes('pricing') || activeConversation.lastMessage.toLowerCase().includes('discount') ? (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
            <Award size={14} />
            <span>Convert Lead: Draft custom quote.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/5 p-2.5 rounded-lg">
            <Sparkles size={14} className="text-purple-400" />
            <span>Review draft reply suggestions.</span>
          </div>
        )}
      </div>
    </GlowCard>
  );
}

export default SummaryPanel;
