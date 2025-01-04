"use client"

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Shield, LockIcon } from "lucide-react";
import { hasPermission } from '@/src/data/permission';
import UnauthorizedAccess from '@/src/components/common/unauthorized-access';
import { MyPageProps } from '@/src/types/custom-props';
import ErrorState from '@/src/components/common/error-state';
import roleManagementSections from '../_sections/role-management-section';
import { Card, CardContent } from '@/src/components/ui/card';
import { DataTable } from '@/src/components/common/data-table';
import { permissionColumns } from '@/constants/role-columns';
import useFetchData from '@/src/hooks/use-fetch-data';
import { Permission } from '@/src/types/permission';
import { isSuperUser } from '@/src/data/user';
import AppPageSkeleton from '@/src/components/skeletons/app-page-skeleton';

const RoleManagement = ({
   user,
   userPermissions,
   isLoading,
   error,
}: MyPageProps) => {
   const [activeTab, setActiveTab] = useState("roles");
   const { data: appPermissions, isLoading: permissionLoading, error: permissionError } = useFetchData<Permission[]>('/api/permissions');

   if (isLoading || permissionLoading) return <AppPageSkeleton />;
   
   if (error) return <ErrorState message={error.message} />;
   if (permissionError) return <ErrorState message={permissionError.message} />;
   if (!user) return <ErrorState message="Utilisateur non trouvé" />;
   if (!userPermissions?.length) return <ErrorState message="Aucune permission trouvée" />;

   const userRole = user.role.name.toLowerCase();

   // Access control
   const canAccessRoles = isSuperUser(userRole) || hasPermission("SYSTEM_ADMIN", userPermissions || []) || hasPermission("ROLE_SHOW", userPermissions || []);

   if (!canAccessRoles && !isLoading) {
      return <UnauthorizedAccess />;
   }

   return (
      <div className="p-6 space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold font-oswald text-primary">Gestion des Rôles</h1>
               <p className="text-muted-foreground">
                  Gérez les rôles et les permissions des utilisateurs
               </p>
            </div>
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
               <TabsTrigger value="roles" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Rôles
               </TabsTrigger>
               <TabsTrigger value="permissions" className="gap-2">
                  <LockIcon className="w-4 h-4" />
                  Permissions
               </TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="space-y-4">
               {roleManagementSections.map(section => {
                  const hasRole = section.roleNames.includes(userRole);
                  const hasRequiredPermission = hasPermission(section.permission, userPermissions);

                  if (hasRole || hasRequiredPermission) {
                     return (
                        <div key={section.id} className="col-span-full">
                           {section.component}
                        </div>
                     );
                  }
                  return null;
               })}
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
               <Card>
                  <CardContent className="pt-6">
                     <DataTable
                        columns={permissionColumns}
                        data={appPermissions || []}
                        loading={isLoading}
                     />
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </div>
   );
}

export default RoleManagement