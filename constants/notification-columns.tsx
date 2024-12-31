"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Notification = {
   id: string
   description: string
   date: Date | string
}

export const notificationColumns: ColumnDef<Notification>[] = [
   {
      accessorKey: "description",
      header: "Description",
   },
   {
      accessorKey: "date",
      header: "Date",
   },
]
