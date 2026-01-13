import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function JobDetailsLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="space-y-8 col-span-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-3 w-full">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Now Card */}
          <Card className="p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>

          {/* Job Details Card */}
          <Card className="p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </Card>

          {/* Company Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
