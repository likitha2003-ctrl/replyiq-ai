'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAIModeStore } from '../../store/aiModeStore';

interface AIOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isGenerating?: boolean;
  forceActive?: boolean;
}

export function AIOrb({ size = 'md', className, isGenerating = false, forceActive = false }: AIOrbProps) {
  const autoPilot = useAIModeStore((s) => s.settings.autoPilot);
  const isActive = autoPilot || forceActive || isGenerating;

  const dims: Record<string, { outer: string; icon: number }> = {
    sm: { outer: 'h-10 w-10', icon: 14 },
    md: { outer: 'h-20 w-20', icon: 24 },
    lg: { outer: 'h-32 w-32', icon: 40 },
    xl: { outer: 'h-48 w-48', icon: 56 },
  };
  const { outer, icon } = dims[size] ?? dims['md'];

  return (
    <div className={cn('relative flex items-center justify-center shrink-0', outer, className)}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Far ambient halo — extra blur for xl */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(6,182,212,0.12) 55%, transparent 75%)',
          filter: 'blur(18px)',
        }}
        animate={{
          scale: isGenerating ? [1, 1.25, 1] : isActive ? [1, 1.1, 1] : [1, 1.04, 1],
          opacity: isGenerating ? [0.7, 1, 0.7] : isActive ? [0.55, 0.85, 0.55] : [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: isGenerating ? 1.2 : isActive ? 2.5 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="absolute inset-[-4px] rounded-full border border-violet-500/20"
        animate={{ rotate: isActive ? 360 : 0 }}
        transition={{ duration: isActive ? 12 : 0, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
      />

      {/* Cyan orbit ring */}
      <motion.div
        className="absolute inset-[-8px] rounded-full border border-cyan-500/10"
        animate={{ rotate: isActive ? -360 : 0 }}
        transition={{ duration: isActive ? 18 : 0, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
      />

      {/* Core sphere */}
      <motion.div
        className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-violet-600 via-zinc-500 to-zinc-400 shadow-2xl border border-white/20 flex items-center justify-center overflow-hidden"
        animate={{
          boxShadow: isGenerating
            ? ['0 0 20px rgba(139,92,246,0.6)', '0 0 40px rgba(6,182,212,0.7)', '0 0 20px rgba(139,92,246,0.6)']
            : isActive
            ? ['0 0 12px rgba(139,92,246,0.4)', '0 0 22px rgba(139,92,246,0.6)', '0 0 12px rgba(139,92,246,0.4)']
            : ['0 0 8px rgba(139,92,246,0.2)', '0 0 14px rgba(139,92,246,0.3)', '0 0 8px rgba(139,92,246,0.2)'],
        }}
        transition={{ duration: isGenerating ? 1 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'box-shadow' }}
      >
        {/* Specular highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.3)_0%,_transparent_55%)] pointer-events-none" />

        <motion.div
          animate={{ rotate: isGenerating ? 360 : 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ willChange: 'transform' }}
        >
          <Sparkles
            size={icon}
            className="text-white drop-shadow-lg"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AIOrb;
