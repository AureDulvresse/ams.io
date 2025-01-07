"use client";

import React from "react";
import { useUserData } from "@/context";
import { useList } from "@/src/hooks/use-fetch-data";
import { Permission } from "@/src/types/permission";
import { Role } from "@/src/types/role";
import ErrorState from "@/src/components/common/error-state";
import Navbar from "@/src/components/partials/navbar";
import RoleManagement from "./_components/roles-management";
import AppPageSkeleton from "@/src/components/skeletons/app-page-skeleton";

const BREADCRUMB_ITEMS = [
   { href: "/", label: "Vue d'ensemble" },
   { href: "#", label: "Paramètre" },
   {
      href: "#",
      label: "Paramètre",
      isDropdown: true,
      dropdownItems: [{ label: "Utilisateurs", href: "#" }],
   },
   { label: "Rôle & Permissions", isCurrent: true },
];

export default function RolesPage() {
   // Récupération des données utilisateur depuis le contexte
   const { user, permissions, isLoading: isLoadingUser, error: userError } = useUserData();

   // Récupération des permissions de l'application
   const {
      data: appPermissionsResponse,
      isLoading: isLoadingPermissions,
      error: permissionsError
   } = useList<Permission>('/api/permissions');

   // Récupération des rôles
   const {
      data: rolesResponse,
      isLoading: isLoadingRoles,
      error: rolesError
   } = useList<Role>('/api/roles');

   // Gestion du chargement
   const isLoading = isLoadingUser || isLoadingPermissions || isLoadingRoles;
   if (isLoading) return <AppPageSkeleton />;

   // Gestion des erreurs
   const error = userError || permissionsError || rolesError;
   if (error) return <ErrorState message={error.message} />;

   // Extraction des données des réponses
   const appPermissions = appPermissionsResponse?.data ?? [];
   const roles = rolesResponse?.data ?? [];

   return (
      <div>
         <Navbar breadcrumb={BREADCRUMB_ITEMS} />
         <RoleManagement
            user={user}
            userPermissions={permissions}
            listPermissions={appPermissions}
            listRoles={roles}
            isLoading={isLoading}
            error={error}
         />
      </div>
   );
}