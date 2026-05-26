'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, MessageCircle, Camera, Globe, Check, Bot } from 'lucide-react';
import { useAIModeStore } from '../../store/aiModeStore';
import { supabase } from '../../lib/supabase/client';

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0
  })
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const { settings, updateSettings } = useAIModeStore();

  // Step 2 Form
  const [businessName, setBusinessName] = useState('Spice Garden');
  const [businessType, setBusinessType] = useState('Restaurant');
  const [language, setLanguage] = useState('English');

  // Step 3 Form
  const [trainingData, setTrainingData] = useState(`[About Us]
Spice Garden is a premium South Indian restaurant 
in Hyderabad. We serve authentic Hyderabadi cuisine 
with modern presentation.

[Hours]
Monday – Sunday: 11:00 AM – 11:00 PM
Last orders at 10:30 PM

[Services]
- Dine-in: Air-conditioned seating for 80 guests
- Takeaway: Ready in 20 minutes
- Delivery: Available via Swiggy and Zomato
- Private Events: Hall bookable for up to 50 guests

[Menu Highlights & Pricing]
- Hyderabadi Dum Biryani: ₹280
- Gongura Mutton: ₹380
- Pesarattu (breakfast): ₹120
- Gulab Jamun: ₹80
- Family Biryani Bucket (serves 4): ₹950

[FAQs]
Q: Do you have vegan options?
A: Yes! We have 12+ vegan dishes including 
   Pesarattu, Dal Tadka, and Veg Biryani.

Q: Do you take reservations?
A: Yes, call +91-98765-43210 or WhatsApp us.

Q: What payment methods?
A: UPI, all major cards, and cash accepted.`);
  const [isTyping, setIsTyping] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
    setIsSaved(false);
  };

  const handleSaveTraining = () => {
    setIsSaved(true);
    setTimeout(() => {
      nextStep();
    }, 1000);
  };

  const completeOnboarding = async () => {
    // Update store
    updateSettings({
      customInstructions: `Business Name: ${businessName}. Type: ${businessType}. Language: ${language}. Guidelines: ${trainingData}\n\n${settings.customInstructions}`,
      autoPilot: true
    });

    // Simulate saving to supabase
    await supabase.from('user_settings').insert([{
      business_name: businessName,
      business_type: businessType,
      language: language,
      training_data: trainingData
    }]);

    router.push('/inbox');
  };

  // Typewriter effect for step 3
  useEffect(() => {
    if (step === 3 && trainingData.length > 10) {
      setIsTyping(true);
      const fakeResponse = `Yes! We deliver to Banjara Hills via Swiggy and Zomato. Average delivery time is 35–45 minutes. You can also order directly through us for a 10% discount!`;
      let i = 0;
      setPreviewText('');
      const interval = setInterval(() => {
        setPreviewText(fakeResponse.substring(0, i));
        i++;
        if (i > fakeResponse.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#06080f] overflow-hidden text-slate-200">
      
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-violet-600/20 to-cyan-500/10 blur-[120px] pointer-events-none animate-glow-pulse" />

      {/* Progress Dots */}
      <div className="absolute top-12 flex items-center justify-center space-x-3 w-full z-20">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === step ? 'w-8 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]' : i < step ? 'w-2 bg-violet-500/50' : 'w-2 bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[600px] p-6">
        <AnimatePresence mode="wait" custom={direction}>
          
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative flex items-center justify-center w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-violet-500/30 animate-spin" style={{ animationDuration: '4s' }} />
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-xl shadow-violet-500/30">
                  <Sparkles size={32} className="text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white font-heading mb-4">Welcome to ReplyIQ</h1>
              <p className="text-slate-400 mb-10 max-w-sm">Let&apos;s set up your AI inbox in 3 quick steps.</p>
              
              <button
                onClick={nextStep}
                className="group relative inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-xl hover:bg-slate-100 hover:scale-[1.02] transition-all duration-200"
              >
                Let&apos;s go <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="glass rounded-[20px] p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white font-heading">Tell us about your business</h2>
                <p className="text-sm text-slate-400 mt-2">Help us customize your AI&apos;s personality.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-violet-400 font-medium tracking-wide uppercase">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Spice Garden"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] text-violet-400 font-medium tracking-wide uppercase">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Salon">Salon</option>
                    <option value="Retail">Retail</option>
                    <option value="Agency">Agency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-violet-400 font-medium tracking-wide uppercase">Primary Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={!businessName}
                className="w-full mt-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col md:flex-row gap-6 w-[800px] max-w-[90vw] -ml-[100px] sm:-ml-0" // Quick hack to center wider modal
              style={{ transform: 'translateX(0)' }} // Ensuring proper centering despite width
            >
              <div className="flex-1 glass rounded-[20px] p-8">
                <h2 className="text-2xl font-bold text-white font-heading mb-2">Train your AI</h2>
                <p className="text-sm text-slate-400 mb-6">Your AI will use this to answer customer questions automatically.</p>
                
                <div className="space-y-2 relative">
                  <textarea
                    value={trainingData}
                    onChange={(e) => setTrainingData(e.target.value)}
                    placeholder="e.g. We are an authentic Indian restaurant open from 11am to 10pm. We offer vegan options..."
                    className="w-full h-[200px] bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none"
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 flex gap-2">
                    <span>{trainingData.length} chars</span>
                    <span>•</span>
                    <span>{trainingData.trim() === '' ? 0 : trainingData.trim().split(/\s+/).length} words</span>
                  </div>
                </div>

                <button
                  onClick={handleSaveTraining}
                  disabled={trainingData.length < 10 || isSaved}
                  className="w-full mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <AnimatePresence mode="wait">
                    {isSaved ? (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center justify-center gap-2 text-emerald-300"
                      >
                        <Check size={16} /> Training data saved
                      </motion.span>
                    ) : (
                      <motion.span
                        key="save"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center justify-center"
                      >
                        Save Training Data
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Preview Pane */}
              <div className="w-[300px] glass rounded-[20px] p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                  <Bot size={16} className="text-violet-400" />
                  <span className="text-xs font-semibold text-white">Live Preview</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="bg-white/5 rounded-xl rounded-tr-none p-3 text-xs text-slate-300 self-end ml-6 border border-white/5">
                    Do you deliver to Banjara Hills?
                  </div>
                  
                  {(previewText || isTyping) && (
                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl rounded-tl-none p-3 text-xs text-violet-200 mr-6 shadow-sm shadow-violet-500/5">
                      {previewText}
                      {isTyping && <span className="inline-block w-1.5 h-3 bg-violet-400 ml-1 animate-pulse" />}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="glass rounded-[20px] p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white font-heading">Connect your channels</h2>
                <p className="text-sm text-slate-400 mt-2">Channels are pre-configured for your demo environment.</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'whatsapp', name: 'WhatsApp Business', icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { id: 'instagram', name: 'Instagram Direct', icon: Camera, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                  { id: 'web', name: 'Website Chat', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' }
                ].map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${channel.bg}`}>
                        <channel.icon size={20} className={channel.color} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{channel.name}</div>
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Check size={10} /> Connected
                        </div>
                      </div>
                    </div>
                    {/* Visual toggle ON */}
                    <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center px-0.5 justify-end">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={nextStep}
                className="w-full mt-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 hover:scale-[1.02] transition-all duration-300"
              >
                Complete Setup
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/20"
              >
                <Check size={40} className="text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold tracking-tight text-white font-heading mb-4">You&apos;re live! 🚀</h2>
              <p className="text-slate-400 mb-2">AI is active.</p>
              <p className="text-slate-400 mb-2">3 channels connected.</p>
              <p className="text-slate-400 mb-10">Knowledge base trained.</p>
              
              <button
                onClick={completeOnboarding}
                className="group relative inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-xl hover:bg-slate-100 hover:scale-[1.02] transition-all duration-200"
              >
                Open your inbox <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
