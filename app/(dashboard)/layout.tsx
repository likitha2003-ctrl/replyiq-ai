'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen w-full bg-[#06080f] text-slate-200 flex overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 pb-16 md:pb-0 ${collapsed ? 'md:pl-[64px]' : 'md:pl-[260px]'}`}
      >
        <TopBar collapsed={collapsed} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto mt-16 p-6">
          <div className="mx-auto max-w-7xl h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
