import React from 'react';
import { InboxSkeleton, SkeletonLoader } from '../../../components/shared/SkeletonLoader';

export default function InboxLoading() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-950/20 md:rounded-xl border border-white/5 md:shadow-2xl flex-col md:flex-row">
      <div className="w-full md:w-[300px] shrink-0 border-r border-white/5 bg-slate-900/40 p-4">
        <InboxSkeleton />
      </div>
      <div className="flex-1 p-6 space-y-6">
        <div className="flex gap-4 w-full">
          <SkeletonLoader className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 w-full max-w-md">
            <SkeletonLoader className="h-4 w-1/3" />
            <SkeletonLoader className="h-16 rounded-2xl rounded-tr-sm w-full" />
          </div>
        </div>
        <div className="flex gap-4 w-full justify-end">
          <div className="flex flex-col gap-2 w-full max-w-sm items-end">
            <SkeletonLoader className="h-4 w-1/4" />
            <SkeletonLoader className="h-12 rounded-2xl rounded-tl-sm w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
