import { getRoleById } from "@/src/data/role";
import { notFound } from "next/navigation";
import RoleDetailView from "./_components/role-detail-view";
import Navbar from "@/src/components/partials/navbar";

interface RoleDetailPageProps {
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

export default async function RoleDetailPage({ params }: RoleDetailPageProps) {
   const role = await getRoleById(Number(params.id));

   if (!role) {
      notFound();
   }

   return (
      <div>
         <Navbar breadcrumb={BREADCRUMB_ITEMS} />
         <RoleDetailView role={role} />;
      </div>)
}