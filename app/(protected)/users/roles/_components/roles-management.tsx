"use client"

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Shield, LockIcon } from "lucide-react";
import { hasPermission } from '@/src/data/permission';
import UnauthorizedAccess from '@/src/components/common/unauthorized-access';
import { RoleManagementPageProps } from '@/src/types/custom-props';
import ErrorState from '@/src/components/common/error-state';
import { Card, CardContent } from '@/src/components/ui/card';
import { DataTable } from '@/src/components/common/data-table';
import { permissionColumns, roleColumns } from '@/constants/role-columns';
import { isSuperUser } from '@/src/data/user';
import AppPageSkeleton from '@/src/components/skeletons/app-page-skeleton';
import { Role } from '@/src/types/role';

const RoleManagement = ({
   user,
   userPermissions,
   listPermissions,
   listRoles,
   isLoading,
}: RoleManagementPageProps) => {
   const [activeTab, setActiveTab] = useState("roles");

   // CRUD handlers
   const handleView = (role: Role) => {
      console.log("Viewing role:", role);
   };

   const handleEdit = (role: Role) => {
      console.log("Editing role:", role);
   };

   const handleDelete = (role: Role) => {
      console.log("Deleting role:", role);
   };

   const handleAdd = () => {
      console.log("Adding new role");
   };

   if (isLoading) return <AppPageSkeleton />;

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
               <Card>
                  <CardContent className="pt-6">
                     <DataTable
                        columns={roleColumns}
                        data={listRoles || []}
                        loading={isLoading}
                        onView={isSuperUser(userRole || "") || hasPermission('ROLE_DELETE', userPermissions || []) ? handleView : undefined}
                        onEdit={isSuperUser(userRole || "") || hasPermission('ROLE_DELETE', userPermissions || []) ? handleEdit : undefined}
                        onDelete={isSuperUser(userRole || "") || hasPermission('ROLE_DELETE', userPermissions || []) ? handleDelete : undefined}
                        onAdd={isSuperUser(userRole || "") || hasPermission('ROLE_CREATE', userPermissions || []) ? handleAdd : undefined}
                     />
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
               <Card>
                  <CardContent className="pt-6">
                     <DataTable
                        columns={permissionColumns}
                        data={listPermissions || []}
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