import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";


const DetailSkeleton = () => {
  return (
    <div>
        <div className="flex justify-between items-center mb-3">
           <Skeleton className="w-3/4 h-7 bg-indigo-300 rounded dark:bg-indigo-700 animate-pulse" />
        </div>

        {/* Informations du cours */}
        <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <Skeleton className="w-2/3 h-7 bg-gray-300 rounded dark:bg-gray-700 animate-pulse" />
                <div className="flex space-x-2">
                    <Skeleton className="w-28 h-10 bg-gray-300 rounded dark:bg-gray-700 animate-pulse" />
                    <Skeleton className="w-28 h-10 bg-gray-300 rounded dark:bg-gray-700 animate-pulse" />
                </div>
            </div>
            <Skeleton className="w-1/3 h-5 bg-gray-300 rounded dark:bg-gray-700 animate-pulse mb-2" />
            <Skeleton className="w-1/3 h-5 bg-gray-300 rounded dark:bg-gray-700 animate-pulse mb-2" />
        </Card>

         <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <Skeleton className="w-2/3 h-7 bg-gray-300 rounded dark:bg-gray-700 animate-pulse" />
            </div>
            <Skeleton className="w-1/3 h-5 bg-gray-300 rounded dark:bg-gray-700 animate-pulse mb-2" />
            <Skeleton className="w-1/3 h-5 bg-gray-300 rounded dark:bg-gray-700 animate-pulse mb-2" />
            <Skeleton className="w-1/3 h-5 bg-gray-300 rounded dark:bg-gray-700 animate-pulse mb-2" />
            <Skeleton className="w-1/3 h-5 bg-gray-300 rounded dark:bg-gray-700 animate-pulse mb-2" />
        </Card>
    </div>
  );
};

export default DetailSkeleton;
