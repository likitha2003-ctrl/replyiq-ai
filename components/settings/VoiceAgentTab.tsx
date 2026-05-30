'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Settings, CheckCircle2, Volume2, X } from 'lucide-react';

const mockCalls = [
  { id: 1, time: 'Today 2:34 PM', contact: 'Priya Sharma', duration: '3m 42s', outcome: 'Appointment Booked' },
  { id: 2, time: 'Today 11:20 AM', contact: 'Lucas Schmidt', duration: '1m 15s', outcome: 'Info Provided' },
  { id: 3, time: 'Yesterday 4:55 PM', contact: 'Elena Rostova', duration: '5m 08s', outcome: 'Escalated to Human' },
];

export default function VoiceAgentTab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [voiceName, setVoiceName] = useState('Aria');
  const [language, setLanguage] = useState('en-IN');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang.startsWith(language)) || voices[0];
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPreview = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speakText(`Hello! Thank you for calling Spice Garden. I'm ${voiceName}, your AI assistant. How can I help you today?`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">AI Voice Agent</h3>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Configure autonomous voice calling parameters and listen to recorded conversations.</span>
        </div>
        <button
          onClick={() => setShowConfig(true)}
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shadow-lg transition-colors flex items-center gap-2"
        >
          <Settings size={14} />
          Configure Voice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Card */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Voice Active</span>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Active Voice Persona</p>
              <p className="text-sm font-semibold text-white">{voiceName} — Professional Indian English</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Last Handled Call</p>
              <p className="text-sm font-semibold text-white">Today, 2:34 PM · 3m 42s</p>
            </div>
          </div>
        </div>

        {/* Voice Player Preview */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 flex flex-col">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Mic size={14} className="text-violet-400" />
            Your AI Voice Preview
          </h4>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="flex items-end gap-1 h-12 w-full justify-center overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 4 }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, ease: "easeInOut" }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-violet-600 to-zinc-400 opacity-80"
                />
              ))}
            </div>
            
            <button
              onClick={handlePlayPreview}
              className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
            >
              <Play size={20} className={isPlaying ? "animate-pulse" : ""} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* Call Log Table */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">Recent Agent Calls</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-3 whitespace-nowrap">Time</th>
                <th className="px-6 py-3 whitespace-nowrap">Contact</th>
                <th className="px-6 py-3 whitespace-nowrap">Duration</th>
                <th className="px-6 py-3 whitespace-nowrap">Outcome</th>
                <th className="px-6 py-3 text-right">Recording</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockCalls.map((call) => (
                <tr key={call.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-300">{call.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-white">{call.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">{call.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <span className="px-2 py-1 bg-white/5 rounded text-zinc-300">{call.outcome}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-full bg-violet-500/10 text-violet-400 hover:bg-violet-500 hover:text-white transition-colors">
                      <Play size={14} fill="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configure Modal */}
      <AnimatePresence>
        {showConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfig(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-6">
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-violet-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure Voice</h3>
                </div>
                <button onClick={() => setShowConfig(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Voice Name</label>
                  <input
                    type="text"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Language Region</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white outline-none focus:border-violet-500"
                  >
                    <option value="en-IN">English (India)</option>
                    <option value="hi-IN">Hindi (India)</option>
                    <option value="te-IN">Telugu (India)</option>
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Speaking Rate</label>
                    <span className="text-xs font-bold text-violet-400">{rate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5" max="2" step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full accent-violet-500 bg-white/5 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pitch</label>
                    <span className="text-xs font-bold text-violet-400">{pitch}</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="2" step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full accent-violet-500 bg-white/5 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                <button
                  onClick={() => speakText(`Testing voice configuration for ${voiceName}.`)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors flex items-center gap-2"
                >
                  <Volume2 size={14} /> Test Voice
                </button>
                <button
                  onClick={() => setShowConfig(false)}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
