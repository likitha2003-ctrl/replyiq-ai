import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LeadBadgeProps {
  confidence: number;
  className?: string;
}

export function LeadBadge({ confidence, className }: LeadBadgeProps) {
  let style = 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  
  if (confidence >= 85) {
    style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/5';
  } else if (confidence >= 65) {
    style = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm",
        style,
        className
      )}
    >
      <Sparkles size={10} className={confidence >= 85 ? 'animate-pulse' : ''} />
      <span>{confidence}% Confidence</span>
    </span>
  );
}

export default LeadBadge;
