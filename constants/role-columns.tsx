"use client"

import { Badge } from "@/src/components/ui/badge";
import { Role } from "@/src/types/role";
import { ColumnDef } from "@tanstack/react-table"

export const roleColumns: ColumnDef<Role, any>[] = [
   {
      accessorKey: "name",
      header: "Nom",
   },
   {
      accessorKey: "description",
      header: "Description",
   },
   {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
         <div className="flex flex-wrap gap-1">
            {row.original.permissions?.map((permission) => (
               <Badge key={permission} variant="secondary" className="text-xs">
                  {permission}
               </Badge>
            ))}
         </div>
      ),
   },
   {
      accessorKey: "createdAt",
      header: "Date de création",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
   },
];
