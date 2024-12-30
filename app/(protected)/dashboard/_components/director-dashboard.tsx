import React from "react";
import StatCard from "@/src/components/common/stat-card";
import {
   BarChartIcon,
   DollarSignIcon,
   GraduationCapIcon,
   FileTextIcon,
} from "lucide-react";

const DirectorDashboard = () => {
   return (
      <div className="space-y-4">
         <h1 className="text-2xl font-bold">Dashboard Directeur</h1>

         {/* Statistiques principales */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
               libelle="Étudiants inscrits"
               data={5032}
               icon={GraduationCapIcon}
               comparison={10.5}
               unity="👩‍🎓"
            />
            <StatCard
               libelle="Revenu total"
               data={120000}
               icon={DollarSignIcon}
               comparison={7.8}
               unity="€"
            />
            <StatCard
               libelle="Performances académiques"
               data={"87%"}
               icon={BarChartIcon}
               comparison={4.3}
            />
            <StatCard
               libelle="Rapports générés"
               data={124}
               icon={FileTextIcon}
               comparison={2.1}
            />
         </div>

         {/* Section des rapports */}
         <div className="mt-6">
            <h2 className="text-lg font-semibold">Rapports importants</h2>
            <div className="bg-white p-4 shadow-md rounded-md">
               <ul className="list-disc pl-5 space-y-2">
                  <li>
                     <a href="/reports/academic-performance" className="text-indigo-600 hover:underline">
                        Rapport sur les performances académiques
                     </a>
                  </li>
                  <li>
                     <a href="/reports/financial-overview" className="text-indigo-600 hover:underline">
                        Vue d'ensemble financière
                     </a>
                  </li>
                  <li>
                     <a href="/reports/department-status" className="text-indigo-600 hover:underline">
                        État des départements
                     </a>
                  </li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default DirectorDashboard;
