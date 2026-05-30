'use client';
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function PlusXCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTextHover, setIsTextHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  const transformedX = useTransform(cursorX, v => v - 16);
  const transformedY = useTransform(cursorY, v => v - 16);

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setIsVisible(true);
    }

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const mouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      if (target.tagName.toLowerCase() === 'h1' || target.tagName.toLowerCase() === 'h2' || target.closest('h1') || target.closest('h2')) {
        setIsTextHover(true);
      } else {
        setIsTextHover(false);
      }
    };

    window.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseover', mouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseover', mouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner instant dot */}
      <motion.div 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: mousePosition.x - 3, y: mousePosition.y - 3, scale: isHovering ? 0.5 : 1 }}
      />
      
      {/* Outer lagging ring */}
      <motion.div 
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9998] transition-colors duration-200 ${isTextHover ? 'border-[var(--accent-purple)]' : 'border-white/30'}`}
        style={{ 
          x: transformedX, 
          y: transformedY,
          scale: isTextHover ? 2 : (isHovering ? 1.8 : 1),
          opacity: isHovering && !isTextHover ? 0.2 : 1
        }}
      />
    </>
  );
}

export function ScrollIndicators() {
  const [activeSection, setActiveSection] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const sectionHeight = window.innerHeight;
      const currentScroll = window.scrollY + (sectionHeight / 2);
      setActiveSection(Math.floor(currentScroll / sectionHeight));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 hidden md:flex">
      <div className="w-[1px] h-32 bg-white/10 relative">
        <motion.div 
          className="w-full bg-white absolute top-0"
          animate={{ height: `${(activeSection / 8) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {[0,1,2,3,4,5,6,7,8].map((i) => (
        <div 
          key={i} 
          className={`rounded-full transition-all duration-300 ${activeSection === i ? 'w-1.5 h-1.5 bg-white' : 'w-1 h-1 bg-white/20'}`} 
        />
      ))}
    </div>
  );
}
