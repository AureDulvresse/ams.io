"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { LevelStudy } from "@/types";
import DataTable from "@/components/common/DataTable";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import ErrorCard from "@/components/partials/ErrorCard";
import { Button } from "@/components/ui/button";
import useFetchData from "@/hooks/useFetchData";

// Définition des colonnes pour le tableau
const columns = [
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "updated_at",
    header: "Dernière mise à jour",
    cell: ({ row }: { row: { original: LevelStudy } }) => (
      <span>{new Date(row.original.updated_at).toLocaleDateString()}</span>
    ),
  },
];

const filters = ["name"];

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Niveau d'étude", isCurrent: true },
];

const LevelStudyPage: React.FC = () => {
  const navigate = useRouter();
  const {
    data: levelStudys,
    isLoading,
    error,
  } = useFetchData<LevelStudy[]>("/api/level-study");

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Niveaux d'études
        </h2>

        <Button
          className="font-inter flex items-center gap-1 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
          onClick={() => navigate.push("/level-study/create")}
        >
          <Plus className="font-bold" size={18} />
          Ajouter un niveau d'étude
        </Button>
      </div>

      <DataTable
        data={levelStudys || []}
        columns={columns}
        filters={filters}
        isLoading={isLoading}
        moduleName="level-study"
      />
    </div>
  );
};

export default LevelStudyPage;

