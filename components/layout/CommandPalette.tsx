'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, Inbox, Zap, BarChart2, Brain, Settings2, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
          label="Global Command Menu"
        >
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-50 w-full max-w-[600px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-violet-900/20 backdrop-blur-xl mx-4 sm:mx-0"
          >
            <div className="flex items-center border-b border-white/10 px-4">
              <Search size={18} className="text-zinc-400" />
              <Command.Input 
                placeholder="Search everything... (Press ESC to close)"
                className="flex-1 bg-transparent px-4 py-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
              />
              <div 
                className="cursor-pointer p-1 rounded-md hover:bg-white/10 text-zinc-400 transition-colors"
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </div>
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                No results found.
              </Command.Empty>

              <Command.Group heading={<span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2 py-1 block">Pages</span>}>
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/inbox'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-violet-500/15 aria-selected:text-white transition-colors"
                >
                  <Inbox size={16} className="text-violet-400" />
                  Inbox
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/leads'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-violet-500/15 aria-selected:text-white transition-colors"
                >
                  <Zap size={16} className="text-amber-400" />
                  Leads Pipeline
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/analytics'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-violet-500/15 aria-selected:text-white transition-colors"
                >
                  <BarChart2 size={16} className="text-emerald-400" />
                  Analytics
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/knowledge-base'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-violet-500/15 aria-selected:text-white transition-colors"
                >
                  <Brain size={16} className="text-cyan-400" />
                  Knowledge Base
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/settings'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-violet-500/15 aria-selected:text-white transition-colors"
                >
                  <Settings2 size={16} className="text-zinc-400" />
                  Settings
                </Command.Item>
              </Command.Group>

              {/* In a real app, we would search conversations and leads dynamically here */}
              <Command.Group heading={<span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2 pt-3 pb-1 block">Recent Conversations</span>}>
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/inbox'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-violet-500/15 aria-selected:text-white transition-colors"
                >
                  <MessageSquare size={16} className="text-zinc-400" />
                  Sarah Jenkins - "Issue with billing"
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/inbox'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 aria-selected:bg-violet-500/15 aria-selected:text-white transition-colors"
                >
                  <MessageSquare size={16} className="text-zinc-400" />
                  Marco Rossi - "Pricing inquiry"
                </Command.Item>
              </Command.Group>
            </Command.List>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}
