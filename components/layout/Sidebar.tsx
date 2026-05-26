'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Zap, BarChart2, Brain, Settings2, 
  LogOut, ChevronLeft, ChevronRight, Check, X
} from 'lucide-react';
import { useAIModeStore } from '../../store/aiModeStore';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { name: 'Inbox', href: '/inbox', icon: MessageSquare, badge: '3' },
  { name: 'Leads', href: '/leads', icon: Zap, badge: 'Hot' },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: Brain },
  { name: 'Settings', href: '/settings', icon: Settings2 },
];

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, setMode } = useAIModeStore();
  const [showLeadsBadge, setShowLeadsBadge] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('activeLeadsDismissed');
    if (dismissed !== 'true') {
      setShowLeadsBadge(true);
    }
  }, []);

  const dismissLeads = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLeadsBadge(false);
    localStorage.setItem('activeLeadsDismissed', 'true');
  };

  return (
    <>
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 260 }}
      className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col glass border-r border-white/[0.04] overflow-hidden"
    >
      {/* Logo Area */}
      <div className="flex h-16 shrink-0 items-center px-4 border-b border-white/[0.04]">
        <Link href="/inbox" className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20">
            <Zap size={16} className="text-white" />
          </div>
          <AnimatePresence mode="popLayout">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-bold tracking-tight text-white font-heading"
              >
                ReplyIQ
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-none">
        <div className="space-y-1">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || (item.href === '/inbox' && pathname === '/');
            const Icon = item.icon;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`group relative flex items-center justify-between rounded-lg px-2.5 py-2.5 transition-all duration-200 ${
                    isActive 
                      ? 'bg-violet-500/10 text-violet-300' 
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  {/* Active Indicator Line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-violet-500"
                      style={{ boxShadow: 'inset 3px 0 0 #7c3aed, 2px 0 12px rgba(124,58,237,0.3)' }}
                    />
                  )}

                  <div className="flex items-center gap-3 overflow-hidden">
                    <Icon size={18} className={`shrink-0 ${isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`} />
                    <AnimatePresence mode="popLayout">
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="text-sm font-medium whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Badges */}
                  <AnimatePresence mode="popLayout">
                    {!collapsed && item.badge && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                          item.badge === 'Hot'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            : 'bg-violet-500/20 text-violet-300 border border-violet-500/20'
                        }`}
                      >
                        {item.badge}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-white/[0.04] p-4 flex flex-col gap-4">
        
        {/* AI Mode Toggle */}
        <motion.div 
          layout
          className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} rounded-xl border p-1 transition-all duration-300 cursor-pointer ${
            mode === 'auto' 
              ? 'border-emerald-500/30 bg-emerald-500/5 shadow-[inset_0_0_12px_rgba(52,211,153,0.1)]' 
              : 'border-amber-500/30 bg-amber-500/5 shadow-[inset_0_0_12px_rgba(245,158,11,0.1)]'
          }`}
          onClick={() => setMode(mode === 'auto' ? 'supervised' : 'auto')}
          title={collapsed ? `Mode: ${mode === 'auto' ? 'Auto-Pilot' : 'Supervised'}` : undefined}
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
            <div className={`absolute inset-0 rounded-lg blur-[6px] opacity-60 transition-colors duration-500 ${mode === 'auto' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <Zap size={14} className={`relative z-10 transition-colors duration-500 ${mode === 'auto' ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <AnimatePresence mode="popLayout">
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 overflow-hidden pl-3 pr-2"
              >
                <div className="flex flex-col justify-center whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-slate-300 leading-tight">AI Mode</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${mode === 'auto' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {mode === 'auto' ? 'Auto-Pilot' : 'Supervised'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* User Profile */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} transition-all`}>
          <div className="flex items-center gap-3 overflow-hidden" title={collapsed ? "Sarah Jenkins (Pro)" : undefined}>
            <div className="relative shrink-0">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Avatar" className="h-8 w-8 rounded-full border border-white/10" />
              <div className="absolute -bottom-0.5 -right-0.5 rounded-full border border-[#06080f] bg-emerald-500 p-0.5">
                <Check size={8} className="text-[#06080f]" />
              </div>
            </div>
            
            <AnimatePresence mode="popLayout">
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col whitespace-nowrap overflow-hidden"
                >
                  <span className="text-xs font-semibold text-white truncate max-w-[120px]">Sarah Jenkins</span>
                  <span className="inline-flex mt-1 items-center justify-center rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white max-w-max">Pro Plan</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence mode="popLayout">
            {!collapsed && (
              <motion.button 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="shrink-0 ml-auto p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#0a0e1a] text-slate-400 shadow-md transition-colors hover:text-white hover:bg-white/5 z-50`}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.aside>

    {/* Mobile Bottom Tab Bar */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around glass border-t border-white/[0.04] pb-safe pt-2 px-2 bg-[#06080f]/90">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/inbox' && pathname === '/');
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${
              isActive ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="relative">
              <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' : ''} />
              {item.badge && (
                <span className="absolute -top-1 -right-2 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-[#06080f]" />
              )}
            </div>
            <span className="text-[9px] font-medium mt-1">{item.name}</span>
          </Link>
        );
      })}
    </div>

    {/* Active Leads Floating Badge */}
    <AnimatePresence>
      {showLeadsBadge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={() => router.push('/leads')}
          className="fixed bottom-4 left-4 z-[100] cursor-pointer flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-[#0a0e1a] shadow-[0_4px_14px_rgba(245,158,11,0.4)] hover:scale-[1.02] transition-transform"
        >
          <span>🔥 3 Active Leads</span>
          <button 
            onClick={dismissLeads} 
            className="ml-1 rounded-sm p-0.5 hover:bg-amber-600/40 transition-colors"
            title="Dismiss"
          >
            <X size={14} className="text-[#0a0e1a]/80" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

