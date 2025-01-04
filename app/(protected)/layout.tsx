"use client";
import AppContext from "@/context";
import ErrorState from "@/src/components/common/error-state";
import AppSidebar from "@/src/components/partials/app-sidebar";
import {
   SidebarContent,
   SidebarInset,
   SidebarProvider,
} from "@/src/components/ui/sidebar";
import { FetchCurrentUserResponse, useCurrentUser } from "@/src/hooks/use-current-user";
import React from "react";

interface ProtectedLayoutProps {
   children: React.ReactNode;
}

const _ProtectedLayout = ({ children }: ProtectedLayoutProps) => {

   const data = useCurrentUser();

   return (
      <AppContext.Provider value={data}>
         <SidebarProvider className="w-full h-full">
            <AppSidebar />
            <SidebarContent>
               <SidebarInset>{children}</SidebarInset>
            </SidebarContent>
         </SidebarProvider>
      </AppContext.Provider>
   );
};

export default _ProtectedLayout;
