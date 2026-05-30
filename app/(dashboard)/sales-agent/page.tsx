'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Settings2, Sparkles, Zap, MessageSquare, Clock, PhoneCall, Mail, AlertTriangle, Play, X, User, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useToast } from '../../../components/shared/ToastProvider';

interface ActivityRecord {
  id: string;
  type: 'reply' | 'escalation' | 'appointment' | 'followup';
  text: string;
  contact: string;
  channel: 'whatsapp' | 'email' | 'sms';
  timeAgo: string;
}

const recentActivity: ActivityRecord[] = [
  { id: '1', type: 'reply', text: 'Replied to Raj Patel — pricing inquiry', contact: 'Raj Patel', channel: 'whatsapp', timeAgo: '2m ago' },
  { id: '2', type: 'escalation', text: 'Escalated Aisha Khan to human — complex negotiation', contact: 'Aisha Khan', channel: 'email', timeAgo: '5m ago' },
  { id: '3', type: 'appointment', text: 'Booked appointment for Carlos Mendez', contact: 'Carlos Mendez', channel: 'whatsapp', timeAgo: '12m ago' },
  { id: '4', type: 'followup', text: 'Sent follow-up to David Kim — no reply 24h', contact: 'David Kim', channel: 'sms', timeAgo: '18m ago' },
  { id: '5', type: 'reply', text: 'Replied to Sarah Jenkins — feature question', contact: 'Sarah Jenkins', channel: 'whatsapp', timeAgo: '25m ago' },
  { id: '6', type: 'appointment', text: 'Booked appointment for James Wilson', contact: 'James Wilson', channel: 'whatsapp', timeAgo: '35m ago' },
  { id: '7', type: 'reply', text: 'Replied to Emma Thompson — trial extension', contact: 'Emma Thompson', channel: 'email', timeAgo: '41m ago' },
  { id: '8', type: 'followup', text: 'Sent follow-up to Marco Rossi — post-demo', contact: 'Marco Rossi', channel: 'email', timeAgo: '1h ago' },
  { id: '9', type: 'escalation', text: 'Escalated Amanda Cole to human — technical issue', contact: 'Amanda Cole', channel: 'sms', timeAgo: '1h 15m ago' },
  { id: '10', type: 'reply', text: 'Replied to Priya Sharma — pricing inquiry', contact: 'Priya Sharma', channel: 'whatsapp', timeAgo: '1h 45m ago' },
];

