"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Task = {
   id: string
   title: string
   status: "pending" | "processing" | "success" | "failed"
   description: string
}

export const taskColumns: ColumnDef<Task>[] = [
   {
      accessorKey: "title",
      header: "Intitulé",
   },
   {
      accessorKey: "description",
      header: "Description",
   },
   {
      accessorKey: "status",
      header: "Status",
   },
]
