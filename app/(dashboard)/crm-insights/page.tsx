'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, Sparkles, X, Send, ArrowRight, TrendingUp, TrendingDown, 
  Minus, AlertTriangle, CheckCircle2, Search, ArrowUpRight, MessageSquare
} from 'lucide-react';
import { useToast } from '../../../components/shared/ToastProvider';

// --- SEED DATA ---
const nextBestActions = [
  { id: 'nba1', name: 'Raj Patel', company: 'Acme Corp', avatar: 'R', lastInteraction: 'Viewed pricing page 3× today', actionText: 'Send personalized pricing proposal', priority: 'HIGH', context: 'Raj Patel viewed the pricing page 3 times today.' },
  { id: 'nba2', name: 'Aisha Khan', company: 'Nexus Tech', avatar: 'A', lastInteraction: 'Enterprise inquiry, 5-day silence', actionText: 'Schedule product demo', priority: 'HIGH', context: 'Aisha Khan submitted an enterprise inquiry but has been silent for 5 days.' },
  { id: 'nba3', name: 'Carlos Mendez', company: 'Global Logistics', avatar: 'C', lastInteraction: 'Trial expires in 2 days, low usage', actionText: 'Offer free trial extension', priority: 'MEDIUM', context: 'Carlos Mendez has a trial expiring in 2 days with low usage.' },
  { id: 'nba4', name: 'David Kim', company: 'StartUp Inc', avatar: 'D', lastInteraction: 'Mentioned budget constraints', actionText: 'Send ROI case study', priority: 'LOW', context: 'David Kim mentioned budget constraints on the last call.' },
];

const dealStages = [
  { id: 's1', name: 'Discovery', count: 12, value: '$45,000', insight: '4 new leads added this week.' },
  { id: 's2', name: 'Qualified', count: 8, value: '$62,000', insight: '2 deals have missing contact info.' },
  { id: 's3', name: 'Proposal', count: 5, value: '$110,000', insight: '3 deals stuck in Proposal for 7+ days — suggest follow-up.', actionContext: 'Follow up with 3 prospects stuck in the Proposal stage for over a week.' },
  { id: 's4', name: 'Closing', count: 3, value: '$85,000', insight: '2 deals ready to close — price objection detected.', actionContext: 'Overcome price objections for 2 deals in the closing stage to secure the win.' },
];

const relationshipScores = [
  { id: 'r1', name: 'Sarah Jenkins', company: 'Bright Future', lastReply: '2 hours ago', trend: 'up', score: 92, risk: 'Healthy' },
  { id: 'r2', name: 'Emma Thompson', company: 'Innovate LLC', lastReply: '1 day ago', trend: 'flat', score: 85, risk: 'Healthy' },
  { id: 'r3', name: 'Michael Chen', company: 'TechWorks', lastReply: '5 days ago', trend: 'down', score: 62, risk: 'At risk', context: 'Michael Chen has not replied in 5 days and engagement is dropping.' },
  { id: 'r4', name: 'James Wilson', company: 'Alpha Group', lastReply: '2 weeks ago', trend: 'down', score: 41, risk: 'Cold', context: 'James Wilson has been completely silent for 2 weeks.' },
  { id: 'r5', name: 'Priya Sharma', company: 'DataSync', lastReply: '1 hour ago', trend: 'up', score: 96, risk: 'Healthy' },
  { id: 'r6', name: 'Marco Rossi', company: 'Vento', lastReply: '4 days ago', trend: 'flat', score: 70, risk: 'At risk', context: 'Marco Rossi replied 4 days ago but seems hesitant.' },
  { id: 'r7', name: 'Amanda Cole', company: 'Cole Media', lastReply: '1 month ago', trend: 'down', score: 25, risk: 'Cold', context: 'Amanda Cole is a lost prospect from last month.' },
  { id: 'r8', name: 'Lucas Gray', company: 'Apex', lastReply: '3 hours ago', trend: 'up', score: 88, risk: 'Healthy' },
];

