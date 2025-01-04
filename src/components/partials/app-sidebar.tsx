"use client";
import React from "react";
import ErrorState from "../common/error-state";
import { Sidebar } from "../ui/sidebar";
import AppSidebarUser from "./app-sidebar-user";
import AppSidebarSkeleton from "../skeletons/app-sidebar-skeleton";
import { useContextData } from "@/context";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { user, permissions, isLoading, error } = useContextData();

  if (isLoading)
    return (
      <Sidebar {...props} collapsible="icon">
        <AppSidebarSkeleton />
      </Sidebar>
    );

  if (error) return <ErrorState message={error.message} />;

  return (
    <Sidebar {...props} collapsible="icon">
      <AppSidebarUser user={user} permissions={permissions || []} />
    </Sidebar>
  );
};

export default AppSidebar;
