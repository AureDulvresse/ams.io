"use client";
import React, { Suspense } from "react";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import ErrorState from "../common/error-state";
import { Sidebar } from "../ui/sidebar";
import AppSidebarUser from "./app-sidebar-user";
import AppSidebarSkeleton from "../skeletons/app-sidebar-skeleton";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {

  const { user, permissions, isLoading, error } = useCurrentUser();

  if (isLoading) return (<Sidebar {...props} collapsible="icon"><AppSidebarSkeleton /></Sidebar>)

  if (error) return <ErrorState message={error.message} />

  return (
    <Sidebar {...props} collapsible="icon">
      <AppSidebarUser user={user} permissions={permissions || []} />
    </Sidebar >
  );
};

export default AppSidebar;