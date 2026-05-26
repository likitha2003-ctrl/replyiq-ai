// DEMO CREDENTIALS (set up in Supabase Auth):
// Email: demo@replyiq.ai
// Password: Demo@2026
// This account has pre-seeded data via the seed script

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase/client';
import { useToast } from '../../../components/shared/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Floating label states
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    // Using mocked supabase auth
    const { error } = await supabase.auth.signInWithPassword();

    setLoading(false);

    if (error) {
      toast({
        title: 'Authentication Failed',
        description: (error as any)?.message || 'Invalid credentials. Please try again.',
        type: 'lead', // using existing toast type as error-like for now, or default
      });
      return;
    }

    // Simulate routing to onboarding or inbox
    // For demo purposes, we'll assume it's a new user routing to onboarding.
    router.push('/onboarding');
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/onboarding');
    }, 1000);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setEmail('demo@replyiq.ai');
    setPassword('Demo@2026');
    
    toast({
      type: 'system',
      title: 'Demo Mode Activated',
      description: 'Setting up your demo environment...',
    });

    setTimeout(() => {
      setLoading(false);
      router.push('/inbox');
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#06080f] overflow-hidden text-slate-200">
      
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 blur-[120px] pointer-events-none animate-glow-pulse" />

      {/* Main Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 w-full max-w-[420px] p-1"
      >
        {/* Animated gradient border wrapper */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/30 via-transparent to-cyan-500/30 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        
        <div className="relative glass rounded-[15px] p-8 sm:p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/25 mb-4">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-heading">ReplyIQ</h1>
            <p className="text-sm text-slate-400 mt-2">Your AI inbox is waiting.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${emailFocused ? 'ring-2 ring-violet-500/50 bg-violet-500/5' : 'border border-white/10 bg-white/[0.03]'}`} />
              <label 
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  emailFocused || email 
                    ? 'top-1.5 text-[10px] text-violet-400 font-medium tracking-wide' 
                    : 'top-3.5 text-sm text-slate-500'
                }`}
              >
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="relative w-full bg-transparent px-4 pb-2 pt-6 text-sm text-white outline-none z-10"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${passwordFocused ? 'ring-2 ring-violet-500/50 bg-violet-500/5' : 'border border-white/10 bg-white/[0.03]'}`} />
              <label 
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  passwordFocused || password 
                    ? 'top-1.5 text-[10px] text-violet-400 font-medium tracking-wide' 
                    : 'top-3.5 text-sm text-slate-500'
                }`}
              >
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="relative w-full bg-transparent px-4 pb-2 pt-6 text-sm text-white outline-none z-10"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-slate-400">
            <span>New here? </span>
            <Link href="#" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Start free.
            </Link>
          </div>

          {/* Demo Section Separator */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="mx-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">— or —</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Demo Button */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3.5 text-sm font-bold text-white hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-[1.02]"
          >
            <Sparkles size={16} /> ✨ Try Demo Account (No signup needed)
          </button>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
        </div>
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && email === 'demo@replyiq.ai' && (
          <motion.div
            key="demo-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0e1a]/95 backdrop-blur-md"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 shadow-2xl shadow-amber-500/20 mb-6 animate-bounce">
              <Zap size={40} className="text-white" />
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-white font-heading tracking-wide"
            >
              Loading your demo environment...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
