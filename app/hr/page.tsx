"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Plus, User2, WalletIcon } from "lucide-react";
import { Staff } from "@/types";
import DataTable from "@/components/common/DataTable";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import ErrorCard from "@/components/partials/ErrorCard";
import useFetchData from "@/hooks/useFetchData";


const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Ressources humaine", isCurrent: true },
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
  },
  {
    accessorKey: "pob",
    header: "Lieu de naissance",
  },
  {
    accessorKey: "gender",
    header: "Sexe",
    cell: ({ row }: { row: { original: Staff } }) => (
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
    accessorKey: "email",
    header: "Adresse e-mail",
  },
  {
    accessorKey: "address",
    header: "Adresse",
  },
];

const filters = ["first_name", "last_name", "dob", "sexe"];

const StaffManagementPage: React.FC = () => {
  const navigate = useRouter();
  const {
    data: staffs,
    isLoading,
    error,
  } = useFetchData<Staff[]>("/api/hr/staff");

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Gestion du personnel
        </h2>
        <div className="flex space-x-2">
          <Button
            className="font-inter flex items-center gap-1 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
            onClick={() => navigate.push("/hr/staff/hire")}
          >
            <Plus className="font-bold" size={18} />
            Ajouter un personnel
          </Button>
          <Button
            className="font-inter flex items-center gap-1 bg-gradient-to-tr from-green-300 to-green-400 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
            onClick={() => alert("Suivi de présence")}
          >
            <User2 className="font-bold" size={18} />
            Suivi de présence
          </Button>
          <Button
            className="font-inter flex items-center gap-1 bg-gradient-to-tr from-pink-400 to-pink-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
            onClick={() => navigate.push("")}
          >
            <WalletIcon className="font-bold" size={18} />
            Gestion de la paie
          </Button>
        </div>
      </div>

      <DataTable
        data={staffs || []}
        columns={columns}
        filters={filters}
        isLoading={isLoading}
        showSelection={true}
        moduleName="rh"
      />
    </div>
  );
};

export default StaffManagementPage;
