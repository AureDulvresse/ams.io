"use client";
import React from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import ErrorCard from "@/components/partials/ErrorCard";
import useFetchData from "@/hooks/useFetchData";
import { Role } from "@/types";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
    { href: "/settings", label: "Paramètre" },
  { label: "Permissions", isCurrent: true },
];

const columns = [
  {
    accessorKey: "name",
    header: "Désignation",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "updated_at",
    header: "Dernière mise à jour",
  },
];

const filters = ["name"];

const PermissionList: React.FC = () => {
  const navigate = useRouter();

  const { data: roles, isLoading, error } = useFetchData<Role[]>("/api/roles");

  if (error) return <ErrorCard message={error.message} />;

  return (
        <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Liste des permissions
        </h2>
      </div>

      <DataTable
        data={roles || []}
        columns={columns}
        filters={filters}
        showSelection={true}
        isLoading={isLoading}
        moduleName="roles"
      />
    </div>
  );
};

export default PermissionList;
