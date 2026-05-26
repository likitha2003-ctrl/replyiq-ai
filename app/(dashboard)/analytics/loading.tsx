import React from 'react';
import { StatCardSkeleton, ChartSkeleton, SkeletonLoader } from '../../../components/shared/SkeletonLoader';

export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden p-8 gap-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between shrink-0">
        <div className="space-y-2">
          <SkeletonLoader className="h-5 w-44" />
          <SkeletonLoader className="h-3 w-72" />
        </div>
        <div className="flex gap-2">
          <SkeletonLoader className="h-8 w-24 rounded-lg" />
          <SkeletonLoader className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart areas */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        <ChartSkeleton className="lg:col-span-3" />
        <ChartSkeleton className="lg:col-span-2" />
      </div>

      {/* Second row charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 shrink-0">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
