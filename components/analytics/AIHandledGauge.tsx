'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AnimatedCounter from '../shared/AnimatedCounter';

interface AIHandledGaugeProps {
  value: number; // 0 - 100
}

export function AIHandledGauge({ value }: AIHandledGaugeProps) {
  const getGaugeColor = (val: number) => {
    if (val >= 80) return '#10b981'; // Green
    if (val >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getGaugeBackgroundGlow = (val: number) => {
    if (val >= 80) return 'from-emerald-500/[0.04]';
    if (val >= 50) return 'from-amber-500/[0.04]';
    return 'from-rose-500/[0.04]';
  };

  const color = getGaugeColor(value);
  const glow = getGaugeBackgroundGlow(value);

  // We want a semicircle, so the active part is 'value' and the inactive part is '100 - value'
  // Then we have a total of 100 for the top half, but Recharts Pie needs standard 180 degrees.
  const chartData = [
    { value: value },
    { value: 100 - value },
  ];

  return (
    <div className="w-full h-80 rounded-2xl border border-white/[0.04] bg-slate-950/20 backdrop-blur-xl p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Background glow */}
      <div className={`absolute -inset-px bg-gradient-to-t ${glow} to-transparent pointer-events-none`} />

      <div>
        <h3 className="text-xs font-bold text-white tracking-wide">AI Autopilot Handled Rate</h3>
        <span className="text-[10px] text-slate-500 block mt-0.5">Percentage of queries completely resolved without human agent touch.</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative min-h-0">
        <div className="w-[180px] h-[100px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={65}
                outerRadius={80}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={1000}
              >
                <Cell fill={color} style={{ filter: `drop-shadow(0 0 6px ${color}40)`, outline: 'none' }} />
                <Cell fill="rgba(255,255,255,0.03)" style={{ outline: 'none' }} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Value overlay at center bottom of the gauge */}
        <div className="text-center mt-3 z-10">
          <span className="text-3xl font-extrabold tracking-tight text-white block">
            <AnimatedCounter value={value} suffix="%" />
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">
            Target: 80%+
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/[0.03] pt-3 flex items-center justify-between text-[10px] text-slate-500 font-semibold relative z-10">
        <span>Autonomous Agents Active</span>
        <span className="text-emerald-400 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Optimal Performance
        </span>
      </div>
    </div>
  );
}

export default AIHandledGauge;
