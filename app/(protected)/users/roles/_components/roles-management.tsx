"use client"

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Card, CardContent } from "@/src/components/ui/card";
import { Shield, LockIcon } from "lucide-react";
import { hasPermission } from '@/src/data/permission';
import UnauthorizedAccess from '@/src/components/common/unauthorized-access';
import { DataTable } from '@/src/components/common/data-table';
import { Role } from '@/src/types/role';
import { roleColumns } from '@/constants/role-columns';
import { MyPageProps } from '@/src/types/my-page-props';

const RoleManagement = ({
   user,
   userPermissions,
   isLoading,
   error,
}: MyPageProps) => {
   const [activeTab, setActiveTab] = useState("roles");

   // Mock data
   const roles: Role[] = [
      {
         id: 1,
         name: "Administrateur",
         description: "Accès complet au système",
         permissions: ["ALL"],
         created_at: new Date()
      },
      {
         id: 2,
         name: "Enseignant",
         description: "Gestion des cours et notes",
         permissions: ["COURSE_MANAGE", "GRADES_MANAGE"],
         created_at: new Date()
      }
   ];



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

   // Access control
   const canAccessRoles = hasPermission("ROLES_MANAGEMENT_ACCESS", userPermissions || []);

   if (!canAccessRoles && !isLoading) {
      return <UnauthorizedAccess />;
   }

   if (isLoading) {
      return null;
   }

   return (
      <div className="p-6 space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold">Gestion des Rôles</h1>
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
                        data={roles}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAdd={handleAdd}
                        pageSize={5}
                     />
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
               {/* Permissions content would go here */}
            </TabsContent>
         </Tabs>
      </div>
   );
}

export default RoleManagement