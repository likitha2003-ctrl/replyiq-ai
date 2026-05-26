'use client';

import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 0.8,
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 35,
    stiffness: 180,
    duration,
  });
  const displayValue = useTransform(spring, (v) =>
    `${prefix}${v.toFixed(decimals)}${suffix}`
  );

  const hasAnimated = useRef(false);

  useEffect(() => {
    // Small delay for stagger feel
    const t = setTimeout(() => {
      motionValue.set(value);
    }, hasAnimated.current ? 0 : 100);
    hasAnimated.current = true;
    return () => clearTimeout(t);
  }, [value, motionValue]);

  return (
    <motion.span style={{ willChange: 'contents' }}>
      {displayValue}
    </motion.span>
  );
}

export default AnimatedCounter;
