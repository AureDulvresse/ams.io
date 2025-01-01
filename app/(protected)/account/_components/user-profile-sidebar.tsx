"use client";
import React, { useRef, useState } from "react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem } from "@/src/components/ui/sidebar";
import { Loader2 } from "lucide-react";

const SECTIONS = [
   { id: "personalInfo", label: "Informations Personnelles" },
   { id: "security", label: "Paramètres de Sécurité" },
   { id: "preferences", label: "Préférences" },
   { id: "activity", label: "Historique des Activités" },
   { id: "notifications", label: "Notifications" },
];

const UserProfileSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
   const [isSaving, setIsSaving] = useState(false);
   const sectionsRefs = useRef<Record<string, HTMLDivElement | null>>({});

   const handleSaveChanges = () => {
      setIsSaving(true);
      // Simule une sauvegarde de 2 secondes
      setTimeout(() => setIsSaving(false), 2000);
   };

   const scrollToSection = (sectionId: string) => {
      sectionsRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth" });
   };

   return (
      <Sidebar {...props} side="right" variant="inset">
         <SidebarMenu>
            {SECTIONS.map((section) => (
               <SidebarMenuItem
                  key={section.id}
                  className="w-full text-left py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200 rounded-lg"
                  onClick={() => scrollToSection(section.id)}
                  aria-label={`Aller à la section ${section.label}`}
               >
                  {section.label}
               </SidebarMenuItem>
            ))}

            {/* Bouton de sauvegarde toujours visible */}
            <SidebarMenuItem
               className={`w-full bg-indigo-600 text-white text-sm px-4 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center`}
               onClick={handleSaveChanges}
               aria-label="Enregistrer toutes les modifications"
            >
               {isSaving && <Loader2 className="animate-spin mr-2" size={18} />}
               {isSaving ? "Enregistrement..." : "Enregistrer toutes les modifications"}
            </SidebarMenuItem>
         </SidebarMenu>
      </Sidebar>
   );
};

export default UserProfileSidebar;
