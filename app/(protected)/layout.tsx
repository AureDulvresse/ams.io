"use client";
import UserContext from "@/context";
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
