"use client"
import React from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import ErrorCard from "@/components/partials/ErrorCard";
import { Button } from "@/components/ui/button";
import useFetchData from "@/hooks/useFetchData";
import { User } from "@/types";
import { Plus } from "lucide-react";


const columns = [
  {
    accessorKey: "first_name",
    header: "Prénom",
  },
  {
    accessorKey: "last_name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Adresse e-mail",
  },
  {
    accessorKey: "role_id",
    header: "Rôle",
    cell: ({ row }: { row: { original: User } }) => (
      <span>{row.original.role?.name}</span>
    ),
  },
];

const filters = ["first_name", "last_name", "email"];

const UserManagement: React.FC = () => {
  const navigate = useRouter();

  const {
    data: users,
    isLoading,
    error,
  } = useFetchData<User[]>("/api/users");

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Gestion des utilisateurs
        </h2>
        <Button
          className="font-inter flex items-center gap-1 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
          onClick={() => navigate.push("/configuration/users/create")}
        >
          <Plus className="font-semibold" size={12} />
          Ajouter un utilisateur
        </Button>
      </div>

      <DataTable
        data={users || []}
        columns={columns}
        filters={filters}
        showSelection={true}
        isLoading={isLoading}
        moduleName="users"
      />
    </div>
  );
};

export default UserManagement;
