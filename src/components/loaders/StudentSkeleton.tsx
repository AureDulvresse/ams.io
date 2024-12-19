import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/students", label: "Gestion Etudiant" },
  { label: "Information Etudiant", isCurrent: true },
];

const StudentSkeleton = () => {
  return (
    <div className="mx-auto p-4 space-y-8">
      <DynamicBreadcrumb items={breadcrumbItems} />

      {/* Card d'information de l'étudiant */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Skeleton className="rounded-md w-28 h-28" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <div>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-8">
        {/* Section Informations Personnelles */}
        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-6" />
            ))}
          </div>
          
        </Card>

        {/* Section Informations Tuteur */}
        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-full h-6" />
            ))}
            </div>
         
        </Card>

        {/* Section Progression Académique */}
        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-6" />
            ))}
          </div>
        </Card>

        {/* Section Historique des Présences */}
        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-full h-6" />
            ))}
          </div>
        </Card>

        {/* Section Informations Financières */}
        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-full h-6" />
            ))}
          </div>
        </Card>

        {/* Section Documents */}
        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-full h-6" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentSkeleton;
