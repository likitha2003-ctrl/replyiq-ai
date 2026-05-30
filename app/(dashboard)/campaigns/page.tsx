'use client';

import React, { useState } from 'react';
import { 
  Megaphone, Plus, CheckCircle2, Clock, Send, Calendar as CalendarIcon, 
  X, Smartphone, Sparkles, UserCheck, Target, Zap, Users, BarChart2, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaignStore, Campaign, CampaignStatus } from '../../../store/campaignStore';

function CampaignBuilderModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { addCampaign } = useCampaignStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('New Campaign');
  
  // Step 1: Message
  const [message, setMessage] = useState('Hi {{customer_name}},\n\nWe noticed you might be interested in our {{offer}}. Reply YES if you want to learn more!');
  const charLimit = 1024;

  // Step 2: Audience
  const [audience, setAudience] = useState('Hot leads');
  const [excludeReplied, setExcludeReplied] = useState(false);
  const audienceOptions = [
    { id: 'All contacts', size: 1200 },
    { id: 'Hot leads', size: 147 },
    { id: 'At-risk (Churn Shield)', size: 42 },
    { id: 'Custom tag', size: 85 },
  ];
  const selectedAudienceObj = audienceOptions.find(a => a.id === audience);
  let estSize = selectedAudienceObj?.size || 0;
  if (excludeReplied) estSize = Math.floor(estSize * 0.85);

  // Step 3: Schedule
  const [scheduleType, setScheduleType] = useState<'Now' | 'Schedule'>('Now');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Step 4: Launch
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState(false);

  const insertVariable = (v: string) => {
    setMessage(prev => prev + `{{${v}}}`);
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setLaunchSuccess(true);
      
      const newCampaign: Campaign = {
        id: `c-${Date.now()}`,
        name,
        status: scheduleType === 'Now' ? 'active' : 'scheduled',
        channel: 'WhatsApp',
        audience,
        audienceSize: estSize,
        sent: scheduleType === 'Now' ? estSize : 0,
        delivered: scheduleType === 'Now' ? Math.floor(estSize * 0.98) : 0,
        replied: 0,
        dateSent: scheduleType === 'Now' ? new Date().toISOString() : new Date(`${date}T${time}`).toISOString(),
        openRate: scheduleType === 'Now' ? 85 : undefined,
        replyRate: 0
      };

      addCampaign(newCampaign);

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setStep(1);
          setLaunchSuccess(false);
          setMessage('Hi {{customer_name}},\n\nWe noticed you might be interested in our {{offer}}. Reply YES if you want to learn more!');
        }, 500);
      }, 2000);
    }, 2500);
  };

  const parseWhatsAppFormatting = (text: string) => {
    return text
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-[1000px] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-zinc-900 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <Megaphone className="text-violet-400" size={20} />
            </div>
            <div>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="text-lg font-bold text-white bg-transparent border-none outline-none hover:bg-white/5 px-2 py-1 rounded-md transition-colors"
              />
              <div className="flex items-center gap-2 mt-1 px-2 text-xs text-zinc-400">
                <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-violet-500' : 'bg-zinc-700'}`} /> Step 1
                <span className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-violet-500' : 'bg-zinc-700'}`} /> Step 2
                <span className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-violet-500' : 'bg-zinc-700'}`} /> Step 3
                <span className={`w-2 h-2 rounded-full ${step === 4 ? 'bg-violet-500' : 'bg-zinc-700'}`} /> Step 4
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: MESSAGE */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Message Template</h3>
                    <p className="text-sm text-zinc-400">Draft your broadcast message. WhatsApp formatting is supported.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-400 uppercase">Insert Variables:</span>
                      {['customer_name', 'business_name', 'offer'].map(v => (
                        <button key={v} onClick={() => insertVariable(v)} className="px-2 py-1 rounded border border-white/10 bg-zinc-800 text-[10px] text-zinc-300 hover:bg-zinc-700 transition-colors">
                          {`{{${v}}}`}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, charLimit))}
                        className="w-full h-[240px] bg-zinc-950/80 border border-white/10 rounded-xl p-4 text-sm text-white resize-none focus:outline-none focus:border-violet-500 transition-colors font-mono"
                        placeholder="Type your message here..."
                      />
                      <div className="absolute bottom-3 right-4 text-[10px] font-bold text-zinc-500">
                        {message.length} / {charLimit}
                      </div>
                    </div>

                    <div className="flex gap-4 text-[10px] text-zinc-500">
                      <span><strong className="text-zinc-300">*bold*</strong></span>
                      <span><em className="text-zinc-300">_italic_</em></span>
                      <span>~strikethrough~</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: AUDIENCE */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Audience Targeting</h3>
                    <p className="text-sm text-zinc-400">Select which segment receives this campaign.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {audienceOptions.map(aud => (
                      <button 
                        key={aud.id}
                        onClick={() => setAudience(aud.id)}
                        className={`p-5 rounded-xl border flex flex-col gap-2 transition-all text-left ${audience === aud.id ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'border-white/10 bg-zinc-950/50 hover:bg-zinc-900'}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`font-semibold ${audience === aud.id ? 'text-white' : 'text-zinc-300'}`}>{aud.id}</span>
                          <Users size={16} className={audience === aud.id ? 'text-violet-400' : 'text-zinc-600'} />
                        </div>
                        <span className="text-xs text-zinc-500">~{aud.size} contacts</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">Exclusion Filter</div>
                      <div className="text-xs text-zinc-400">Exclude customers who replied in the last 7 days</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={excludeReplied} onChange={e => setExcludeReplied(e.target.checked)} />
                      <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>

                  <div className="p-6 bg-zinc-950 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-400">Estimated Reach</span>
                    <div className="flex items-center gap-2">
                      <Target size={20} className="text-violet-400" />
                      <span className="text-2xl font-bold text-white">{estSize}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SCHEDULE */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Schedule</h3>
                    <p className="text-sm text-zinc-400">When should we dispatch these messages?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setScheduleType('Now')}
                      className={`p-5 rounded-xl border flex items-center gap-4 transition-all text-left ${scheduleType === 'Now' ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-zinc-950/50 hover:bg-zinc-900'}`}
                    >
                      <Zap size={24} className={scheduleType === 'Now' ? 'text-violet-400' : 'text-zinc-500'} />
                      <div>
                        <div className={`font-semibold ${scheduleType === 'Now' ? 'text-white' : 'text-zinc-300'}`}>Send Now</div>
                        <div className="text-xs text-zinc-500 mt-1">Dispatch immediately</div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setScheduleType('Schedule')}
                      className={`p-5 rounded-xl border flex items-center gap-4 transition-all text-left ${scheduleType === 'Schedule' ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-zinc-950/50 hover:bg-zinc-900'}`}
                    >
                      <CalendarIcon size={24} className={scheduleType === 'Schedule' ? 'text-violet-400' : 'text-zinc-500'} />
                      <div>
                        <div className={`font-semibold ${scheduleType === 'Schedule' ? 'text-white' : 'text-zinc-300'}`}>Schedule</div>
                        <div className="text-xs text-zinc-500 mt-1">Pick a date and time</div>
                      </div>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-start gap-3">
                    <Sparkles size={16} className="text-violet-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-1">Optimal Send Time</div>
                      <p className="text-sm text-violet-200/80">Our AI notes that <strong>Tuesdays 10–11 AM</strong> get 3× higher reply rates for the "{audience}" segment.</p>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {scheduleType === 'Schedule' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                        <div className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-zinc-950/50 border border-white/5">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-violet-500 [color-scheme:dark]" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase">Time</label>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-violet-500 [color-scheme:dark]" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* STEP 4: CONFIRM */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex flex-col h-full items-center justify-center text-center">
                  {launchSuccess ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <CheckCircle2 size={40} className="text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Campaign Live!</h3>
                        <p className="text-zinc-400 mt-2">Sent to {estSize} contacts.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-white mb-2">Ready to Launch?</h3>
                      <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl w-full max-w-md mx-auto text-left space-y-4 mb-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                          <span className="text-sm text-zinc-400">Campaign Name</span>
                          <span className="text-sm font-bold text-white">{name}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                          <span className="text-sm text-zinc-400">Target Audience</span>
                          <span className="text-sm font-bold text-white">{audience} ({estSize})</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-zinc-400">Schedule</span>
                          <span className="text-sm font-bold text-white">{scheduleType === 'Now' ? 'Immediate' : `${date} at ${time}`}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleLaunch}
                        disabled={isLaunching}
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-zinc-500 hover:from-violet-500 hover:to-zinc-400 text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center gap-3 disabled:opacity-50 min-w-[240px] justify-center"
                      >
                        {isLaunching ? (
                          <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending...</>
                        ) : (
                          <><Send size={20} /> Launch Campaign</>
                        )}
                      </button>
                      
                      {isLaunching && (
                        <div className="w-full max-w-xs mx-auto mt-6">
                          <div className="flex justify-between text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-wider">
                            <span>Processing...</span>
                            <span>{estSize} queued</span>
                          </div>
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2.2, ease: "easeOut" }}
                              className="h-full bg-violet-500"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Preview Area */}
          <div className="w-[340px] border-l border-white/5 bg-zinc-900/50 p-6 flex flex-col shrink-0">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Smartphone size={14} /> WhatsApp Preview
            </h4>

            <div className="bg-[#0b141a] rounded-[2rem] border-[6px] border-zinc-800 flex-1 overflow-hidden shadow-2xl flex flex-col relative">
              {/* WhatsApp Header Mock */}
              <div className="bg-[#202c33] p-3 flex items-center gap-3 shrink-0 z-10 border-b border-white/[0.02]">
                <div className="w-8 h-8 rounded-full bg-zinc-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white leading-tight">Alex (Customer)</span>
                  <span className="text-[10px] text-zinc-400">WhatsApp Business</span>
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="flex-1 p-4 bg-[#0b141a] bg-opacity-90 relative overflow-y-auto">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                <div className="relative z-10 bg-[#005c4b] text-[#e9edef] text-sm p-3 rounded-xl rounded-tr-none shadow-sm max-w-[90%] ml-auto mb-2">
                  <div dangerouslySetInnerHTML={{ 
                    __html: parseWhatsAppFormatting(
                      message
                        .replace('{{customer_name}}', 'Alex')
                        .replace('{{business_name}}', 'Acme Corp')
                        .replace('{{offer}}', '20% off Pro Plan')
                    ) 
                  }} />
                  <div className="text-[10px] text-[#8696a0] text-right mt-1.5 flex items-center justify-end gap-1">
                    10:42 AM <CheckCircle2 size={12} className="text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        {!launchSuccess && (
          <div className="p-4 border-t border-white/5 bg-zinc-900 flex justify-between shrink-0">
            <button 
              onClick={() => step > 1 && setStep(step - 1)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              Back
            </button>
            
            {step < 4 && (
              <button 
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-white text-zinc-900 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-lg"
              >
                Next Step
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function CampaignsPage() {
  const { campaigns } = useCampaignStore();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0);
  const avgReplyRate = campaigns.length 
    ? (campaigns.reduce((acc, c) => acc + (c.replyRate || 0), 0) / campaigns.length).toFixed(1) 
    : 0;

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2 font-heading">
            <Megaphone className="text-violet-500" size={32} />
            Broadcast Campaigns
          </h1>
          <p className="text-zinc-400">Design, target, and dispatch bulk messages over WhatsApp and SMS.</p>
        </div>
        
        <button 
          onClick={() => setIsBuilderOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-zinc-500 hover:from-violet-500 hover:to-zinc-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all shrink-0"
        >
          <Plus size={18} />
          New Campaign
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        {[
          { label: 'Total Campaigns', value: campaigns.length, icon: BarChart2 },
          { label: 'Messages Sent', value: totalSent, icon: Send },
          { label: 'Avg Reply Rate', value: `${avgReplyRate}%`, icon: MessageSquare },
          { label: 'Active Broadcasts', value: campaigns.filter(c => c.status === 'active').length, icon: Zap }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <stat.icon size={14} className="text-violet-400" /> {stat.label}
            </span>
            <span className="text-3xl font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Audience</th>
                <th className="px-6 py-4">Date Sent</th>
                <th className="px-6 py-4">Open Rate</th>
                <th className="px-6 py-4">Reply Rate</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {campaigns.map(c => {
                const isSent = c.status === 'completed' || c.status === 'active';
                const openR = c.openRate ?? Math.floor((c.delivered / (c.sent || 1)) * 100);
                const replyR = c.replyRate ?? Math.floor((c.replied / (c.sent || 1)) * 100);

                return (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-300">{c.audience}</div>
                      <div className="text-[10px] text-zinc-500">{c.audienceSize} contacts</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                      {new Date(c.dateSent).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          {isSent && <div className="h-full bg-blue-500" style={{ width: `${openR}%` }} />}
                        </div>
                        <span className="text-xs text-zinc-300">{isSent ? `${openR}%` : '--'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          {isSent && <div className="h-full bg-emerald-500" style={{ width: `${replyR}%` }} />}
                        </div>
                        <span className="text-xs text-zinc-300">{isSent ? `${replyR}%` : '--'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border
                        ${c.status === 'active' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 
                          c.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'}
                      `}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CampaignBuilderModal isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)} />
    </div>
  );
}
