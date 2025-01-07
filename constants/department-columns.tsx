"use client"

import { Department } from "@/src/types/department";
import { ColumnDef } from "@tanstack/react-table"

export const departmentColumns: ColumnDef<Department, any>[] = [
   {
      accessorKey: "code",
      header: "Code",
   },
   {
      accessorKey: "name",
      header: "Nom",
   },
   {
      accessorKey: "type",
      header: "Type",
   },
   {
      accessorKey: "description",
      header: "Description",
   },
   {
      accessorKey: "updatedAt",
      header: "Dernière mise à jour de création",
      cell: ({ row }) => row.original.updated_at ? new Date(row.original.updated_at).toLocaleDateString() : new Date(row.original.created_at).toLocaleDateString(),
   },
];