'use client';

import React from 'react';
import { Search, User, Filter, AlertCircle, Smile, Frown, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConversations } from '../../lib/hooks/useConversations';
import { Conversation, Sentiment } from '../../types';
import { formatTime } from '../../lib/utils';
import ChannelBadge from './ChannelBadge';

export function ConversationList() {
  const {
    conversations,
    activeConversation,
    setActiveConversationId,
    filters,
  } = useConversations();

  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case 'urgent':
        return <AlertCircle size={12} className="text-rose-400 animate-pulse" />;
      case 'positive':
        return <Smile size={12} className="text-emerald-400" />;
      case 'negative':
        return <Frown size={12} className="text-rose-400" />;
      default:
        return <MessageSquare size={12} className="text-slate-400" />;
    }
  };

  const getSentimentClass = (sentiment: Sentiment) => {
    switch (sentiment) {
      case 'urgent':
        return 'border-rose-500/30 bg-rose-500/5 text-rose-300';
      case 'positive':
        return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300';
      case 'negative':
        return 'border-rose-500/20 bg-rose-500/5 text-rose-300';
      default:
        return 'border-white/5 bg-white/5 text-slate-300';
    }
  };

  return (
    <div className="w-80 border-r border-white/5 bg-slate-950/40 flex flex-col h-full shrink-0">
      
      {/* Search Header */}
      <div className="p-4 border-b border-white/5 space-y-3 shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            placeholder="Search inbox..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-white/5 bg-white/5 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
        </div>

        {/* Quick Channels filter bar */}
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
            {(['all', 'email', 'whatsapp', 'sms'] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => filters.setChannel(ch)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  filters.channel === ch
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'bg-transparent text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                {ch.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs (Open / Resolved / Snoozed) */}
      <div className="flex border-b border-white/5 text-xs px-2 shrink-0 bg-slate-950/20">
        {(['all', 'open', 'resolved', 'snoozed'] as const).map((st) => (
          <button
            key={st}
            onClick={() => filters.setStatus(st)}
            className={`flex-1 py-3 text-center border-b-2 font-medium transition-all cursor-pointer ${
              filters.status === st
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {st.charAt(0).toUpperCase() + st.slice(1)}
          </button>
        ))}
      </div>

      {/* Sentiment Sub-Filter bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-950/10 text-[10px] text-slate-500 shrink-0">
        <span className="flex items-center gap-1"><Filter size={10} /> Sentiment:</span>
        <div className="flex gap-1">
          {(['all', 'urgent', 'positive', 'negative', 'neutral'] as const).map((sent) => (
            <button
              key={sent}
              onClick={() => filters.setSentiment(sent)}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer capitalize ${
                filters.sentiment === sent
                  ? 'bg-white/10 text-white font-medium'
                  : 'hover:text-white text-slate-400'
              }`}
            >
              {sent}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
        {conversations.length === 0 ? (
          <p className="text-center text-xs py-12 text-slate-500">No conversations match the filters.</p>
        ) : (
          conversations.map((conv) => {
            const isSelected = activeConversation?.id === conv.id;
            
            return (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer relative flex gap-3 ${
                  isSelected
                    ? 'bg-white/5 border-white/10 shadow-lg'
                    : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                {/* Sentiment side-border glow */}
                {conv.sentiment === 'urgent' && (
                  <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-rose-500 rounded-r shadow shadow-rose-500" />
                )}

                {/* Avatar */}
                <div className="shrink-0 relative">
                  {conv.contactAvatar ? (
                    <img
                      src={conv.contactAvatar}
                      alt={conv.contactName}
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                      <User size={16} className="text-slate-400" />
                    </div>
                  )}
                  {/* Purple Unread/Pulse Dot */}
                  <motion.span 
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-0 right-0 h-2.5 w-2.5 bg-purple-500 rounded-full border-2 border-slate-950" 
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">{conv.contactName}</span>
                    <span className="text-[10px] text-slate-500">{formatTime(conv.lastMessageTime)}</span>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 truncate mt-1 line-clamp-1 leading-normal">
                    {(() => {
                      const lastCustomerMsg = [...conv.messages].reverse().find(m => m.sender === 'user');
                      const previewText = lastCustomerMsg ? lastCustomerMsg.content : conv.lastMessage;
                      return previewText.length > 45 ? previewText.substring(0, 45) + '...' : previewText;
                    })()}
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    <ChannelBadge channel={conv.channel} />
                    
                    {/* Sentiment pill */}
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-medium capitalize ${getSentimentClass(conv.sentiment)}`}>
                      {getSentimentIcon(conv.sentiment)}
                      <span>{conv.sentiment}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConversationList;
