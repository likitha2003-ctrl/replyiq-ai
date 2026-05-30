'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={cn(
          "relative w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-md animate-scale-in text-white overflow-hidden max-h-[90vh] flex flex-col",
          className
        )}
      >
        {/* Glow header border */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 shrink-0">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 p-0">
            <X size={18} />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
