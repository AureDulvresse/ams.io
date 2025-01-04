"use client";

import React from "react";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import ErrorState from "@/src/components/common/error-state";
import Navbar from "@/src/components/partials/navbar";
import RoleManagement from "./_components/roles-management";
import { useUserData } from "@/context";
import useFetchData from "@/src/hooks/use-fetch-data";
import { Permission } from "@/src/types/permission";

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
   const { data: appPermissions, isLoading: fetchLoading, error: fetchError } = useFetchData<Permission[]>('/api/permissions');

   if (fetchLoading) return null
   if (error) return <ErrorState message={error.message} />;
   if (fetchError) return <ErrorState message={fetchError.message} />;

   return (
      <div>
         <Navbar breadcrumb={breadcrumbItems} />
         <RoleManagement
            user={user}
            userPermissions={permissions}
            listPermissions={appPermissions || []}
            isLoading={isLoading}
            error={error}
         />
      </div>
   );
};

export default RolesPage;