export default function SalesAgentPage() {
  const { toast } = useToast();
  
  // Status State
  const [isAgentActive, setIsAgentActive] = useState(true);

  // Config State
  const [persona, setPersona] = useState('Alex from Spice Garden');
  const [tone, setTone] = useState('Friendly');
  const [escalationRules, setEscalationRules] = useState('Escalate if sentiment = negative for 2+ messages');
  const [useFAQ, setUseFAQ] = useState(true);
  const [autoAppointment, setAutoAppointment] = useState(true);

  // Demo Modal State
  const [showDemo, setShowDemo] = useState(false);
  const [demoInput, setDemoInput] = useState('');
  const [demoChat, setDemoChat] = useState<{role: 'user' | 'agent', content: string, isError?: boolean}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [demoChat, isTyping]);

  const handleToggleAgent = () => {
    setIsAgentActive(!isAgentActive);
    toast({
      type: 'system',
      title: isAgentActive ? 'Agent Paused' : 'Agent Active',
      description: isAgentActive ? 'Autonomous handling disabled.' : 'Agent is now handling conversations autonomously.',
    });
  };

  async function sendMessageToAgent(userMessage: string, personaName: string, toneOfVoice: string) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const fallbackResponses = [
      "I'd be happy to help you with that! Are you looking for more details on our packages or pricing?",
      "That sounds great! Our standard packages start at ₹850 per person. Does that fit your budget?",
      "Perfect. I can definitely assist with that. Could you share the date and number of guests for your event?",
      "Got it! I've noted that down. Would you like to schedule a quick 10-minute consultation call with our team?",
      "Absolutely. We can customize our menu to fit your exact needs. Any specific dietary requirements?"
    ];
    
    // Pick a pseudo-random fallback response based on the message length to make it feel dynamic
    const fallbackResponse = fallbackResponses[userMessage.length % fallbackResponses.length];
    
    if (!apiKey || apiKey === 'undefined') {
      return fallbackResponse;
    }
    
    const systemPrompt = `You are ${personaName}, an AI sales agent for Spice Garden, a premium catering business. 
    Your tone is ${toneOfVoice}. You help customers with catering inquiries, bookings, pricing, and menu questions.
    Keep responses concise (2-3 sentences max). Be helpful and guide toward booking a consultation.
    Never break character. If asked about pricing, mention packages start from ₹850 per person.`;
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: systemPrompt + '\n\nCustomer: ' + userMessage }] }
            ],
            generationConfig: { maxOutputTokens: 150, temperature: 0.7 }
          })
        }
      );
    
      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return fallbackResponse;
      }
    } catch (e) {
      return fallbackResponse;
    }
  }

  const handleTestAgent = async (e?: React.FormEvent, retryMessage?: string) => {
    if (e) e.preventDefault();
    const userMessage = retryMessage || demoInput;
    if (!userMessage.trim()) return;

    if (!retryMessage) {
      setDemoInput('');
      setDemoChat(prev => [...prev, { role: 'user', content: userMessage }]);
    } else {
      setDemoChat(prev => prev.filter(m => !m.isError));
    }
    
    setIsTyping(true);

    try {
      // 500ms "typing..." animation
      await new Promise(resolve => setTimeout(resolve, 500));

      const responseText = await sendMessageToAgent(userMessage, persona, tone);
      setDemoChat(prev => [...prev, { role: 'agent', content: responseText }]);
    } catch (err) {
      setDemoChat(prev => [...prev, { 
        role: 'agent', 
        content: "I'm having a moment — let me try that again.", 
        isError: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getChannelIcon = (c: string) => {
    switch(c) {
      case 'whatsapp': return <PhoneCall size={12} className="text-emerald-400" />;
      case 'sms': return <MessageSquare size={12} className="text-cyan-400" />;
      default: return <Mail size={12} className="text-blue-400" />;
    }
  };

  const getTypeStyle = (t: string) => {
    switch(t) {
      case 'escalation': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'appointment': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'followup': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 overflow-y-auto space-y-6">
      
      {/* SECTION 1: AGENT STATUS CARD */}
      <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-600/10 to-transparent pointer-events-none rounded-bl-[100px]" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex items-start gap-5">
            <div className={`p-4 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isAgentActive ? 'bg-violet-600/20 border border-violet-500/30 shadow-violet-500/20' : 'bg-zinc-800 border border-zinc-700'}`}>
              <Bot size={36} className={isAgentActive ? 'text-violet-400' : 'text-zinc-500'} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-white font-heading">AI Sales Agent</h1>
                <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border
                  ${isAgentActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}
                `}>
                  {isAgentActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  {isAgentActive ? 'Active' : 'Paused'}
                </div>
              </div>
              <p className="text-zinc-400 mt-2 text-sm max-w-lg">
                {isAgentActive ? 'Agent is currently handling 3 conversations autonomously.' : 'Agent is standing by. Turn on to resume autonomous handling.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 shrink-0">
            <label className="relative inline-flex items-center cursor-pointer">
              <span className="text-sm font-bold text-zinc-400 mr-3 uppercase tracking-wider">Master Switch</span>
              <input type="checkbox" className="sr-only peer" checked={isAgentActive} onChange={handleToggleAgent} />
              <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500 shadow-inner"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 relative z-10 border-t border-white/5 pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><MessageSquare size={12}/> Handled Today</span>
            <span className="text-2xl font-bold text-white">142</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Clock size={12}/> Avg Response Time</span>
            <span className="text-2xl font-bold text-white">1.2s</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Zap size={12}/> Deals Assisted</span>
            <span className="text-2xl font-bold text-white">8</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* SECTION 2: LIVE ACTIVITY FEED */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-zinc-900/60">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" /> Live Activity
            </h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Real-time</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative">
            <div className="absolute left-9 top-0 bottom-0 w-px bg-white/5 pointer-events-none" />
            
            {recentActivity.map((act) => (
              <motion.div 
                key={act.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 relative z-10 p-2 hover:bg-white/[0.02] rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center shrink-0 font-bold text-zinc-400 text-xs shadow-md">
                  {act.contact.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getTypeStyle(act.type)}`}>
                      {act.type}
                    </span>
                    <span className="text-xs text-zinc-300 font-medium">{act.text}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-zinc-500 font-medium">
                    <span className="flex items-center gap-1 capitalize">{getChannelIcon(act.channel)} {act.channel}</span>
                    <span>•</span>
                    <span>{act.timeAgo}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-violet-400 cursor-pointer hover:underline">
                      View conversation
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 3: AGENT CONFIGURATION */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-zinc-900/60">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={16} className="text-blue-400" /> Configuration
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">AI Persona Name</label>
                <input 
                  type="text" 
                  value={persona} 
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-950 text-sm text-white focus:border-blue-500/50 transition-colors shadow-inner" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tone of Voice</label>
                <select 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-950 text-sm text-white focus:border-blue-500/50 transition-colors shadow-inner"
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Concise</option>
                  <option>Persuasive</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Escalation Rules</label>
                <input 
                  type="text" 
                  value={escalationRules} 
                  onChange={(e) => setEscalationRules(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-950 text-sm text-white focus:border-blue-500/50 transition-colors shadow-inner" 
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer" onClick={() => setUseFAQ(!useFAQ)}>
                <div>
                  <div className="text-sm font-bold text-white">Use Business FAQ</div>
                  <div className="text-xs text-zinc-400">Agent references Knowledge Base for answers</div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${useFAQ ? 'bg-violet-500' : 'bg-zinc-700'}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${useFAQ ? 'translate-x-5' : ''}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer" onClick={() => setAutoAppointment(!autoAppointment)}>
                <div>
                  <div className="text-sm font-bold text-white">Auto-Appointment Scheduling</div>
                  <div className="text-xs text-zinc-400">Agent can book meetings directly into calendar</div>
                </div>
                <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${autoAppointment ? 'bg-violet-500' : 'bg-zinc-700'}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${autoAppointment ? 'translate-x-5' : ''}`} />
                </div>
              </div>
            </div>

          </div>
          
          <div className="p-5 border-t border-white/5 bg-zinc-900/60 shrink-0">
            <button 
              onClick={() => {
                setDemoChat([{ role: 'agent', content: "Hi! I'm Alex from Spice Garden. How can I help you today? Are you planning an upcoming event?" }]);
                setShowDemo(true);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Play size={16} /> Test Agent
            </button>
          </div>
        </div>
      </div>

      {/* DEMO CONVERSATION MODAL */}
      <AnimatePresence>
        {showDemo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowDemo(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900 shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <Bot size={20} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{persona}</h3>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowDemo(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-400">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Canvas */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#0a0f1d] flex flex-col gap-4 relative">
                <div className="text-center text-[10px] text-zinc-500 uppercase tracking-wider mb-2 font-bold bg-zinc-900/50 p-2 rounded-xl mx-auto border border-white/5">
                  Simulation started with current config
                </div>
                
                {demoChat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm
                      ${msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : msg.isError 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-tl-sm flex flex-col gap-2'
                          : 'bg-zinc-800 text-zinc-200 border border-white/5 rounded-tl-sm'}
                    `}>
                      {msg.content}
                      {msg.isError && (
                        <button 
                          onClick={() => {
                            const lastUserMessage = [...demoChat].reverse().find(m => m.role === 'user')?.content || '';
                            handleTestAgent(undefined, lastUserMessage);
                          }}
                          className="self-start px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded text-xs font-bold transition-colors"
                        >
                          [Retry]
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 border border-white/5 rounded-2xl rounded-tl-sm p-4 flex gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleTestAgent} className="p-3 border-t border-white/5 bg-zinc-900 flex gap-2 shrink-0">
                <input 
                  type="text"
                  value={demoInput}
                  onChange={e => setDemoInput(e.target.value)}
                  placeholder="Type a message to the agent..."
                  className="flex-1 bg-zinc-950 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  disabled={isTyping}
                />
                <button 
                  type="submit"
                  disabled={!demoInput.trim() || isTyping}
                  className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 flex items-center justify-center text-white transition-colors shrink-0"
                >
                  <Play size={16} className="ml-1" />
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
