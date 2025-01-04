"use client";

import React from 'react'
import { Card, CardContent } from "@/src/components/ui/card";
import { DataTable } from '@/src/components/common/data-table';
import { roleColumns } from '@/constants/role-columns';
import { Role } from '@/src/types/role';
import { hasPermission } from '@/src/data/permission';
import { isSuperUser } from '@/src/data/user';
import useFetchData from '@/src/hooks/use-fetch-data';
import ErrorState from '@/src/components/common/error-state';
import { useUserData } from '@/context';


const RoleSection = () => {

   const { permissions, userRole } = useUserData()
   const { data: roles, isLoading, error } = useFetchData<Role[]>('/api/roles');

   if (error) return <ErrorState message={error.message} />;

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

   return (
      <Card>
         <CardContent className="pt-6">
            <DataTable
               columns={roleColumns}
               data={roles || []}
               loading={isLoading}
               onView={isSuperUser(userRole || "") || hasPermission('ROLE_DELETE', permissions || []) ? handleView : undefined}
               onEdit={isSuperUser(userRole || "") || hasPermission('ROLE_DELETE', permissions || []) ? handleEdit : undefined}
               onDelete={isSuperUser(userRole || "") || hasPermission('ROLE_DELETE', permissions || []) ? handleDelete : undefined}
               onAdd={isSuperUser(userRole || "") || hasPermission('ROLE_CREATE', permissions || []) ? handleAdd : undefined}
            />
         </CardContent>
      </Card>
   )
}

export default RoleSection