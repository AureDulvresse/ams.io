import { getDepartmentById } from "@/src/data/department";
import { notFound } from "next/navigation";
import DepartmentDetailView from "./_components/department-detail-view";
import Navbar from "@/src/components/partials/navbar";

interface DepartmentDetailPageProps {
   params: {
      id: string;
   };
}

const BREADCRUMB_ITEMS = [
   { href: "/", label: "Vue d'ensemble" },
   { href: "#", label: "Paramètre" },
   {
      href: "#",
      label: "Paramètre",
      isDropdown: true,
      dropdownItems: [
         { label: "Utilisateurs", href: "#" },
         { label: "Rôle & Permissions", href: "/users/roles" },
      ],
   },
   { label: "Rôle détails", isCurrent: true },
];

export default async function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
   const department = await getDepartmentById(Number(params.id));

   if (!department) {
      notFound();
   }

   return (
      <div>
         <Navbar breadcrumb={BREADCRUMB_ITEMS} />
         <DepartmentDetailView department={department} />;
      </div>)
}