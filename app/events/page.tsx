"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Event } from "@/types";
import DataTable from "@/components/common/DataTable";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import useFetchData from "@/hooks/useFetchData";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Evenements", isCurrent: true },
];
const columns = [
  {
    accessorKey: "title",
    header: "Intitulé",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }: { row: { original: Event } }) => (
      <span>{new Date(row.original.date).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "duration",
    header: "Durée",
    cell: ({ row }: { row: { original: Event } }) => (
      <span>{`${row.original.duration} jour${
        typeof row.original.duration === "number"
          ? (row.original.duration > 1 ? "s"
          : "") : ""
      }`}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Lieu",
  },
];

const filters = ["title", "location"];

const EventManagementPage: React.FC = () => {
  const navigate = useRouter();
  const {
    data: events,
    isLoading,
    error,
  } = useFetchData<Event[]>("/api/events");

  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Evenements
        </h2>
        <Button
          className="font-inter flex items-center gap-1 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
          onClick={() => navigate.push("/events/create")}
        >
          <Plus className="font-bold" size={18} />
          Planifier un événement
        </Button>
      </div>

      <DataTable
        data={events || []}
        columns={columns}
        filters={filters}
        isLoading={isLoading}
        moduleName="events"
      />
    </div>
  );
};

export default EventManagementPage;
