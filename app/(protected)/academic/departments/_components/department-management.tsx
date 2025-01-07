"use client";

import React, { useState } from "react";
import { hasPermission } from "@/src/data/permission";
import UnauthorizedAccess from "@/src/components/common/unauthorized-access";
import { MyPageProps } from "@/src/types/custom-props";
import ErrorState from "@/src/components/common/error-state";
import { Card, CardContent } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/common/data-table";
import { isSuperUser } from "@/src/data/user";
import AppPageSkeleton from "@/src/components/skeletons/app-page-skeleton";
import ModalForm from "@/src/components/common/modal-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { departmentSchema } from "@/src/schemas/department.schema";
import { DepartmentFormFields } from "@/src/forms/department-form";
import { Department } from "@/src/types/department";
import { departmentColumns } from "@/constants/department-columns";
import { createDepartment } from "@/src/actions/department.actions";

const DepartmentManagement = ({
  user,
  userPermissions,
  listItem,
  isLoading,
}: MyPageProps) => {
  const [isAddModalFormOpen, setIsAddModalFormOpen] = useState(false);
  const departmentForm = useForm<z.infer<typeof departmentSchema>>();

  // CRUD handlers
  const handleView = (department: Department) => {
    console.log("Viewing department:", department);
  };

  const handleEdit = (department: Department) => {
    console.log("Editing department:", department);
  };

  const handleDelete = (department: Department) => {
    console.log("Deleting department:", department);
  };

  if (isLoading) return <AppPageSkeleton />;

  if (!user) return <ErrorState message="Utilisateur non trouvé" />;
  if (!userPermissions?.length)
    return <ErrorState message="Aucune permission trouvée" />;

  const userRole = user.role.name.toLowerCase();

  // Access control
  const canAccessDepartments =
    isSuperUser(userRole) ||
    hasPermission("SYSTEM_ADMIN", userPermissions || []) ||
    hasPermission("DEPARTMENT_SHOW", userPermissions || []);

  if (!canAccessDepartments && !isLoading) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-oswald text-primary">
            Gestion des Départements
          </h1>
          <p className="text-muted-foreground">
            Gérez les départements d'étude, facultés ou services administratifs
            de votre établissement
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={departmentColumns}
            data={listItem || []}
            loading={isLoading}
            onView={
              isSuperUser(userRole || "") ||
              hasPermission("DEPARTMENT_VIEW", userPermissions || [])
                ? handleView
                : undefined
            }
            onEdit={
              isSuperUser(userRole || "") ||
              hasPermission("DEPARTMENT_EDIT", userPermissions || [])
                ? handleEdit
                : undefined
            }
            onDelete={
              isSuperUser(userRole || "") ||
              hasPermission("DEPARTMENT_DELETE", userPermissions || [])
                ? handleDelete
                : undefined
            }
            onAdd={
              isSuperUser(userRole || "") ||
              hasPermission("DEPARTMENT_CREATE", userPermissions || [])
                ? () => setIsAddModalFormOpen(true)
                : undefined
            }
          />
        </CardContent>
      </Card>

      <ModalForm
        isOpen={isAddModalFormOpen}
        onClose={() => setIsAddModalFormOpen(false)}
        title="Créer un Département"
        defaultValues={{
          name: "",
          code: "",
          type: "academic",
          description: "",
        }}
        serverAction={createDepartment}
        successMessage="Département créé avec succès"
      >
        <DepartmentFormFields form={departmentForm} />
      </ModalForm>
    </div>
  );
};

export default DepartmentManagement;
