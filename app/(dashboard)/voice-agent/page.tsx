'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Play, Square, Settings2, Sparkles, PhoneCall, Volume2, Plus, 
  ChevronDown, Phone, PhoneOff, MicOff, Pause, Users, Calendar, ArrowRight, PlayCircle
} from 'lucide-react';
import { useToast } from '../../../components/shared/ToastProvider';

// Seed Data
const initialLogs = [
  { id: '1', contact: 'Raj Patel', duration: '04:12', outcome: 'Booked', channel: 'Outbound', time: '10 mins ago' },
  { id: '2', contact: 'Aisha Khan', duration: '01:45', outcome: 'Callback', channel: 'Inbound', time: '45 mins ago' },
  { id: '3', contact: 'Carlos Mendez', duration: '05:30', outcome: 'Interested', channel: 'Outbound', time: '2 hours ago' },
  { id: '4', contact: 'David Kim', duration: '00:45', outcome: 'Not Interested', channel: 'Outbound', time: '3 hours ago' },
  { id: '5', contact: 'Sarah Jenkins', duration: '03:20', outcome: 'Interested', channel: 'Inbound', time: 'Yesterday' },
  { id: '6', contact: 'Emma Thompson', duration: '06:15', outcome: 'Booked', channel: 'Outbound', time: 'Yesterday' },
];

