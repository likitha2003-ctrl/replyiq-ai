'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Inbox, Bot, Target, Smile, BarChart3, BookOpen, Zap
} from 'lucide-react';
import { TubesBackground } from '../components/shared/TubesBackground';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-purple-500/30 overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">ReplyIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          </div>
          <div>
            <Link href="/login" className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative flex min-h-screen w-full flex-col">
        <TubesBackground className="flex flex-col items-center justify-center px-6 pt-20">
          {/* Large animated gradient orb behind headline */}
          <motion.div
            animate={{ opacity: [0.4, 0.4, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] blur-[80px] pointer-events-none"
            style={{ 
              background: 'linear-gradient(to right, #7c3aed, #06b6d4)',
              animation: 'orb-morph 8s infinite ease-in-out'
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full pointer-events-auto">
            {/* Animated floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500 bg-purple-500/10 px-4 py-1.5 shadow-[0_0_15px_rgba(124,58,237,0.3)] backdrop-blur-sm"
            >
              <span className="text-xs font-semibold text-purple-300">✦ Now powered by Gemini AI</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="block"
              >
                One inbox. Every customer.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block"
              >
                AI-powered replies.
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mb-10 max-w-xl text-base sm:text-lg text-gray-400 leading-relaxed mx-auto drop-shadow-sm"
            >
              ReplyIQ unifies WhatsApp, Instagram, and Website Chat into one AI-powered inbox that replies, detects leads, and never sleeps.
            </motion.p>

            {/* Two CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-16"
            >
              <Link href="/login" className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-[1.03] transition-all duration-300">
                Get Started Free
              </Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-black/20 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors duration-200">
                Watch Demo &rarr;
              </a>
            </motion.div>

            {/* Social proof line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="text-xs font-medium text-gray-500 uppercase tracking-widest"
            >
              Trusted by 500+ growing businesses
            </motion.p>
          </div>
        </TubesBackground>
      </section>

      {/* PRODUCT PREVIEW SECTION */}
      <section className="relative z-10 py-16 px-6 overflow-hidden">
        <div className="mx-auto max-w-5xl relative">
          {/* Centered mock browser frame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl border border-white/10 bg-[#111116] p-2 shadow-[0_0_50px_rgba(124,58,237,0.15)]"
          >
            {/* Browser Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <div className="mx-auto h-5 w-48 rounded bg-white/5" />
            </div>
            
            {/* Inbox UI Sketch */}
            <div className="flex h-[400px] w-full bg-gradient-to-br from-[#0e0e14] to-[#161622] rounded-b-xl overflow-hidden p-4 gap-4">
              {/* Sidebar */}
              <div className="w-1/3 flex flex-col gap-3 border-r border-white/5 pr-4">
                <div className="h-8 w-full rounded bg-white/10" />
                <div className="h-12 w-full rounded bg-white/5" />
                <div className="h-12 w-full rounded bg-white/5" />
                <div className="h-12 w-full rounded bg-white/5" />
              </div>
              {/* Chat Area */}
              <div className="w-2/3 flex flex-col gap-4">
                <div className="h-10 w-full rounded bg-white/5 border-b border-white/5" />
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10 shrink-0" />
                  <div className="h-12 w-3/4 rounded-xl rounded-tl-none bg-white/5" />
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="h-16 w-2/3 rounded-xl rounded-tr-none bg-purple-600/20 border border-purple-500/20" />
                  <div className="h-8 w-8 rounded-full bg-purple-500 shrink-0" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating notification card */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 md:-right-8 top-16 md:top-24 z-20"
          >
            <div className="rounded-xl border border-white/10 bg-[#1a1a24]/80 backdrop-blur-md px-4 py-3 shadow-xl">
              <p className="text-sm font-medium text-white flex items-center gap-2">
                <span>🔥</span> New hot lead detected — Marco Rossi
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Inbox, title: "Unified Inbox", desc: "All channels. One place." },
              { icon: Bot, title: "AI Auto-Reply", desc: "Responds in under 2 seconds." },
              { icon: Target, title: "Lead Detection", desc: "Never miss a buying signal." },
              { icon: Smile, title: "Sentiment Analysis", desc: "Know how customers feel." },
              { icon: BarChart3, title: "Analytics", desc: "Track every conversation." },
              { icon: BookOpen, title: "Knowledge Base", desc: "Train your AI in minutes." }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-gray-400">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 bg-[#0c0c12]">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-white">How it works</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px border-t-2 border-dashed border-white/20 z-0" />
            
            {[
              { num: "1", title: "Connect your channels", desc: "Link WhatsApp, Instagram, & Web" },
              { num: "2", title: "Train your AI", desc: "Upload docs and FAQs" },
              { num: "3", title: "Watch it work", desc: "Sit back and relax" }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center bg-[#0c0c12] px-4"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-purple-500/50 bg-[#0a0a0f] shadow-[0_0_15px_rgba(124,58,237,0.3)] text-xl font-bold text-purple-400">
                  {step.num}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-12 text-center shadow-2xl">
          <h2 className="mb-8 text-3xl sm:text-4xl font-bold text-white">Start automating your replies today</h2>
          <Link href="/login" className="inline-block rounded-xl bg-white px-8 py-4 text-sm font-bold text-purple-600 hover:scale-105 transition-transform">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-tr from-purple-600 to-cyan-500">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-base font-bold text-white">ReplyIQ</span>
          </div>
          <p className="text-sm text-gray-500">Built with AI for the future of customer communication</p>
        </div>
      </footer>
    </div>
  );
}
