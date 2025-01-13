import { Course } from "@/src/types/course";
import { Subject } from "@/src/types/subject";
import { ColumnDef } from "@tanstack/react-table";

// Column definitions for Course table
export const courseColumns: ColumnDef<Course>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "subject.name",
    header: "Matière",
  },
  {
    accessorKey: "credits",
    header: "Crédits",
  },
  {
    accessorKey: "hours",
    header: "Heures",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];

// Column definitions for Subject table
export const subjectColumns: ColumnDef<Subject>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "departments",
    header: "Departements",
    cell: ({ row }) => row.original.department?.name,
  },
];
