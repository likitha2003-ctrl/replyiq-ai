import React from 'react';
import { Sparkles } from 'lucide-react';

export function AITypingIndicator() {
  return (
    <div className="flex items-start gap-3 justify-start animate-fade-in">
      {/* Bot Icon */}
      <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-pink-500 via-zinc-600 to-zinc-500 flex items-center justify-center border border-zinc-500/30 shadow-lg shadow-zinc-500/10 shrink-0">
        <Sparkles size={14} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
      </div>

      {/* Typing Bubble */}
      <div className="relative max-w-sm rounded-2xl rounded-tl-none border border-zinc-500/35 bg-zinc-950/15 p-4 shadow-lg shadow-zinc-500/5 overflow-hidden">
        {/* Glow indicator line */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-500 via-zinc-500 to-zinc-500 animate-pulse" />
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-400 font-medium">Copilot is drafting</span>
          <div className="flex space-x-1">
            <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AITypingIndicator;