export default function VoiceAgentPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState(initialLogs);
  const sequenceTimeouts = useRef<NodeJS.Timeout[]>([]);
  
  // Section 1: Voice Profile
  const [voiceStyle, setVoiceStyle] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Section 2: Call Simulator
  const [callState, setCallState] = useState<'idle' | 'calling' | 'active' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Section 3: Call Script
  const [scriptText, setScriptText] = useState('Hi {{customer_name}}, this is Alex from Spice Garden. I noticed you were looking at our catering menu. Do you have a quick minute to chat about your upcoming event?');
  const [isGenerating, setIsGenerating] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Handlers for Voice Profile
  const playSample = () => {
    if (!synth) return;
    
    if (isPlayingSample) {
      synth.cancel();
      setIsPlayingSample(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance("Hi there! I am Alex, your AI voice assistant. How can I help you today?");
    utterance.pitch = voiceStyle === 'Warm' ? 0.9 : voiceStyle === 'Energetic' ? 1.2 : 1;
    utterance.rate = voiceStyle === 'Energetic' ? 1.1 : 1;
    
    // Try to find a good voice
    const voices = synth.getVoices();
    const engVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google'));
    if (engVoice) utterance.voice = engVoice;

    utterance.onend = () => setIsPlayingSample(false);
    
    synth.speak(utterance);
    setIsPlayingSample(true);
  };

  // Handlers for Call Simulator
  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
        // Randomly toggle AI speaking state for realistic effect
        if (Math.random() > 0.7) setAiSpeaking(prev => !prev);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (callState === 'idle') setCallDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState]);

  const clearSequence = () => {
    sequenceTimeouts.current.forEach(clearTimeout);
    sequenceTimeouts.current = [];
  };

  const speakText = (text: string, onEnd?: () => void) => {
    if (!synth) return;
    if (synth.speaking) synth.cancel();
    
    let textToSpeak = text;
    // Basic template variable replacement for the demo
    textToSpeak = textToSpeak.replace('{{customer_name}}', 'James').replace('{{business_name}}', 'Spice Garden').replace('{{offer}}', 'catering');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.pitch = voiceStyle === 'Warm' ? 1.1 : voiceStyle === 'Energetic' ? 1.15 : 1.0;
    utterance.rate = voiceStyle === 'Warm' ? 0.85 : voiceStyle === 'Energetic' ? 1.05 : 0.9;
    
    const voices = synth.getVoices();
    const engVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google'));
    if (engVoice) utterance.voice = engVoice;

    if (onEnd) utterance.onend = onEnd;
    synth.speak(utterance);
  };

  const startDemoCall = () => {
    setCallState('calling');
    clearSequence();
    if (synth && synth.speaking) synth.cancel();

    sequenceTimeouts.current.push(setTimeout(() => {
      setCallState('active');
      setAiSpeaking(true);
      toast({ type: 'system', title: 'Call Connected', description: 'Simulated call with James Wilson has started.' });

      // Step 2a: 500ms delay then speak
      sequenceTimeouts.current.push(setTimeout(() => {
        speakText(scriptText, () => {
          // Step 2c: After greeting ends, switch to listening for 3 seconds
          setAiSpeaking(false);
          
          sequenceTimeouts.current.push(setTimeout(() => {
            // Step 2d: Speak follow-up
            setAiSpeaking(true);
            speakText("I can share our current packages and offers. Are you planning an event soon?", () => {
              setAiSpeaking(false);
              // Wait indefinitely for user to interact or manually end the call
            });
          }, 3000));
        });
      }, 500));

    }, 2000));
  };

  const endCallSequence = () => {
    if (synth && synth.speaking) synth.cancel();
    clearSequence();
    setCallState('ended');
    
    // Add to logs
    setLogs(prev => [
      { id: Date.now().toString(), contact: 'James Wilson', duration: formatTime(callDuration || 47), outcome: 'Interested', channel: 'Outbound', time: 'Just now' },
      ...prev
    ]);
  };

  const endCall = () => {
    endCallSequence();
    toast({ type: 'system', title: 'Call Ended', description: `Manual end. Duration: ${formatTime(callDuration)}` });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handlers for Script Builder
  const generateScript = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: 'Spice Garden', industry: 'Restaurant/Catering', objective: 'Follow up on a catering inquiry and book a tasting.' })
      });
      const data = await res.json();
      if (data.script) setScriptText(data.script);
    } catch (e) {
      toast({ type: 'error', title: 'Generation Failed', description: 'Could not generate script at this time.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const insertVar = (v: string) => setScriptText(prev => prev + ` {{${v}}}`);

  const getOutcomeStyle = (o: string) => {
    switch(o) {
      case 'Booked': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'Interested': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Callback': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 overflow-y-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2 font-heading">
            <Mic className="text-violet-500" size={32} />
            Voice Agent
          </h1>
          <p className="text-zinc-400">Configure and monitor your AI phone agent for inbound & outbound calls.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
        
        {/* SECTION 1: VOICE PROFILE CARD */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-600/10 to-transparent pointer-events-none rounded-bl-[100px]" />
          
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-white">Alex — Spice Garden Voice</h2>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Voice Active
                </div>
              </div>
              <p className="text-sm text-zinc-400">Standard American English · Female Persona</p>
            </div>
            
            <button 
              onClick={playSample}
              className={`p-3 rounded-xl border flex items-center justify-center transition-all ${isPlayingSample ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-zinc-800 border-white/10 text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
            >
              {isPlayingSample ? <Square size={18} className="fill-current" /> : <Play size={18} className="ml-0.5 fill-current" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 z-10 relative">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Voice Style</label>
              <div className="flex gap-2">
                {['Professional', 'Warm', 'Energetic'].map(s => (
                  <button 
                    key={s} onClick={() => setVoiceStyle(s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${voiceStyle === s ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' : 'bg-zinc-950/50 border-white/5 text-zinc-400 hover:bg-white/[0.02]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-zinc-950/50 border border-white/5 rounded-lg p-2 text-sm text-zinc-300 outline-none focus:border-violet-500/50">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish (ES)</option>
                <option>Hindi (IN)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: ACTIVE CALL SIMULATOR */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-zinc-950 pointer-events-none" />
          
          <div className="z-10 flex flex-col h-full items-center text-center">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider w-full text-left mb-4">Call Simulator</h3>
            
            {callState === 'idle' ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 shadow-inner">
                  <PhoneCall size={24} className="text-zinc-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Ready for Demo</h4>
                  <p className="text-xs text-zinc-400 mt-1">Click below to start a test call</p>
                </div>
                <button onClick={startDemoCall} className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
                  Start Demo Call
                </button>
              </div>
            ) : callState === 'ended' ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 w-full px-4">
                <h4 className="text-xl font-bold text-white mb-2">Call Summary</h4>
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 w-full text-left space-y-3 shadow-inner">
                  <div className="flex justify-between items-center"><span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Outcome</span> <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded tracking-wider">INTERESTED</span></div>
                  <div className="flex justify-between items-center"><span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Duration</span> <span className="text-white text-sm font-mono font-bold">{formatTime(callDuration)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Action</span> <span className="text-blue-400 text-xs font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">Follow-up scheduled</span></div>
                </div>
                <button onClick={() => setCallState('idle')} className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white rounded-full text-sm font-bold transition-all">
                  New Demo Call
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center w-full">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 p-0.5 mb-3 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-2xl font-bold text-white">JW</div>
                </div>
                <h4 className="text-xl font-bold text-white">James Wilson</h4>
                <p className="text-xs text-zinc-400">+1 (555) 019-2834</p>
                
                <div className="text-2xl font-mono text-white mt-4">{callState === 'calling' ? 'Calling...' : formatTime(callDuration)}</div>

                <div className="h-12 flex items-center justify-center gap-1 mt-6">
                  {callState === 'active' && !isOnHold ? (
                    Array.from({length: 5}).map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: aiSpeaking ? [8, 32, 12, 40, 16][i] : 4 }}
                        transition={{ repeat: Infinity, duration: 0.5 + (i*0.1), repeatType: 'reverse' }}
                        className={`w-1.5 rounded-full ${aiSpeaking ? 'bg-violet-400' : 'bg-zinc-600'}`}
                      />
                    ))
                  ) : (
                    <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{isOnHold ? 'On Hold' : 'Connecting'}</div>
                  )}
                </div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-2 h-4">
                  {callState === 'active' && !isOnHold && (aiSpeaking ? 'AI Speaking' : 'Listening...')}
                </div>

                <div className="mt-auto pt-6 grid grid-cols-4 w-full gap-2">
                  <button onClick={() => setIsMuted(!isMuted)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isMuted ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"><MicOff size={16}/></div>
                    <span className="text-[10px]">Mute</span>
                  </button>
                  <button onClick={() => setIsOnHold(!isOnHold)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isOnHold ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"><Pause size={16}/></div>
                    <span className="text-[10px]">Hold</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"><Users size={16}/></div>
                    <span className="text-[10px]">Transfer</span>
                  </button>
                  <button onClick={endCall} className="flex flex-col items-center gap-1 p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]"><PhoneOff size={16}/></div>
                    <span className="text-[10px]">End</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        
        {/* SECTION 3: CALL SCRIPT BUILDER */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-zinc-900/60">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={16} className="text-blue-400" /> Call Script & Instructions
            </h2>
            <button onClick={generateScript} disabled={isGenerating} className="text-xs font-bold bg-violet-600/20 text-violet-400 border border-violet-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-violet-600/30 transition-colors disabled:opacity-50">
              <Sparkles size={12} /> {isGenerating ? 'Generating...' : 'AI Generate'}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Opening Greeting</label>
                <div className="flex gap-2">
                  {['customer_name', 'offer', 'callback_time'].map(v => (
                    <button key={v} onClick={() => insertVar(v)} className="px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-300 hover:bg-zinc-700">{`{{${v}}}`}</button>
                  ))}
                </div>
              </div>
              <textarea 
                value={scriptText} 
                onChange={e => setScriptText(e.target.value)} 
                className="w-full h-32 bg-zinc-950/80 border border-white/10 rounded-xl p-4 text-sm text-white resize-none outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Objection Handling</label>
              
              {[
                { id: 'price', title: '"It\'s too expensive"', answer: 'I completely understand. Quality catering is an investment. Our packages actually include full setup and breakdown, saving you hours of stress. Would you be open to seeing our slightly smaller package options?' },
                { id: 'time', title: '"I don\'t have time right now"', answer: 'No problem at all! I want to respect your time. Can I give you a quick callback tomorrow at {{callback_time}}, or would you prefer I just email you the details?' },
                { id: 'competitor', title: '"We\'re using another caterer"', answer: 'That\'s great you have that sorted! We often partner with companies as a backup or for specialized secondary menus like vegan/gluten-free stations. Would you like to keep our menu on file just in case?' }
              ].map(obj => (
                <div key={obj.id} className="border border-white/5 rounded-xl bg-zinc-950/50 overflow-hidden">
                  <button onClick={() => setOpenAccordion(openAccordion === obj.id ? null : obj.id)} className="w-full p-4 flex justify-between items-center text-sm font-semibold text-white hover:bg-white/[0.02]">
                    {obj.title}
                    <ChevronDown size={16} className={`text-zinc-400 transition-transform ${openAccordion === obj.id ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openAccordion === obj.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-4 pt-0 text-sm text-zinc-400 border-t border-white/5 mt-2 pt-4">
                          {obj.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <button className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.02] flex items-center justify-center gap-2 transition-colors">
                <Plus size={14} /> Add Objection Rule
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: CALL LOG TABLE */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-zinc-900/60">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Phone size={16} className="text-emerald-400" /> Recent Call Logs
            </h2>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5">
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Outcome</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">{log.contact}</div>
                      <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        {log.channel === 'Outbound' ? <ArrowRight size={10} className="text-blue-400" /> : <ArrowRight size={10} className="text-emerald-400 rotate-180" />}
                        {log.channel}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${getOutcomeStyle(log.outcome)}`}>
                        {log.outcome}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-zinc-300 font-mono">
                      {log.duration}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-zinc-400">
                      {log.time}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors" title="Play Recording">
                          <PlayCircle size={14} />
                        </button>
                        <button className="px-2 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors">
                          Follow-up
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
