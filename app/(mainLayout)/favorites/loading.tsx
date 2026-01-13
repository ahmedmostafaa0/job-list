import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";


const FavoriteJobs = () => {
  return (
    <div className="flex flex-col gap-6">
        {[...Array(10)].map((_, index) => (
        <Card key={index}>
            <CardHeader>
                <div className="flex flex-col md:flex-row gap-4">
                {/* Logo */}
                <Skeleton className="size-12 rounded-lg" />

                {/* Main content */}
                <div className="flex flex-col flex-grow space-y-2">
                    <Skeleton className="h-6 w-3/4" />

                    <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                    </div>
                </div>

                {/* Right side */}
                <div className="md:ml-auto space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-20 ml-auto" />
                </div>
                </div>

                {/* Description */}
                <div className="!mt-5 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                </div>
            </CardHeader>
        </Card>
        ))}
    </div>
  );
};

export default FavoriteJobs