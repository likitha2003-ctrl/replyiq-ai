'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Command, ChevronDown, MessageSquare, Zap, Settings, X, CheckCheck } from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { useNotificationStore } from '../../store/notificationStore';
import { formatTime } from '../../lib/utils';

interface TopBarProps {
  collapsed: boolean;
}

const typeConfig: Record<string, { color: string; icon: React.ElementType }> = {
  message: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: MessageSquare },
  lead: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Zap },
  ai_reply: { color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', icon: Zap },
  system: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: Settings },
};

export function TopBar({ collapsed }: TopBarProps) {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { notifications, markAllAsRead, markAsRead } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTitle = () => {
    const map: Record<string, string> = {
      '/inbox': 'Inbox',
      '/leads': 'Leads Pipeline',
      '/analytics': 'Analytics',
      '/knowledge-base': 'Knowledge Base',
      '/settings': 'Settings',
    };
    return map[pathname] ?? 'Dashboard';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.04] bg-[#0a0e1a]/80 px-6 backdrop-blur-xl transition-all duration-300 left-0 ${collapsed ? 'md:left-[64px]' : 'md:left-[260px]'}`}
      >
        {/* Left: Dynamic breadcrumb title */}
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-white font-heading tracking-wide">{getTitle()}</h1>
          <span className="hidden sm:block h-4 w-px bg-white/10" />
          <span className="hidden sm:block text-[10px] text-slate-500 font-medium">ReplyIQ AI Workspace</span>
        </div>

        {/* Center: Search trigger */}
        <div className="flex-1 px-8 max-w-xl hidden md:block">
          <div
            onClick={() => setCmdOpen(true)}
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 transition-all hover:bg-white/[0.04] hover:border-white/10 focus-within:ring-1 focus-within:ring-violet-500/30 animate-[search-idle-glow_3s_infinite_ease-in-out]"
          >
            <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-400">
              <Search size={14} />
              <span className="text-xs font-medium">Search conversations, leads, settings...</span>
            </div>
            <div className="flex items-center gap-0.5 rounded bg-white/[0.05] px-1.5 py-0.5 text-[9px] font-bold text-slate-500 tracking-wider">
              <Command size={9} />K
            </div>
          </div>
        </div>

        {/* Right: Status + Notif + Avatar */}
        <div className="flex items-center gap-4">
          {/* AI live status pill */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1">
            <div className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">AI Active</span>
          </div>

          {/* Notification bell with dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.02] text-slate-400 transition-all hover:bg-white/[0.05] hover:text-white focus:outline-none focus:ring-1 focus:ring-violet-500/30"
              title="Notifications (N)"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <>
                  <motion.span
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-1 -top-1 flex h-4 w-4 rounded-full bg-rose-500"
                  />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.7)]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </>
              )}
            </button>

            {/* Notification dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  style={{ willChange: 'transform, opacity' }}
                  className="absolute right-0 top-11 w-80 rounded-2xl border border-white/[0.08] bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
                >
                  {/* Dropdown header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <Bell size={12} className="text-slate-400" />
                      <span className="text-xs font-bold text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20 text-[9px] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-[9px] font-bold text-slate-500 hover:text-violet-400 transition-colors"
                    >
                      <CheckCheck size={10} />
                      Mark all read
                    </button>
                  </div>

                  {/* Notification list */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.03]">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center text-xs text-slate-600">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 10).map((n) => {
                        const cfg = typeConfig[n.type] ?? typeConfig.system;
                        const Icon = cfg.icon;
                        return (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`flex gap-3 p-3.5 cursor-pointer transition-colors hover:bg-white/[0.02] ${!n.read ? 'bg-violet-500/[0.02]' : ''}`}
                          >
                            <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${cfg.color}`}>
                              <Icon size={11} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-[11px] font-semibold text-white leading-tight">{n.title}</p>
                                {!n.read && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{n.description}</p>
                              <p className="text-[9px] text-slate-600 mt-1 font-medium">{formatTime(n.timestamp)}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-white/[0.05] px-4 py-2.5">
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-violet-400 transition-colors"
                    >
                      Close Panel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent p-1 transition-colors hover:bg-white/[0.03] focus:outline-none focus:ring-1 focus:ring-violet-500/30">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
              RI
            </div>
            <ChevronDown size={12} className="text-slate-500 hidden sm:block" />
          </div>
        </div>
      </header>

      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </>
  );
}
