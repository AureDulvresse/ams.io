"use client";
import React, { useState, useRef } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import UserManagement from "@/components/partials/UserManagement";
import RoleManagement from "@/components/partials/RoleManagement";
import GeneralData from "@/components/partials/GeneralData";
import SchoolData from "@/components/partials/SchoolData";
import ConnectionLogs from "@/components/partials/ConnectionLog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Configuration", isCurrent: true },
];

const SettingsPage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const sectionsRefs = {
    users: useRef<HTMLDivElement>(null),
    roles: useRef<HTMLDivElement>(null),
    school: useRef<HTMLDivElement>(null),
    general: useRef<HTMLDivElement>(null),
    levelStudy: useRef<HTMLDivElement>(null),
    logs: useRef<HTMLDivElement>(null),
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000); // Simuler une sauvegarde
  };

  const scrollToSection = (section: keyof typeof sectionsRefs) => {
    sectionsRefs[section].current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
     <div className="mx-auto space-y-4">
      {/* Breadcrumb */}
      <DynamicBreadcrumb items={breadcrumbItems} />

      {/* Conteneur principal avec menu latéral et contenu */}
      <div className="flex space-x-8">
        {/* Menu latéral */}
        <aside className="w-1/4 sticky top-[68px] h-[calc(100vh-68px)] p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <nav className="space-y-4">
            {[
              { id: "users", label: "Gestion des Utilisateurs" },
              { id: "roles", label: "Rôles" },
              { id: "school", label: "Données de l'École" },
              { id: "general", label: "Données Générales" },
              { id: "logs", label: "Logs de Connexion" },
            ].map((section) => (
              <Button
                key={section.id}
                variant="outline"
                className="w-full text-left py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200 rounded-lg"
                onClick={() =>
                  scrollToSection(section.id as keyof typeof sectionsRefs)
                }
              >
                {section.label}
              </Button>
            ))}
             {/* Bouton de sauvegarde toujours visible */}
     
        <Button
          className="w-full bg-indigo-600 text-white text-[12px] px-4 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 flex items-center"
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="animate-spin mr-2" size={18} />}
          {isSaving
            ? "Enregistrement..."
            : "Enregistrer toutes les modifications"}
        </Button>
          </nav>
        </aside>

        {/* Contenu principal */}
        <div className="w-3/4 space-y-16">
          {/* Section Gestion des Utilisateurs */}
          <div ref={sectionsRefs.users}>
            <UserManagement />
          </div>

          {/* Section Rôles */}
          <div ref={sectionsRefs.roles}>
            <RoleManagement />
          </div>

          {/* Section Données de l'École */}
          <div ref={sectionsRefs.school}>
            <SchoolData />
          </div>

          {/* Section Données Générales */}
          <div ref={sectionsRefs.general}>
            <GeneralData />
          </div>

          {/* Section Logs de Connexion */}
          <div ref={sectionsRefs.logs}>
            <ConnectionLogs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
