'use client';
import React from 'react';
import { motion } from 'framer-motion';

const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as any } }
};

export function ProblemSolution() {
  return (
    <section className="py-32 px-8 bg-black border-b border-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-heading text-[56px] md:text-[72px] text-white leading-[0.9] mb-20 max-w-3xl"
        >
          THE INBOX PROBLEM IS KILLING YOUR GROWTH
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#333333] -translate-x-1/2" />
          
          {/* Problem */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col gap-6 md:pr-12">
            {[
              "Messages scattered across 5+ apps",
              "Hours lost copying, pasting, replying",
              "Leads going cold while you're busy"
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-[#FF3333] font-mono text-xl mt-1">❌</span>
                <span className="font-mono text-lg text-[#999999]">{text}</span>
              </div>
            ))}
          </motion.div>
          
          {/* Solution */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col gap-6 md:pl-12">
            {[
              "One unified inbox — all channels",
              "AI replies in your tone, instantly",
              "Automatic lead scoring + follow-up"
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-[#00FF94] font-mono text-xl mt-1">✓</span>
                <span className="font-mono text-lg text-white">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    { icon: "🧠", title: "AI Auto-Reply", desc: "Replies in your brand voice using Gemini AI. Tone selector: professional, friendly, assertive." },
    { icon: "📊", title: "Lead Scoring", desc: "Circular gauge scores every lead hot/warm/cold automatically from conversation data." },
    { icon: "🛡️", title: "Churn Prediction Shield", desc: "Detects at-risk customers before they cancel. Sends recovery messages automatically." },
    { icon: "🔁", title: "Promises Tracker", desc: "AI extracts commitments from every conversation. Alerts you when you're overdue." },
    { icon: "📣", title: "WhatsApp Broadcast", desc: "Build campaigns, target segments, send at scale — all from one screen." },
    { icon: "💰", title: "Revenue Attribution", desc: "See which conversations, channels, and times drive the most closed deals." }
  ];

  return (
    <section className="py-32 px-8 bg-black" id="features">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="font-mono text-xs text-[#00FF94] tracking-widest uppercase mb-4 block">WHAT'S INSIDE</span>
          <h2 className="font-heading text-[48px] md:text-[64px] text-white leading-[0.9] mb-16 max-w-4xl">
            BUILT FOR BUSINESSES THAT CAN'T AFFORD TO MISS A REPLY
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-[#0D0D0D] border border-[#1E1E1E] hover:border-[#00FF94] hover:shadow-[0_0_30px_rgba(0,255,148,0.1)] transition-all duration-300 p-8 flex flex-col gap-4 group"
            >
              <div className="text-4xl mb-2 grayscale group-hover:grayscale-0 transition-all">{f.icon}</div>
              <h3 className="font-heading text-[28px] text-white tracking-wide">{f.title}</h3>
              <p className="font-mono text-sm text-[#999999] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsBar() {
  return (
    <section className="w-full bg-[#0A0A0A] border-y border-[#1A1A1A] py-16 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
        {[
          { val: "$32,800+", label: "Pipeline tracked" },
          { val: "200+", label: "Businesses" },
          { val: "3 sec", label: "Avg AI reply time" },
          { val: "Top 10", label: "SummerShip 2026" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="flex flex-col gap-2"
          >
            <div className="font-heading text-[56px] md:text-[72px] text-white leading-none">{stat.val}</div>
            <div className="font-mono text-xs text-[#666666] uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
