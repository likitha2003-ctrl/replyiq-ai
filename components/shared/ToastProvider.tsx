'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../store/notificationStore';
import { X, MessageSquare, Zap, Cpu, Settings, CheckCircle2, AlertCircle } from 'lucide-react';

type ToastType = 'message' | 'lead' | 'ai_reply' | 'system' | 'success' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description: string;
}

interface ToastContextType {
  toast: (t: Omit<Toast, 'id'>) => void;
  activeToasts: Toast[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig: Record<ToastType, { icon: React.ElementType; color: string; glow: string }> = {
  message: { icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10 border-blue-500/25', glow: 'shadow-blue-500/10' },
  lead: { icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/25', glow: 'shadow-amber-500/15' },
  ai_reply: { icon: Cpu, color: 'text-violet-400 bg-violet-500/10 border-violet-500/25', glow: 'shadow-violet-500/15' },
  system: { icon: Settings, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', glow: 'shadow-emerald-500/10' },
  success: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', glow: 'shadow-emerald-500/10' },
  error: { icon: AlertCircle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/25', glow: 'shadow-rose-500/10' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([]);
  const notifications = useNotificationStore((s) => s.notifications);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);

  const dismiss = useCallback((id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setActiveToasts((prev) => [...prev.slice(-4), { ...newToast, id }]); // max 5 at once
    setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  // Auto-show toast for new store notifications
  useEffect(() => {
    if (!notifications.length) return;
    const latest = notifications[0];
    if (latest.id !== lastNotificationId) {
      setLastNotificationId(latest.id);
      if (lastNotificationId !== null) {
        toast({ type: latest.type as ToastType, title: latest.title, description: latest.description });
      }
    }
  }, [notifications, lastNotificationId, toast]);

  return (
    <ToastContext.Provider value={{ toast, activeToasts, dismiss }}>
      {children}

      {/* Toast portal */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)]">
        <AnimatePresence mode="popLayout">
          {activeToasts.map((t) => {
            const { icon, color, glow } = toastConfig[t.type] ?? toastConfig.system;
            const Icon = icon as any;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ willChange: 'transform, opacity' }}
                className={`flex items-start gap-3 p-4 rounded-xl border bg-zinc-900/95 backdrop-blur-xl shadow-2xl ${glow}`}
              >
                <div className={`p-2 rounded-lg border shrink-0 ${color}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white leading-tight">{t.title}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{t.description}</p>
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-zinc-600 hover:text-white transition-colors shrink-0 mt-0.5"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
