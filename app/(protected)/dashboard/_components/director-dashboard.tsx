import React from "react";
import StatCard from "@/src/components/common/stat-card";
import {
   BarChartIcon,
   DollarSignIcon,
   GraduationCapIcon,
   FileTextIcon,
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import IncomeChart from "@/src/components/finance/income-chart";
import ExpenseChart from "@/src/components/finance/expense-chart";

const DirectorDashboard = () => {
   return (
      <div className="space-y-4">
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

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IncomeChart className="col-span-1" />
            <ExpenseChart className="col-span-1" />
         </div>

         <div className="grid grid-cols-2 gap-2">
            {/* Section des rapports */}
            <Card className="p-2 col-span-2">
               <h2 className="text-lg font-semibold">Rapports importants</h2>
               <div className="rounded-md">
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
            </Card>
         </div>
      </div>
   );
};

export default DirectorDashboard;
