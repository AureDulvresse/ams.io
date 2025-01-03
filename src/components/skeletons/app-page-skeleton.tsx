import React from "react";

const AppPageSkeleton = () => (
   <div className="p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
         <div className="h-8 aspect-video rounded-xl bg-muted/50 w-1/4"></div>
         <div className="h-8 aspect-video rounded-xl bg-muted/50 w-1/4"></div>
      </div>
      <div className="h-6 aspect-video rounded-xl bg-muted/50 w-2/4"></div>
      <div className="flex flex-1 flex-col gap-4 p-2">
         <div className="min-h-[100vh] flex-1 aspect-video rounded-xl bg-muted/50 md:min-h-min" />
      </div>
   </div>
);

export default AppPageSkeleton;