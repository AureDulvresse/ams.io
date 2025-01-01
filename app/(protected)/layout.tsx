import AppSidebar from "@/src/components/partials/app-sidebar";
import { SidebarContent, SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import React from "react";

interface ProtectedLayoutProps {
   children: React.ReactNode;
};

const _ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
   return (
      <SidebarProvider className="w-full h-full">
         <AppSidebar />
         <SidebarContent>
            <SidebarInset>
               {children}
            </SidebarInset>
         </SidebarContent>
      </SidebarProvider>
   );
}

export default _ProtectedLayout;