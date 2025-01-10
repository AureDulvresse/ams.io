import { Course, Subject } from "@/src/types/course";
import { ColumnDef } from "@tanstack/react-table";

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
   }
];

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
      accessorKey: "courses.length",
      header: "Nombre de cours",
   }
];