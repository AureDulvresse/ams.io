import Navbar from "@/src/components/partials/navbar";
import { SidebarContent, SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import React from "react";
import UserProfileSidebar from "./_components/user-profile-sidebar";

interface ProtectedLayoutProps {
   children: React.ReactNode;
};

const _AccountLayout = ({ children }: ProtectedLayoutProps) => {
   return (
      <div>
         <Navbar />
         <SidebarProvider className="w-full h-full">
            <UserProfileSidebar />
            <SidebarContent>
               <SidebarInset>
                  {children}
               </SidebarInset>
            </SidebarContent>
         </SidebarProvider>
      </div>

   );
}

export default _AccountLayout;