export default function CRMInsightsPage() {
  const { toast } = useToast();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Action Cards State
  const [visibleActions, setVisibleActions] = useState(nextBestActions);

  const openDraftModal = async (type: 'next_action' | 'stage_outreach' | 're_engage', context: string, targetName: string) => {
    setIsModalOpen(true);
    setModalTitle(`Drafting Message for ${targetName}`);
    setDraftMessage('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/crm-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context })
      });
      const data = await res.json();
      if (data.message) {
        setDraftMessage(data.message);
      }
    } catch (e) {
      toast({ type: 'error', title: 'Generation Failed', description: 'Could not generate message at this time.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const dismissAction = (id: string) => {
    setVisibleActions(prev => prev.filter(a => a.id !== id));
  };

  const sendDraft = () => {
    setIsModalOpen(false);
    toast({ type: 'system', title: 'Message Sent', description: 'Your outreach has been dispatched successfully.' });
  };

  const getPriorityStyle = (p: string) => {
    if (p === 'HIGH') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    if (p === 'MEDIUM') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  };

  const getTrendIcon = (t: string) => {
    if (t === 'up') return <TrendingUp size={14} className="text-emerald-400" />;
    if (t === 'down') return <TrendingDown size={14} className="text-rose-400" />;
    return <Minus size={14} className="text-zinc-400" />;
  };

  const getRiskStyle = (r: string) => {
    if (r === 'Healthy') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (r === 'At risk') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  };

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 overflow-y-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2 font-heading">
            <Lightbulb className="text-amber-500" size={32} />
            CRM Insights
          </h1>
          <p className="text-zinc-400">AI-driven actionable intelligence across your entire customer pipeline.</p>
        </div>
      </div>

      {/* SECTION 1: NEXT BEST ACTION CARDS */}
      <div className="space-y-4 shrink-0">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" /> Next Best Actions
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence>
            {visibleActions.length === 0 && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-zinc-500 italic p-4">You're all caught up!</motion.div>
            )}
            {visibleActions.map(action => (
              <motion.div 
                key={action.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 min-w-[320px] max-w-[350px] flex flex-col shrink-0 relative group shadow-sm hover:border-amber-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center font-bold text-zinc-300">
                      {action.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{action.name}</h3>
                      <p className="text-[10px] text-zinc-400">{action.company}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${getPriorityStyle(action.priority)}`}>
                    {action.priority}
                  </span>
                </div>
                
                <div className="flex-1 space-y-3 mb-4">
                  <div>
                    <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Last Interaction</div>
                    <p className="text-xs text-zinc-300">{action.lastInteraction}</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl relative">
                    <Sparkles size={12} className="text-amber-400 absolute top-3 right-3" />
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">AI Recommendation</div>
                    <p className="text-xs font-semibold text-amber-100">{action.actionText}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button onClick={() => dismissAction(action.id)} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-400 transition-colors">Not now</button>
                  <button onClick={() => openDraftModal('next_action', action.context, action.name)} className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors">Take Action</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: DEAL STAGE INTELLIGENCE */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex flex-col overflow-hidden shrink-0">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-6">
          <TrendingUp size={16} className="text-blue-400" /> Pipeline Intelligence
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {dealStages.map((stage, idx) => (
            <div key={stage.id} className="relative">
              <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-5 h-full flex flex-col relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-zinc-300">{stage.name}</h3>
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold flex items-center justify-center border border-blue-500/20">
                    {stage.count}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-4">{stage.value}</div>
                
                <div className="mt-auto p-3 bg-zinc-900 rounded-xl border border-white/5">
                  <div className="flex items-start gap-2 text-xs text-zinc-400 mb-3">
                    <Sparkles size={12} className="text-blue-400 shrink-0 mt-0.5" />
                    <span>{stage.insight}</span>
                  </div>
                  {stage.actionContext && (
                    <button 
                      onClick={() => openDraftModal('stage_outreach', stage.actionContext, `${stage.name} Stage Prospects`)}
                      className="w-full py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Generate Outreach
                    </button>
                  )}
                </div>
              </div>
              {/* Arrow connector for pipeline */}
              {idx < dealStages.length - 1 && (
                <div className="hidden xl:block absolute top-1/2 -right-4 z-20 text-zinc-700 -translate-y-1/2">
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: AI RELATIONSHIP SCORE */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-zinc-900/60">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" /> Relationship Health Score
          </h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input type="text" placeholder="Search contacts..." className="bg-zinc-950 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Last Reply</th>
                <th className="px-6 py-4">Trend</th>
                <th className="px-6 py-4">Engagement Score</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {relationshipScores.map(score => (
                <tr key={score.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-white">{score.name}</div>
                    <div className="text-[10px] text-zinc-500">{score.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                    {score.lastReply}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(score.trend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500" style={{ width: `${score.score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-zinc-300">{score.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${getRiskStyle(score.risk)}`}>
                      {score.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {score.context ? (
                      <button 
                        onClick={() => openDraftModal('re_engage', score.context!, score.name)}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ml-auto"
                      >
                        <Sparkles size={12} className="text-violet-400" /> Re-engage
                      </button>
                    ) : (
                      <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">No Action Needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAFT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-zinc-900 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <MessageSquare size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{modalTitle}</h3>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">AI Generated Draft</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-400">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                    <p className="text-sm font-bold text-violet-400 animate-pulse">Consulting AI Brain...</p>
                  </div>
                ) : (
                  <textarea 
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    className="w-full h-48 bg-zinc-950/80 border border-white/10 rounded-xl p-4 text-sm text-white resize-none focus:outline-none focus:border-violet-500 transition-colors"
                  />
                )}
              </div>

              <div className="p-5 border-t border-white/5 bg-zinc-900 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={sendDraft}
                  disabled={isGenerating || !draftMessage}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-zinc-600 hover:from-violet-500 hover:to-zinc-500 text-white text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} /> Send Outreach
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
