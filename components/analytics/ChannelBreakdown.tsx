'use client';

import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import AnimatedCounter from '../shared/AnimatedCounter';

interface ChannelBreakdownProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export function ChannelBreakdown({ data }: ChannelBreakdownProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 4}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="w-full h-80 rounded-2xl border border-white/[0.04] bg-zinc-950/20 backdrop-blur-xl p-5 relative overflow-hidden flex flex-col">
      <div>
        <h3 className="text-xs font-bold text-white tracking-wide">Channel Breakdown</h3>
        <span className="text-[10px] text-zinc-500 block mt-0.5">Distribution of support requests across channels.</span>
      </div>

      <div className="flex-1 flex items-center justify-between min-h-0 mt-4">
        {/* Donut Container */}
        <div className="w-[50%] h-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                {...({
                  activeIndex: activeIndex !== null ? activeIndex : undefined,
                  activeShape: renderActiveShape
                } as any)}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={75}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                isAnimationActive={true}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Total</span>
            <span className="text-lg font-extrabold text-white mt-0.5 leading-none">
              <AnimatedCounter value={totalValue} />
            </span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="w-[45%] flex flex-col justify-center space-y-3.5 pr-2">
          {data.map((item, index) => {
            const percentage = ((item.value / totalValue) * 100).toFixed(0);
            const isHovered = activeIndex === index;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex flex-col p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? 'bg-white/[0.02]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-zinc-400 capitalize">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-white">{percentage}%</span>
                </div>
                <span className="text-[9px] text-zinc-500 font-semibold mt-0.5 pl-4">
                  {item.value.toLocaleString()} messages
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChannelBreakdown;
