import DynamicBreadcrumb from "@/src/components/common/dynamic-breadcrumb";
import React from "react";

const breadcrumbItems = [
   { label: "Tableau de bord", isCurrent: true },
];

const DashboardPage = async () => {
   return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
         <DynamicBreadcrumb breadcrumbItems={breadcrumbItems} />
         <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
         </div>
         <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
               <div className="aspect-video rounded-xl bg-muted/50"></div>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
               <div className="aspect-video rounded-xl bg-muted/50"></div>
            </div>
         </div>
         <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <div className="aspect-video rounded-xl bg-muted/50"></div>
         </div>
      </div>
   );
};

export default DashboardPage;
