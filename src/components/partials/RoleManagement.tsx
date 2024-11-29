"use client";
import React from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import ErrorCard from "@/components/partials/ErrorCard";
import { Button } from "@/components/ui/button";
import useFetchData from "@/hooks/useFetchData";
import { Role } from "@/types";
import { Plus, Hand } from "lucide-react";

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

const RoleManagement: React.FC = () => {
  const navigate = useRouter();

  const { data: roles, isLoading, error } = useFetchData<Role[]>("/api/roles");

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Gestion des rôles
        </h2>
       
        <Button
          className="font-inter flex items-center gap-1 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
          onClick={() => navigate.push("/configuration/roles/create")}
        >
          <Plus className="font-semibold" size={12} />
          Ajouter un rôle
        </Button>
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

export default RoleManagement;
