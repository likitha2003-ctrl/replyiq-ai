import React from 'react';
import { ParticleBackground } from '../../components/shared/ParticleBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 overflow-hidden select-none">
      {/* Background patterns */}
      <div className="absolute inset-0 cyber-grid opacity-30 z-0 pointer-events-none" />
      <ParticleBackground />

      {/* Floating glowing orbs for ambient look */}
      <div className="absolute top-[20%] left-[20%] h-72 w-72 rounded-full bg-zinc-600/10 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[20%] h-72 w-72 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none z-0" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full px-4">{children}</div>
    </div>
  );
}
