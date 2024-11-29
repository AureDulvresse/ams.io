"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Student } from "@/types";
import DataTable from "@/components/common/DataTable";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import useFetchData from "@/hooks/useFetchData";
import ErrorCard from "@/components/partials/ErrorCard";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Gestion Etudiant", isCurrent: true },
];

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
    accessorKey: "dob",
    header: "Date de naissance",
    cell: ({ row }: { row: { original: Student } }) => (
      <span>{new Date(row.original.dob).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "gender",
    header: "Sexe",
    cell: ({ row }: { row: { original: Student } }) => (
      <span
        className={`badge rounded-full shadow-sm p-1.5 text-sm text-white dark:text-gray-800 ${
          row.original.gender === "M" ? "bg-blue-400" : "bg-pink-400"
        }`}
      >
        {row.original.gender === "M" ? "Masculin" : "Féminin"}
      </span>
    ),
  },
  {
    accessorKey: "levelStudy_id",
    header: "Niveau d'étude",
    cell: ({ row }: { row: { original: Student } }) => (
      <span>{row.original.levelStudy?.designation}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Adresse e-mail",
  },
  {
    accessorKey: "address",
    header: "Adresse",
  },
];

const filters = ["first_name", "last_name", "dob", "sexe"];

const StudentManagementPage: React.FC = () => {
  const navigate = useRouter();
  const {
    data: students,
    isLoading,
    error,
  } = useFetchData<Student[]>("/api/students");

  if (error) return <ErrorCard message={error.message} />;

  return (
  
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Gestion des étudiants
        </h2>
        <Button
          className="font-inter flex items-center gap-1 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
          onClick={() => navigate.push("/students/create")}
        >
          <Plus className="font-semibold" size={12} />
          Ajouter un étudiant
        </Button>
      </div>

      <DataTable
        data={students || []}
        columns={columns}
        filters={filters}
        showSelection={true}
        isLoading={isLoading}
        moduleName="students"
      />
    </div>
  );
};

export default StudentManagementPage;
