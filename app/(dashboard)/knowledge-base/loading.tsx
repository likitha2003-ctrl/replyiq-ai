import React from 'react';
import { SkeletonLoader } from '../../../components/shared/SkeletonLoader';

export default function KnowledgeBaseLoading() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden p-8 gap-6">
      {/* Status strip skeleton */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.04] bg-zinc-900/40 shrink-0">
        <div className="flex items-center gap-3">
          <SkeletonLoader className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <SkeletonLoader className="h-3 w-20" />
            <SkeletonLoader className="h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="space-y-1.5">
            <SkeletonLoader className="h-2.5 w-28" />
            <SkeletonLoader className="h-4 w-16" />
          </div>
          <div className="h-6 w-px bg-white/5" />
          <div className="space-y-1.5">
            <SkeletonLoader className="h-2.5 w-20" />
            <SkeletonLoader className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        {/* Left: editor panel */}
        <div className="lg:col-span-3 rounded-2xl border border-white/[0.04] bg-zinc-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
            <SkeletonLoader className="h-4 w-28" />
            <SkeletonLoader className="h-7 w-20 rounded-lg" />
          </div>
          <div className="flex gap-2 pb-3 border-b border-white/[0.03]">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-6 w-20 rounded-lg" />
            ))}
          </div>
          <div className="flex-1 space-y-2 pt-2">
            {Array.from({ length: 18 }).map((_, i) => (
              <SkeletonLoader
                key={i}
                className="h-3 rounded"
                style={{ width: i % 5 === 4 ? '40%' : i % 3 === 0 ? '70%' : '100%' }}
              />
            ))}
          </div>
        </div>

        {/* Right: sandbox panel */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.04] bg-zinc-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
            <SkeletonLoader className="h-4 w-24" />
            <SkeletonLoader className="h-3 w-32" />
          </div>
          <div className="flex-1 border border-white/[0.05] rounded-xl p-4 bg-zinc-950/30 space-y-4 min-h-[200px]">
            <div className="flex justify-center flex-col items-center gap-3 pt-8">
              <SkeletonLoader className="h-12 w-12 rounded-full" />
              <SkeletonLoader className="h-4 w-32" />
              <SkeletonLoader className="h-3 w-48" />
            </div>
            <div className="pt-4 border-t border-white/[0.03] space-y-2">
              <SkeletonLoader className="h-2.5 w-24" />
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonLoader key={i} className="h-7 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <SkeletonLoader className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
