"use client";
import React from "react";
import useFetchData from "@/src/hooks/useFetchData";
import TopBar from "@/src/components/layouts/topbar/top-bar";

const breadcrumbItems = [
   { label: "Tableau de bord", isCurrent: true },
];

const DashboardPage = async () => {
   const {
      data: events,
      isLoading: isLoadingEvent,
      error,
   } = useFetchData<Event[]>("/api/events");

   return (
      <div>
         <TopBar />
         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
      </div>
   );
};

export default DashboardPage;
