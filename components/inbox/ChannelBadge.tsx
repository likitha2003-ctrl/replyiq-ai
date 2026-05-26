import React from 'react';
import { Mail, MessageSquare, PhoneCall, Camera } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Channel } from '../../types';

interface ChannelBadgeProps {
  channel: Channel;
  className?: string;
}

export function ChannelBadge({ channel, className }: ChannelBadgeProps) {
  let label = 'Email';
  let Icon = Mail;
  let style = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

  if (channel === 'whatsapp') {
    label = 'WhatsApp';
    Icon = PhoneCall;
    style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (channel === 'sms') {
    label = 'SMS';
    Icon = MessageSquare;
    style = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  } else if (channel === 'instagram') {
    label = 'Instagram';
    Icon = Camera;
    style = 'bg-pink-500/10 text-pink-400 border-pink-500/20';
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm",
        style,
        className
      )}
    >
      <Icon size={10} />
      <span>{label}</span>
    </span>
  );
}

export default ChannelBadge;
