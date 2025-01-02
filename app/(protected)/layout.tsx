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
   const { isLoading, error } = useCurrentUser();

   if (isLoading)
      return (
         <div className="flex items-center justify-center flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex space-x-2">
               <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
               <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
               <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-400"></div>
            </div>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
               Chargement...
            </p>
         </div>
      );
   if (error) return <ErrorState message={error.message} />;

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
