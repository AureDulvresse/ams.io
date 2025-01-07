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
import { createDepartment, deleteDepartment, updateDepartment } from "@/src/actions/department.actions";
import { useRouter } from "next/navigation";
import { useDelete } from "@/src/hooks/use-server-action";
import { toast } from "sonner";

const DepartmentManagement = ({
  user,
  userPermissions,
  listItem,
  isLoading,
}: MyPageProps) => {
  const [isAddModalFormOpen, setIsAddModalFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const departmentForm = useForm<z.infer<typeof departmentSchema>>();
  const router = useRouter();

  // Mutations
  const deleteMutation = useDelete<number>(deleteDepartment, {
    onSuccess: () => {
      toast.success("Departement supprimé avec succès");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Deletion error:", error);
    },
    invalidateQueries: ["/api/departments", "list"],
  });

  // CRUD handlers
  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  const handleView = (department: Department) => {
    // Redirection vers la page de détail
    router.push(`/users/departments/${department.id}`);
  };

  const handleDelete = (department: Department) => {
    deleteMutation.mutate(department.id);
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
        title="Créer un département"
        defaultValues={{
          name: "",
          code: "",
          type: "academic",
          description: "",
        }}
        serverAction={createDepartment}
        invalidQuery={["/api/departments", "list"]}
        successMessage="Département créé avec succès"
      >
        <DepartmentFormFields form={departmentForm} />
      </ModalForm>

      {/* Modal d'édition */}
      {selectedDepartment && (
        <ModalForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDepartment(null);
          }}
          title={`Modifier le rôle: ${selectedDepartment.name}`}
          defaultValues={{
            name: selectedDepartment.name,
            code: selectedDepartment.code,
            type: selectedDepartment.type,
            description: selectedDepartment.description || "",
          }}
          serverAction={(data) => updateDepartment(selectedDepartment.id, data)}
          invalidQuery={["/api/departments", "list"]}
          successMessage="Departement modifié avec succès"
        >
          <DepartmentFormFields form={departmentForm} />
        </ModalForm>
      )}

    </div>
  );
};

export default DepartmentManagement;
