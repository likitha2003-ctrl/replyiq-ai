'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface ResponseDistributionProps {
  data: {
    bucket: string;
    count: number;
    color: string;
    glowColor: string;
  }[];
}

export function ResponseDistribution({ data }: ResponseDistributionProps) {
  return (
    <div className="w-full h-80 rounded-2xl border border-white/[0.04] bg-slate-950/20 backdrop-blur-xl p-5 relative overflow-hidden flex flex-col justify-between">
      <div>
        <h3 className="text-xs font-bold text-white tracking-wide">Response Time Distribution</h3>
        <span className="text-[10px] text-slate-500 block mt-0.5">Average reply latency categorizations for all resolved queries.</span>
      </div>

      <div className="flex-1 min-h-0 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis
              dataKey="bucket"
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 border border-white/[0.08] bg-slate-950/80 backdrop-blur-xl rounded-xl shadow-2xl">
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">{payload[0].payload.bucket}</span>
                      <div className="flex items-center gap-4 justify-between text-[11px] font-semibold">
                        <span className="text-slate-400">Total Conversations</span>
                        <span className="text-white font-bold">{payload[0].value}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ filter: `drop-shadow(0 0 4px ${entry.color}30)`, outline: 'none' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ResponseDistribution;
