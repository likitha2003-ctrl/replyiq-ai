'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Send, RefreshCw, Smile, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAIModeStore } from '../../store/aiModeStore';
import { useAIReply } from '../../lib/hooks/useAIReply';
import { Conversation } from '../../types';
import Button from '../ui/Button';

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayed('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(prev => prev + text.charAt(i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <>
      {displayed}
      {isTyping && <span className="inline-block w-1.5 h-3 ml-0.5 bg-purple-400 animate-pulse" />}
    </>
  );
}

interface ReplyComposerProps {
  conversation: Conversation;
  onSend: (content: string) => void;
}

export function ReplyComposer({ conversation, onSend }: ReplyComposerProps) {
  const [content, setContent] = useState('');
  const { settings, updateSettings } = useAIModeStore();
  const { isGenerating, generateReply } = useAIReply();

  const handleSend = () => {
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Trigger AI reply draft manually
  const handleAIDraft = async () => {
    const draft = await generateReply(conversation.id, conversation.lastMessage);
    if (draft) {
      // We don't auto-fill content so they can see the draft banner above!
      // Or we can fill it. Let's show the draft banner above and let them insert it.
    }
  };

  const insertDraft = () => {
    if (conversation.aiDraft) {
      setContent(conversation.aiDraft);
    }
  };

  const tones: { id: typeof settings.tone; label: string; icon: string }[] = [
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'casual', label: 'Casual', icon: '🍃' },
    { id: 'empathetic', label: 'Empathetic', icon: '❤️' },
    { id: 'persuasive', label: 'Persuasive', icon: '⚡' },
  ];

  return (
    <div className="border-t border-white/5 bg-slate-950/40 p-4 space-y-4 shrink-0 relative">
      
      {/* AI Draft Banner */}
      {conversation.aiDraft && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/10 backdrop-blur-md flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-purple-500/5 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-purple-400 animate-pulse" />
              <span className="text-xs font-semibold text-purple-200">AI Suggested Draft ({settings.tone})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={insertDraft}
                className="text-[10px] font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <span>Use Draft</span>
                <ArrowUpRight size={10} />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-950/30 p-2 rounded-lg border border-white/5 min-h-[40px]">
            &quot;<TypewriterText text={conversation.aiDraft} />&quot;
          </p>
        </motion.div>
      )}

      {/* Input Text Area */}
      <div className="relative rounded-xl border border-white/10 bg-slate-950/60 p-2 focus-within:ring-1 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Reply to ${conversation.contactName}...`}
          className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none resize-none px-2 pt-1 pb-10 min-h-[70px] max-h-[200px]"
        />

        {/* Action triggers bottom left */}
        <div className="absolute bottom-2 left-3 flex items-center gap-3">
          <button className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
            <Smile size={16} />
          </button>
        </div>

        {/* Send triggers bottom right */}
        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          {/* Tone Selector dropdown/bar inside composer */}
          <div className="flex items-center gap-1 mr-2 bg-slate-900 border border-white/5 rounded-lg p-0.5">
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => updateSettings({ tone: t.id })}
                title={`${t.label} Tone`}
                className={`text-xs px-2 py-1 rounded-md transition-all cursor-pointer ${
                  settings.tone === t.id
                    ? 'bg-purple-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="mr-1">{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={isGenerating}
            onClick={handleAIDraft}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 border border-purple-500/20 bg-purple-500/5 cursor-pointer"
          >
            {isGenerating ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <Sparkles size={12} />
            )}
            <span className="text-xs">Draft</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={!content.trim()}
            onClick={handleSend}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Send size={12} />
            <span className="text-xs">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReplyComposer;
