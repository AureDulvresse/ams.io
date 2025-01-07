"use client";
import React from "react";
import ErrorState from "../common/error-state";
import { Sidebar } from "../ui/sidebar";
import AppSidebarUser from "./app-sidebar-user";
import AppSidebarSkeleton from "../skeletons/app-sidebar-skeleton";
import { useUserData } from "@/context";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { user, permissions, isLoading, error } = useUserData();

  if (isLoading)
    return (
      <Sidebar {...props} collapsible="icon">
        <AppSidebarSkeleton />
      </Sidebar>
    );

  if (error) return <ErrorState message={error.message} />;

  return (
    <Sidebar
      {...props}
      collapsible="icon"
      className="z-80 bg-gradient-to-b from-white to-gray-200 dark:from-gray-900 dark:to-gray-950 sm:from-white sm:to-gray-200 sm:dark:from-gray-900 sm:dark:to-gray-950"
    >
      <AppSidebarUser user={user} permissions={permissions || []} />
    </Sidebar>

  );
};

export default AppSidebar;
