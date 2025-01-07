"use client";
import UserContext from "@/context";
import ErrorState from "@/src/components/common/error-state";
import AppSidebar from "@/src/components/partials/app-sidebar";
import {
   SidebarContent,
   SidebarInset,
   SidebarProvider,
} from "@/src/components/ui/sidebar";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import React from "react";

interface ProtectedLayoutProps {
   children: React.ReactNode;
}

const _ProtectedLayout = ({ children }: ProtectedLayoutProps) => {

   const data = useCurrentUser();

   if (data.error) {
      console.error("Error:", data.error)
      return <ErrorState message={data.error.message} />}

   return (
      <UserContext.Provider value={data}>
         <SidebarProvider className="w-full h-full">
            <AppSidebar />
            <SidebarContent>
               <SidebarInset>{children}</SidebarInset>
            </SidebarContent>
         </SidebarProvider>
      </UserContext.Provider>
   );
};

export default _ProtectedLayout;
