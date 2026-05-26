import React from 'react';
import { Smile, Frown, MessageSquare, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Sentiment } from '../../types';

interface SentimentBadgeProps {
  sentiment: Sentiment;
  urgencyScore?: number;
  className?: string;
}

export function SentimentBadge({ sentiment, urgencyScore, className }: SentimentBadgeProps) {
  let label = 'Neutral';
  let Icon = MessageSquare;
  let style = 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  if (sentiment === 'positive') {
    label = 'Positive';
    Icon = Smile;
    style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (sentiment === 'negative') {
    label = 'Negative';
    Icon = Frown;
    style = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (sentiment === 'urgent') {
    label = 'Urgent';
    Icon = AlertTriangle;
    style = 'bg-rose-600/15 text-rose-400 border-rose-500/30 animate-pulse';
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm",
        style,
        className
      )}
    >
      <Icon size={10} />
      <span>{label} {urgencyScore !== undefined && `(${urgencyScore}%)`}</span>
    </span>
  );
}

export default SentimentBadge;
