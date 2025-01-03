"use client";
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
   return (
      <SidebarProvider className="w-full h-full">
         <AppSidebar />
         <SidebarContent>
            <SidebarInset>{children}</SidebarInset>
         </SidebarContent>
      </SidebarProvider>
   );
};

export default _ProtectedLayout;
