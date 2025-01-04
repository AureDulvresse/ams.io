"use client";
import Dashboard from "./_components/dashboard";
import Navbar from "@/src/components/partials/navbar";
import ErrorState from "@/src/components/common/error-state";
import { useUserData } from "@/context";

const breadcrumbItems = [
   { label: "Vue d'ensemble", isCurrent: true },
];

const DashboardPage = () => {

   const { user, permissions, isLoading, error } = useUserData();

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
