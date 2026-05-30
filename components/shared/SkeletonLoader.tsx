'use client';

import React from 'react';
import { cn } from '../../lib/utils';

// Base shimmer unit
export function SkeletonLoader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg animate-shimmer',
        'bg-gradient-to-r from-zinc-800/60 via-zinc-700/40 to-zinc-800/60',
        'bg-[length:200%_100%]',
        className
      )}
      style={{ willChange: 'background-position' }}
      {...props}
    />
  );
}

// Text line skeleton
export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader
          key={i}
          className="h-3"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

// Avatar skeleton
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' };
  return <SkeletonLoader className={cn('rounded-full shrink-0', dims[size])} />;
}

// Stat card skeleton
export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-white/[0.04] bg-zinc-950/20 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <SkeletonLoader className="h-2.5 w-24" />
          <SkeletonLoader className="h-7 w-20" />
        </div>
        <SkeletonLoader className="h-9 w-9 rounded-xl" />
      </div>
      <div className="flex items-end justify-between">
        <SkeletonLoader className="h-4 w-20 rounded-full" />
        <SkeletonLoader className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-white/[0.04] bg-zinc-950/20 p-5 space-y-4', className)}>
      <div className="space-y-1">
        <SkeletonLoader className="h-3.5 w-40" />
        <SkeletonLoader className="h-2.5 w-60" />
      </div>
      <div className="h-52 rounded-xl bg-zinc-900/30 flex items-end gap-2 px-4 pb-4 overflow-hidden">
        {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
          <SkeletonLoader key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

// Conversation list skeleton
export function InboxSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonLoader className="h-9 w-full rounded-xl" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.03] bg-zinc-900/20">
          <AvatarSkeleton />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex justify-between">
              <SkeletonLoader className="h-3 w-24" />
              <SkeletonLoader className="h-2.5 w-10" />
            </div>
            <SkeletonLoader className="h-2.5 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Page-level analytics skeleton
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ChartSkeleton className="lg:col-span-3" />
        <ChartSkeleton className="lg:col-span-2" />
      </div>
    </div>
  );
}

export default SkeletonLoader;
