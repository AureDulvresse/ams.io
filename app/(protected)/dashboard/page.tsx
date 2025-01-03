"use client";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import Dashboard from "./_components/dashboard";
import Navbar from "@/src/components/partials/navbar";
import ErrorState from "@/src/components/common/error-state";

const breadcrumbItems = [
   { label: "Vue d'ensemble", isCurrent: true },
];

const DashboardPage = () => {

   const { user, permissions, isLoading, error } = useCurrentUser();

   if (error) return <ErrorState message={error.message} />

   return (
      <div>
         <Navbar breadcrumb={breadcrumbItems} />
         <Dashboard
            user={user}
            userPermissions={permissions}
            isLoading={isLoading}
            error={error}
         />
      </div>
   );
};

export default DashboardPage;
