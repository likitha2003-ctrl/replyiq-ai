'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import AnimatedCounter from '../shared/AnimatedCounter';

interface StatCardProps {
  name: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: string;
  trendType: 'up' | 'down';
  icon: LucideIcon;
  sparklineData: { value: number }[];
  color: string;
  glowColor: string;
  index?: number;
}

export function StatCard({
  name,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendType,
  icon: Icon,
  sparklineData,
  color,
  glowColor,
  index = 0,
}: StatCardProps) {
  const isUp = trendType === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2 }}
      className="p-5 rounded-2xl border border-white/[0.04] bg-slate-950/20 backdrop-blur-xl relative overflow-hidden group transition-all duration-300 hover:border-white/[0.08] hover:shadow-2xl hover:shadow-violet-500/[0.02]"
    >
      {/* Background glow hover effect */}
      <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br ${glowColor} to-transparent`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">{name}</span>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 font-heading tracking-tight">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
          </h3>
        </div>
        <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={16} />
        </div>
      </div>

      {/* Sparkline & Trend Info */}
      <div className="flex items-end justify-between mt-5 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            isUp ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend}
          </span>
          <span className="text-[9px] text-slate-500 font-semibold tracking-wide">vs yesterday</span>
        </div>

        {/* Sparkline chart */}
        <div className="w-20 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${name.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={isUp ? '#10b981' : '#f43f5e'}
                strokeWidth={1.5}
                fill={`url(#gradient-${name.replace(/\s+/g, '-')})`}
                dot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
