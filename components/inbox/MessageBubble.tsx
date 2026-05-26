import React from 'react';
import { Sparkles, User, Mail, MessageSquare, PhoneCall } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Message, Conversation } from '../../types';

interface MessageBubbleProps {
  message: Message;
  conversation: Conversation;
}

export function MessageBubble({ message, conversation }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isAgent = message.sender === 'agent';

  // Format timestamp
  const formatMsgTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div
      className={cn("flex items-start gap-3 w-full animate-fade-in", {
        "justify-start": isUser,
        "justify-end": isAgent || isAI,
      })}
    >
      {/* Left Avatar for User */}
      {isUser && (
        <div className="relative shrink-0">
          {conversation.contactAvatar ? (
            <img
              src={conversation.contactAvatar}
              alt={conversation.contactName}
              className="h-8 w-8 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
              <User size={14} className="text-slate-400" />
            </div>
          )}
          
          {/* Small Channel badge */}
          <div className="absolute -bottom-1 -right-1 rounded-full bg-slate-900 border border-white/10 p-0.5">
            {message.channel === 'whatsapp' ? (
              <PhoneCall size={8} className="text-emerald-400" />
            ) : message.channel === 'sms' ? (
              <MessageSquare size={8} className="text-cyan-400" />
            ) : (
              <Mail size={8} className="text-blue-400" />
            )}
          </div>
        </div>
      )}

      {/* Message Box */}
      <div className="flex flex-col space-y-1 max-w-[70%]">
        <div
          className={cn("rounded-2xl px-4 py-3 text-sm shadow-md leading-relaxed relative overflow-hidden", {
            // User message style
            "bg-slate-800/60 text-slate-200 border border-white/5 rounded-tl-none": isUser,
            // Agent message style
            "bg-slate-700/50 text-white border border-white/10 rounded-tr-none": isAgent,
            // AI message style
            "bg-gradient-to-r from-violet-950/40 to-indigo-950/40 text-purple-200 border border-purple-500/25 rounded-tr-none": isAI,
          })}
        >
          {isAI && (
            <div className="absolute top-0 right-0 p-1 flex items-center gap-1 bg-purple-500/10 border-l border-b border-purple-500/20 rounded-bl-lg">
              <Sparkles size={10} className="text-purple-400 animate-pulse" />
              <span className="text-[8px] text-purple-400 font-bold uppercase tracking-wider pr-0.5">Auto-Pilot</span>
            </div>
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {/* Timestamp */}
        <span
          className={cn("text-[9px] text-slate-500 px-1", {
            "text-left": isUser,
            "text-right": !isUser,
          })}
        >
          {isAI ? 'Sent by AI Copilot' : isAgent ? 'Sent by Agent' : conversation.contactName} • {formatMsgTime(message.timestamp)}
        </span>
      </div>

      {/* Right Avatar for Agent/AI */}
      {!isUser && (
        <div className="shrink-0">
          {isAI ? (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-500/15">
              <Sparkles size={14} className="text-white" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-indigo-600 border border-indigo-500/20 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
