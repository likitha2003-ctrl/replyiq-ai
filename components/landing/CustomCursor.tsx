'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  
  const ringX = useTransform(cursorX, v => v - 16);
  const ringY = useTransform(cursorY, v => v - 16);

  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setIsVisible(true);
    }
    const move = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: mousePosition.x - 3, y: mousePosition.y - 3, scale: isHovering ? 0 : 1, opacity: isHovering ? 0 : 1 }}
      />
      <motion.div 
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9998] transition-colors duration-200 ${isHovering ? 'border-[#7C3AED]' : 'border-white/30'}`}
        style={{ 
          x: ringX, 
          y: ringY,
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.5 : 1
        }}
      />
    </>
  );
}
