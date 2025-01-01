import React from "react";

const DashboardSkeleton = () => (
   <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 aspect-video rounded-xl bg-muted/50 w-1/4"></div>
      <div className="h-6 aspect-video rounded-xl bg-muted/50 w-2/4"></div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
         {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video rounded-xl bg-muted/50"></div>
         ))}   
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
         <div className="min-h-[100vh] flex-1 aspect-video rounded-xl bg-muted/50 md:min-h-min" />
      </div>
   </div>
);

export default DashboardSkeleton;