"use client";
import React from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import DataTable from "@/components/common/DataTable";
import FiliereChart from "@/components/common/FiliereChart";
import FinancialChart from "@/components/common/FinancialChart";
import StatCard from "@/components/common/StatCard";
import { ArrowBigLeftDash, ArrowBigRightDash, WalletIcon } from "lucide-react";
import ErrorCard from "@/components/partials/ErrorCard";
import useFetchData from "@/hooks/useFetchData";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Finance", isCurrent: true },
];

const FinancePage: React.FC = () => {
  const navigate = useRouter();
  const {
    data: transactions,
    isLoading,
    error,
  } = useFetchData<[]>("/api/hr/staff");


  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Gestion Financière
        </h2>
      </div>

      {/* Section Résumé Financier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          libelle={"Total des entrées"}
          className="text-green-500"
          data={12000}
          icon={ArrowBigLeftDash}
          unity="XAF"
        />
        <StatCard
          libelle={"Total des Sorties"}
          className="text-red-500"
          data={20000}
          icon={ArrowBigRightDash}
          unity="XAF"
        />
        <StatCard
          libelle={"Balance"}
          data={80000}
          icon={WalletIcon}
          unity="XAF"
        />
      </div>

      {/* Section Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FinancialChart /> 
          <FiliereChart />
      </div>

      {/* Tableau des Transactions */}
      <DataTable
        data={transactions || []}
        columns={[
          { accessorKey: "name", header: "Nom" },
          {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
              <span
                className={`badge p-1 rounded-sm ${
                  row.original.type === "Entrée" ? "bg-green-400" : "bg-red-400"
                } text-white`}
              >
                {row.original.type}
              </span>
            ),
          },
          {
            accessorKey: "amount",
            header: "Montant",
            cell: ({ row }) => (
              <span>{`$${row.original.amount.toFixed(2)}`}</span>
            ),
          },
          { accessorKey: "date", header: "Date" },
        ]}
        filters={["name", "type", "date"]}
        moduleName={"finance"}
      />
    </div>
  );
};

export default FinancePage;
