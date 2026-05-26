'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Trash2, CheckCircle2, Moon, Sparkles, ChevronLeft, Inbox } from 'lucide-react';
import { useConversations } from '../../lib/hooks/useConversations';
import { useAIReply } from '../../lib/hooks/useAIReply';
import { ConversationStatus } from '../../types';
import MessageBubble from './MessageBubble';
import ReplyComposer from './ReplyComposer';
import AITypingIndicator from './AITypingIndicator';
import ChannelBadge from './ChannelBadge';

export function ConversationThread() {
  const { activeConversation, sendMessage, updateStatus, setActiveConversationId } = useConversations();
  const { isGenerating } = useAIReply();
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  const [isLoadingThread, setIsLoadingThread] = useState(false);

  useEffect(() => {
    if (activeConversation?.id) {
      setIsLoadingThread(true);
      const timer = setTimeout(() => setIsLoadingThread(false), 300);
      return () => clearTimeout(timer);
    }
  }, [activeConversation?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages?.length, isGenerating, isLoadingThread]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/10 p-8 text-center">
        <div className="h-20 w-20 rounded-full border border-purple-500/20 bg-purple-500/5 flex items-center justify-center text-purple-400 mb-5 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
          <Inbox size={32} />
        </div>
        <h3 className="text-base font-semibold text-white">Your inbox is quiet</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
          New messages will appear here as customers reach out across channels.
        </p>
      </div>
    );
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStatus(e.target.value as ConversationStatus);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/20 relative overflow-hidden">
      
      {/* Thread Header */}
      <div className="h-16 border-b border-white/5 px-4 md:px-6 flex items-center justify-between shrink-0 bg-slate-950/40">
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            className="md:hidden p-1.5 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setActiveConversationId(null)}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white leading-none">{activeConversation.contactName}</h2>
              <ChannelBadge channel={activeConversation.channel} />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">{activeConversation.contactEmail}</span>
          </div>
        </div>

        {/* Urgency Score & Status Select */}
        <div className="flex items-center gap-4">
          {/* Urgency Gauge */}
          <div className="flex items-center gap-2 border border-white/5 bg-slate-950/40 px-3 py-1.5 rounded-lg text-xs">
            <ShieldAlert size={14} className={activeConversation.urgencyScore > 75 ? 'text-rose-400 animate-pulse' : 'text-slate-400'} />
            <span className="text-[10px] text-slate-400 font-medium">Urgency:</span>
            <span className={`font-bold ${
              activeConversation.urgencyScore > 75 
                ? 'text-rose-400' 
                : activeConversation.urgencyScore > 40 
                ? 'text-amber-400' 
                : 'text-emerald-400'
            }`}>
              {activeConversation.urgencyScore}/100
            </span>
          </div>

          {/* Status selector */}
          <div className="relative">
            <select
              value={activeConversation.status}
              onChange={handleStatusChange}
              className="bg-slate-900 border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer pr-8 appearance-none"
            >
              <option value="open">🟢 Open</option>
              <option value="snoozed">🟡 Snoozed</option>
              <option value="resolved">🔵 Resolved</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
              <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoadingThread ? (
          <div className="space-y-6 animate-pulse">
            <div className="flex gap-4 w-full">
              <div className="h-8 w-8 rounded-full bg-white/5 shrink-0" />
              <div className="flex flex-col gap-2 w-full max-w-md">
                <div className="h-4 bg-white/5 rounded w-1/3" />
                <div className="h-16 bg-white/5 rounded-2xl rounded-tr-sm w-full" />
              </div>
            </div>
            <div className="flex gap-4 w-full justify-end">
              <div className="flex flex-col gap-2 w-full max-w-sm items-end">
                <div className="h-4 bg-white/5 rounded w-1/4" />
                <div className="h-12 bg-white/5 rounded-2xl rounded-tl-sm w-full" />
              </div>
            </div>
            <div className="flex gap-4 w-full">
              <div className="h-8 w-8 rounded-full bg-white/5 shrink-0" />
              <div className="flex flex-col gap-2 w-full max-w-md">
                <div className="h-4 bg-white/5 rounded w-1/3" />
                <div className="h-20 bg-white/5 rounded-2xl rounded-tr-sm w-full" />
              </div>
            </div>
          </div>
        ) : activeConversation.messages.length === 0 ? (
          <p className="text-center text-xs text-slate-500">No messages in this conversation.</p>
        ) : (
          activeConversation.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} conversation={activeConversation} />
          ))
        )}

        {/* Typing indicator */}
        {isGenerating && <AITypingIndicator />}

        {/* Scroll anchor */}
        <div ref={threadEndRef} />
      </div>

      {/* Composer */}
      <ReplyComposer
        conversation={activeConversation}
        onSend={(content) => sendMessage(content, 'agent')}
      />
    </div>
  );
}

export default ConversationThread;
