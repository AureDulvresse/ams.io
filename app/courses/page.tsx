"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Coins, Landmark, Plus } from "lucide-react";
import { Course } from "@/types";
import DataTable from "@/components/common/DataTable";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import ErrorCard from "@/components/partials/ErrorCard";
import useFetchData from "@/hooks/useFetchData";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Gestion des cours", isCurrent: true },
];

const columns = [
  {
    accessorKey: "name",
    header: "Cours",
  },
  {
    accessorKey: "department",
    header: "Departement",
    cell: ({ row }: { row: { original: Course } }) => (
      <span>{row.original.department.name}</span>
    ),
  },
  {
    accessorKey: "credit",
    header: "Nombre de crédit",
    cell: ({ row }: { row: { original: Course } }) => (
      <div className="flex items-center justify-center gap-2 bg-yellow-200 p-1.5 w-2/5 text-md rounded-lg text-yellow-900">
        <span className="font-semibold">{row.original.credits}</span>
        <Coins size={20} />
      </div>
    ),
  },
];

const filters = ["name", "department", "credit"];

const CourseManagementPage: React.FC = () => {
  const navigate = useRouter();
  const {
    data: courses,
    isLoading,
    error,
  } = useFetchData<Course[]>("/api/courses");

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Gestion des cours
        </h2>
        <div className="flex space-x-2">
          <Button
            className="font-inter flex items-center gap-1 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
            onClick={() => navigate.push("/courses/create")}
          >
            <Plus className="font-bold" size={18} />
            Ajouter un nouveau cours
          </Button>
          <Button
            className="font-inter flex items-center gap-1 bg-gradient-to-tr from-green-300 to-green-400 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
            onClick={() => navigate.push("/department")}
          >
            <Landmark className="font-bold" size={18} />
            Gestion des departements
          </Button>
        </div>
      </div>

      <DataTable
        data={courses || []}
        columns={columns}
        filters={filters}
        showSelection={true}
        isLoading={isLoading}
        moduleName="courses"
      />
    </div>
  );
};

export default CourseManagementPage;
