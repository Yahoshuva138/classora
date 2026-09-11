import React from 'react';

export const SkeletonPulse: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`} />
);

export const SkeletonMetricCard: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <SkeletonPulse className="h-4 w-28" />
      <SkeletonPulse className="h-9 w-9 rounded-xl" />
    </div>
    <div>
      <SkeletonPulse className="h-8 w-20 mb-2" />
      <SkeletonPulse className="h-3 w-36" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
      <SkeletonPulse className="h-5 w-40" />
      <SkeletonPulse className="h-8 w-32 rounded-lg" />
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3 flex-1">
            <SkeletonPulse className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <SkeletonPulse className="h-4 w-1/3" />
              <SkeletonPulse className="h-3 w-1/4" />
            </div>
          </div>
          <SkeletonPulse className="h-6 w-20 rounded-full" />
          <SkeletonPulse className="h-8 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonProfile: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
    <div className="flex items-center space-x-4">
      <SkeletonPulse className="h-16 w-16 rounded-2xl shrink-0" />
      <div className="space-y-2 flex-1">
        <SkeletonPulse className="h-6 w-1/3" />
        <SkeletonPulse className="h-4 w-1/4" />
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonPulse key={i} className="h-20 rounded-xl" />
      ))}
    </div>
    <div className="space-y-3">
      <SkeletonPulse className="h-5 w-1/4" />
      <SkeletonPulse className="h-32 rounded-xl" />
    </div>
  </div>
);
