'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  hoverScale?: boolean;
}

export function GlowCard({
  children,
  glowColor = 'rgba(139, 92, 246, 0.15)',
  className,
  hoverScale = true,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef as any}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={hoverScale ? { scale: 1.008, y: -2 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ willChange: 'transform, opacity' }}
      className={cn(
        'relative rounded-xl border border-white/[0.05] bg-slate-900/60 backdrop-blur-md overflow-hidden transition-shadow duration-300',
        isHovered && 'shadow-2xl',
        className
      )}
      {...(props as any)}
    >
      {/* Radial spotlight glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default GlowCard;
