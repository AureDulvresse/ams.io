"use client";

import React from "react";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import ErrorState from "@/src/components/common/error-state";
import Navbar from "@/src/components/partials/navbar";
import RoleManagement from "./_components/roles-management";
import { useUserData } from "@/context";
import useFetchData from "@/src/hooks/use-fetch-data";
import { Permission } from "@/src/types/permission";
import { Role } from "@/src/types/role";

const breadcrumbItems = [
   { href: "/", label: "Vue d'ensemble" },
   { href: "#", label: "Paramètre" },
   {
      href: "#",
      label: "Paramètre",
      isDropdown: true,
      dropdownItems: [
         { label: "Utilisateurs", href: "#" }
      ],
   },
   { label: "Rôle & Permissions", isCurrent: true },
];

const RolesPage = () => {
   const { user, permissions, isLoading, error } = useUserData();
   const { data: appPermissions, isLoading: loadingPermissions, error: errorPermission } = useFetchData<Permission[]>('/api/permissions');
   const { data: roles, isLoading: loadingRoles, error: errorRole } = useFetchData<Role[]>('/api/roles');


   if (loadingPermissions || loadingRoles) return null
   if (error) return <ErrorState message={error.message} />;
   if (errorPermission) return <ErrorState message={errorPermission.message} />;
   if (errorRole) return <ErrorState message={errorRole.message} />;

   return (
      <div>
         <Navbar breadcrumb={breadcrumbItems} />
         <RoleManagement
            user={user}
            userPermissions={permissions}
            listPermissions={appPermissions || []}
            listRoles={roles}
            isLoading={isLoading}
            error={error}
         />
      </div>
   );
};

export default RolesPage;
