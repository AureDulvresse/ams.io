"use client";
import { logout } from "@/src/actions/auth.actions";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import useFetchData from "@/src/hooks/use-fetch-data";
import Dashboard from "./_components/dashboard";
import { Permission } from "@/src/types/permission";
import { toast } from "sonner";
import { Suspense } from "react";
import DashboardSkeleton from "./_components/dashboard-skeleton";

const DashboardPage = () => {
   const user = useCurrentUser();
   const {
      data: permissions,
      isLoading,
      error,
   } = useFetchData<Permission[]>(`/api/permissions?userId=${user?.id}`);

   const handleLogout = async () => {
      await logout();
      toast.success("Déconnexion effectuée !");
   };

   return (
      <Suspense fallback={<DashboardSkeleton />}>
         <Dashboard
            user={user}
            permissions={permissions}
            isLoading={isLoading}
            error={error}
            onLogout={handleLogout}
         />
      </Suspense>
      
   );
};

export default DashboardPage;
