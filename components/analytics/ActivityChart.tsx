'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ActivityChartProps {
  data: {
    day: string;
    total: number;
    aiHandled: number;
  }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="w-full h-80 rounded-2xl border border-white/[0.04] bg-slate-950/20 backdrop-blur-xl p-5 relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide">Daily Support Activity</h3>
          <span className="text-[10px] text-slate-500 block mt-0.5">Total inbound traffic vs conversations handled fully by AI autopilot.</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-slate-400">Total Queries</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">AI Autopilot</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis
              dataKey="day"
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
                      <span className="text-[10px] font-bold text-slate-500 block mb-1.5">{payload[0].payload.day}</span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-4 justify-between text-[11px] font-semibold">
                          <span className="text-slate-400">Total queries</span>
                          <span className="text-white font-bold">{payload[0].value}</span>
                        </div>
                        <div className="flex items-center gap-4 justify-between text-[11px] font-semibold">
                          <span className="text-slate-400">AI Handled</span>
                          <span className="text-emerald-400 font-bold">{payload[1].value}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="aiHandled"
              stroke="#34d399"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAI)"
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ActivityChart;
