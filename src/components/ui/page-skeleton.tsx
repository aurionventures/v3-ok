import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PageSkeletonProps {
  variant?: "dashboard" | "form" | "list" | "default";
  className?: string;
}

export function PageSkeleton({ variant = "default", className }: PageSkeletonProps) {
  if (variant === "dashboard") {
    return (
      <div className={cn("p-6 space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border rounded-lg p-4 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="border rounded-lg p-4 space-y-4">
            <Skeleton className="h-6 w-24" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className={cn("p-6 max-w-2xl mx-auto space-y-6", className)}>
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("p-6 space-y-6", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Table Header */}
        <div className="border rounded-lg">
          <div className="p-4 border-b flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
          
          {/* Table Rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 border-b last:border-0 flex gap-4 items-center">
              <Skeleton className="h-4 w-4" />
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("p-6 space-y-6", className)}>
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
