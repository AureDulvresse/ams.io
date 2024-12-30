"use client";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import useFetchData from "@/src/hooks/use-fetch-data";
import Dashboard from "./_components/dashboard";
import { Permission } from "@/src/types/permission";
import { Suspense } from "react";
import DashboardSkeleton from "./_components/dashboard-skeleton";
import Navbar from "@/src/components/partials/navbar";

const DashboardPage = () => {
   const user = useCurrentUser();
   const {
      data: permissions,
      isLoading,
      error,
   } = useFetchData<Permission[]>(`/api/permissions?userId=${user?.id}`);

   return (
      <div>
         <Navbar />
         <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard
               user={user}
               permissions={permissions}
               isLoading={isLoading}
               error={error}
            />
         </Suspense>
      </div>
   );
};

export default DashboardPage;
