import React from 'react'
import { Skeleton } from '../ui/skeleton';

const ScheduleCalendarSkeleton = () => {
  return (
    // Loader Skeleton for Calendar
    <div className="animate-pulse space-y-4 p-3">
      {/* Skeleton for Calendar Header */}
      <Skeleton className="h-6 bg-gray-300 rounded w-1/3" />
      {/* Skeleton for Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(7)].map((_, idx) => (
          <Skeleton key={idx} className="h-12 bg-gray-200 rounded" />
        ))}
        {[...Array(21)].map((_, idx) => (
          <Skeleton key={idx} className="h-20 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

export default ScheduleCalendarSkeleton