"use client";
import { logout } from "@/src/actions/auth.actions";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import useFetchData from "@/src/hooks/use-fetch-data";
import Dashboard from "./_components/dashboard";
import { Permission } from "@/src/types/permission";
import { toast } from "sonner";

const DashboardPage = () => {
   const user = useCurrentUser();
   const {
      data: permissions,
      isLoading,
      error,
   } = useFetchData<Permission[]>(`/api/permissions?userId=${user?.id}`);

   console.log(permissions);
   const handleLogout = async () => {
      await logout();
      toast.success("Déconnexion effectuée !");
   };

   return (
      <Dashboard
         user={user}
         permissions={permissions}
         isLoading={isLoading}
         error={error}
         onLogout={handleLogout}
      />
   );
};

export default DashboardPage;
