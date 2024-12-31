"use client";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import Dashboard from "./_components/dashboard";
import DashboardSkeleton from "./_components/dashboard-skeleton";
import Navbar from "@/src/components/partials/navbar";
import ErrorState from "@/src/components/common/error-state";

const DashboardPage = () => {
   
   const { user, permissions, isLoading, error } = useCurrentUser();

   if (isLoading) return <DashboardSkeleton />

   if (error) return <ErrorState message={error.message} />

   console.log(user, permissions, error)

   return (
      <div>
         <Navbar />
         <Dashboard
            user={user}
            permissions={permissions}
            isLoading={isLoading}
            error={error}
         />
      </div>
   );
};

export default DashboardPage;
