'use client';

import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { Conversation } from '../../types';

interface SmartReplySuggestionsProps {
  conversation: Conversation;
  onSelectSuggestion: (text: string) => void;
}

export function SmartReplySuggestions({
  conversation,
  onSelectSuggestion,
}: SmartReplySuggestionsProps) {
  const getSuggestions = (): string[] => {
    const text = conversation.lastMessage.toLowerCase();
    
    if (text.includes('500') || text.includes('error')) {
      return [
        "Hi, I've asked our engineering team to inspect this immediately. Let me manually invoice you so we don't miss the quarter end.",
        "Hi, I sincerely apologize for the checkout error. Could you let me know which browser you are using, or try this direct payment link?",
        "Hi Sarah, our team is resolving the 500 error on the upgrade page. I have paused your renewal date to ensure zero downtime."
      ];
    }

    if (text.includes('whatsapp') || text.includes('crm') || text.includes('agents')) {
      return [
        "Hi Marco, yes! We support multi-number business routing. Would you like to schedule a 10-minute Zoom call tomorrow to set up a sandbox?",
        "Hi Marco, thanks for reaching out. Yes, we support multi-agent allocation on a single number. I can send over our API configuration docs.",
        "That sounds great! I would love to walk you through our custom WhatsApp routing. What timezone are you in?"
      ];
    }

    if (text.includes('refund') || text.includes('cancel')) {
      return [
        "Hi Elena, I have confirmed your cancellation. The refund takes 5-10 business days depending on your bank's processing cycles.",
        "Hi Elena, I understand the frustration. I have processed the subscription refund manually. Let me know if you need anything else.",
        "Apologies for the inconvenience. Your account has been downgraded to the free tier and a refund of the last charge has been issued."
      ];
    }

    return [
      "Hi, thanks for reaching out! Let me check the details and get back to you in a few minutes.",
      "Hello, I would be happy to help with this. Let me grab the documentation link and send it over.",
      "Thanks for verifying! I will pass this info to our technical support team immediately."
    ];
  };

  const suggestions = getSuggestions();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        <Sparkles size={10} className="text-purple-400" />
        <span>One-Click Smart Refills</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggestion(s)}
            className="w-full text-left p-2.5 rounded-lg border border-white/5 bg-slate-900/40 hover:bg-slate-900 hover:border-purple-500/25 transition-all text-xs text-slate-300 hover:text-white leading-normal flex items-start gap-2 cursor-pointer font-light"
          >
            <MessageSquare size={12} className="text-purple-500 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SmartReplySuggestions;
