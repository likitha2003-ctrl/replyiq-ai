'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeads } from '../../lib/hooks/useLeads';
import { Lead } from '../../types';
import { formatCurrency } from '../../lib/utils';
import LeadCard from './LeadCard';

type ColumnStatus = Lead['status'];

interface ColumnConfig {
  id: ColumnStatus;
  title: string;
  emoji: string;
  dotColor: string;
  borderGlow: string;
}

export function LeadKanban() {
  const { leads, leadsByStatus, updateLeadStatus } = useLeads();
  const [draggedOverCol, setDraggedOverCol] = useState<ColumnStatus | null>(null);

  const columns: ColumnConfig[] = [
    {
      id: 'new',
      title: 'New',
      emoji: '🆕',
      dotColor: 'bg-violet-400 shadow-violet-400/50',
      borderGlow: 'border-violet-500',
    },
    {
      id: 'contacted',
      title: 'Contacted',
      emoji: '📞',
      dotColor: 'bg-blue-400 shadow-blue-400/50',
      borderGlow: 'border-blue-500',
    },
    {
      id: 'qualified',
      title: 'Qualified',
      emoji: '⭐',
      dotColor: 'bg-amber-400 shadow-amber-400/50',
      borderGlow: 'border-amber-500',
    },
    {
      id: 'won',
      title: 'Converted',
      emoji: '🎉',
      dotColor: 'bg-emerald-400 shadow-emerald-400/50',
      borderGlow: 'border-emerald-500',
    },
    {
      id: 'lost',
      title: 'Lost',
      emoji: '❌',
      dotColor: 'bg-rose-400 shadow-rose-400/50',
      borderGlow: 'border-rose-500',
    },
  ];

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: ColumnStatus) => {
    e.preventDefault();
    setDraggedOverCol(colId);
  };

  const handleDragLeave = () => {
    setDraggedOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ColumnStatus) => {
    e.preventDefault();
    setDraggedOverCol(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      updateLeadStatus(leadId, targetStatus);
    }
  };

  const getColTotalValue = (colLeads: Lead[]) => {
    return colLeads.reduce((sum, l) => sum + l.dealValue, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full items-start overflow-x-auto pb-4">
      {columns.map((col) => {
        const colLeads = leadsByStatus[col.id] || [];
        const isDraggedOver = draggedOverCol === col.id;
        const totalValue = getColTotalValue(colLeads);

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col rounded-2xl border transition-all duration-300 min-h-[420px] w-full max-h-[75vh] overflow-hidden ${
              isDraggedOver
                ? `${col.borderGlow} bg-white/[0.02] shadow-2xl scale-[1.01]`
                : 'border-white/[0.04] bg-slate-950/30'
            }`}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-white/[0.04] flex items-center justify-between shrink-0 bg-slate-950/50">
              <div className="flex items-center gap-2">
                <span className="text-sm">{col.emoji}</span>
                <span className="text-xs font-bold text-white tracking-wide">{col.title}</span>
                <motion.span
                  key={colLeads.length}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-slate-400 px-2 py-0.5 rounded-full font-bold"
                >
                  {colLeads.length}
                </motion.span>
              </div>
              
              <span className="text-[10px] font-bold text-slate-500">
                {formatCurrency(totalValue)}
              </span>
            </div>

            {/* Cards Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {colLeads.length === 0 ? (
                <div className="h-28 border border-dashed border-white/[0.06] rounded-xl flex flex-col items-center justify-center text-slate-600 text-[10px]">
                  <span>Drag deals here</span>
                </div>
              ) : (
                colLeads.map((lead, i) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onDragStart={handleDragStart}
                    index={i}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LeadKanban;
