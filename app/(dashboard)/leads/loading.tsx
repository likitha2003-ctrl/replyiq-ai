import React from 'react';
import { StatCardSkeleton, SkeletonLoader } from '../../../components/shared/SkeletonLoader';

export default function LeadsLoading() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden p-8 gap-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between shrink-0">
        <div className="space-y-2">
          <SkeletonLoader className="h-5 w-36" />
          <SkeletonLoader className="h-3 w-64" />
        </div>
        <SkeletonLoader className="h-8 w-28 rounded-lg" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Kanban columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
        {Array.from({ length: 3 }).map((_, col) => (
          <div key={col} className="rounded-2xl border border-white/[0.04] bg-slate-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <SkeletonLoader className="h-4 w-20" />
              <SkeletonLoader className="h-5 w-6 rounded-full" />
            </div>
            {Array.from({ length: col === 0 ? 3 : col === 1 ? 2 : 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/[0.04] bg-slate-900/30 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <SkeletonLoader className="h-3.5 w-24" />
                  <SkeletonLoader className="h-5 w-12 rounded-full" />
                </div>
                <SkeletonLoader className="h-2.5 w-32" />
                <div className="flex items-center gap-2 pt-1">
                  <SkeletonLoader className="h-5 w-16 rounded-full" />
                  <SkeletonLoader className="h-5 w-20 rounded-full" />
                </div>
                <SkeletonLoader className="h-1.5 w-full rounded-full" />
                <div className="flex justify-between">
                  <SkeletonLoader className="h-3 w-20" />
                  <SkeletonLoader className="h-6 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
