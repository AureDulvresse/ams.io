"use client";

import React, { useState } from "react";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/src/components/ui/tabs";
import { Shield, Lock } from "lucide-react";
import { hasPermission } from "@/src/data/permission";
import UnauthorizedAccess from "@/src/components/common/unauthorized-access";
import { RoleManagementPageProps } from "@/src/types/custom-props";
import ErrorState from "@/src/components/common/error-state";
import { Card, CardContent } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/common/data-table";
import { permissionColumns, roleColumns } from "@/constants/role-columns";
import { isSuperUser } from "@/src/data/user";
import AppPageSkeleton from "@/src/components/skeletons/app-page-skeleton";
import { Role } from "@/src/types/role";
import ModalForm from "@/src/components/common/modal-form";
import { createRole, deleteRole } from "@/src/actions/role.actions";
import { RoleFormFields } from "@/src/forms/role-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { roleSchema } from "@/src/schemas/role.schema";
import { useDelete, useServerAction } from "@/src/hooks/use-server-action";
import { toast } from "sonner";

const RoleManagement = ({
   user,
   userPermissions,
   listPermissions,
   listRoles,
   isLoading,
}: RoleManagementPageProps) => {
   const [activeTab, setActiveTab] = useState("roles");
   const [isAddModalFormOpen, setIsAddModalFormOpen] = useState(false);
   const roleForm = useForm<z.infer<typeof roleSchema>>();

   // Mutations
   const deleteMutation = useServerAction<number>(deleteRole, {
      onSuccess: (data) => {
         toast.success("Rôle supprimé avec succès");
      },
      onError: (error) => {
         toast.error(error.message);
         console.error('Deletion error:', error);
      },
      invalidateQueries: ["/api/roles", "list"],
   }
   )

   // CRUD handlers
   const handleView = (role: Role) => {
      console.log("Viewing role:", role);
   };

   const handleEdit = (role: Role) => {
      console.log("Editing role:", role);
   };

   const handleDelete = async (role: Role) => {
      deleteMutation.mutate(role.id)
   };

   if (isLoading) return <AppPageSkeleton />;

   if (!user) return <ErrorState message="Utilisateur non trouvé" />;
   if (!userPermissions?.length)
      return <ErrorState message="Aucune permission trouvée" />;

   const userRole = user.role.name.toLowerCase();

   // Access control
   const canAccessRoles =
      isSuperUser(userRole) ||
      hasPermission("SYSTEM_ADMIN", userPermissions || []) ||
      hasPermission("ROLE_SHOW", userPermissions || []);

   if (!canAccessRoles && !isLoading) {
      return <UnauthorizedAccess />;
   }

   return (
      <div className="p-6 space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold font-oswald text-primary">
                  Gestion des Rôles
               </h1>
               <p className="text-muted-foreground">
                  Gérez les rôles et les permissions des utilisateurs
               </p>
            </div>
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
               <TabsTrigger value="roles" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Rôles
               </TabsTrigger>
               <TabsTrigger value="permissions" className="gap-2">
                  <Lock className="w-4 h-4" />
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
                        onView={
                           isSuperUser(userRole || "") ||
                              hasPermission("ROLE_VIEW", userPermissions || [])
                              ? handleView
                              : undefined
                        }
                        onEdit={
                           isSuperUser(userRole || "") ||
                              hasPermission("ROLE_EDIT", userPermissions || [])
                              ? handleEdit
                              : undefined
                        }
                        onDelete={
                           isSuperUser(userRole || "") ||
                              hasPermission("ROLE_DELETE", userPermissions || [])
                              ? handleDelete
                              : undefined
                        }
                        onAdd={
                           isSuperUser(userRole || "") ||
                              hasPermission("ROLE_CREATE", userPermissions || [])
                              ? () => setIsAddModalFormOpen(true)
                              : undefined
                        }
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

         <ModalForm
            isOpen={isAddModalFormOpen}
            onClose={() => setIsAddModalFormOpen(false)}
            title="Créer un rôle"
            defaultValues={{ name: "", description: "", permissionIds: [] }}
            serverAction={createRole}
            invalidQuery={['/api/roles', 'list']}
            successMessage="Rôle créé avec succès"
         >
            <RoleFormFields form={roleForm} />
         </ModalForm>
      </div>
   );
};

export default RoleManagement;
