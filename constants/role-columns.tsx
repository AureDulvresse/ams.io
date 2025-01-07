"use client"

import { Badge } from "@/src/components/ui/badge";
import { Permission } from "@/src/types/permission";
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
      accessorKey: "updatedAt",
      header: "Dernière mise à jour de création",
      cell: ({ row }) => row.original.updated_at ? new Date(row.original.updated_at).toLocaleDateString() : new Date(row.original.created_at).toLocaleDateString(),
   },
];

export const permissionColumns: ColumnDef<Permission, any>[] = [
   {
      accessorKey: "name",
      header: "Nom",
   },
   {
      accessorKey: "description",
      header: "Description",
   }
]