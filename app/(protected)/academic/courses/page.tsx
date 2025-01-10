"use client";

import React from "react";
import { useUserData } from "@/context";
import { useList } from "@/src/hooks/use-fetch-data";
import ErrorState from "@/src/components/common/error-state";
import Navbar from "@/src/components/partials/navbar";
import AppPageSkeleton from "@/src/components/skeletons/app-page-skeleton";
import DepartmentManagement from "./_components/course-management";
import { Department } from "@/src/types/department";

const BREADCRUMB_ITEMS = [
   { href: "/", label: "Vue d'ensemble" },
   { href: "#", label: "Academie" },
   { label: "Départements / Services", isCurrent: true },
];

export default function DepartmentsPage() {
   // Récupération des données utilisateur depuis le contexte
   const { user, permissions, isLoading: isLoadingUser, error: userError } = useUserData();

   // Récupération des rôles
   const {
      data: departmentsResponse,
      isLoading: isLoadingDepartments,
      error: departmentsError
   } = useList<Department>('/api/departments');

   // Gestion du chargement
   const isLoading = isLoadingUser || isLoadingDepartments;
   if (isLoading) return <AppPageSkeleton />;

   // Gestion des erreurs
   const error = userError || departmentsError;
   if (error) return <ErrorState message={error.message} />;

   // Extraction des données des réponses
   const departments = departmentsResponse?.data ?? [];

   return (
      <div>
         <Navbar breadcrumb={BREADCRUMB_ITEMS} />
         <DepartmentManagement
            user={user}
            userPermissions={permissions}
            listItem={departments}
            isLoading={isLoading}
            error={error}
         />
      </div>
   );
}