import React from "react";
import { DollarSignIcon, FileTextIcon, UsersIcon, CalendarIcon } from "lucide-react";
import StatCard from "@/src/components/common/stat-card";
import { Card } from "@/src/components/ui/card";
import IncomeChart from "@/src/components/finance/income-chart";
import ExpenseChart from "@/src/components/finance/expense-chart";

const FinanceDashboard = () => {
   return (
      <div className="space-y-6">
         {/* Vue d'ensemble des finances */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
               libelle="Revenus totaux"
               data={35000} // Montant total des revenus
               icon={DollarSignIcon}
               comparison={+5.3}
               unity="€"
            />
            <StatCard
               libelle="Dépenses totales"
               data={21000} // Montant total des dépenses
               icon={FileTextIcon}
               comparison={-2.4}
               unity="€"
            />
            <StatCard
               libelle="Balance actuelle"
               data={14000} // Calculé comme Revenus - Dépenses
               icon={UsersIcon}
               comparison={+3.1}
               unity="€"
            />
            <StatCard
               libelle="Transactions récentes"
               data={12} // Nombre de transactions récentes
               icon={CalendarIcon}
               comparison={+1.1}
               unity="🔄"
            />
         </div>


         <div className="grid grid-cols-2 gap-2">
            <IncomeChart />
            <ExpenseChart />
         </div>

         {/* Section des transactions récentes */}
         <Card className="p-2 col-span-2">
            <h2 className="text-lg font-semibold">Transactions récentes</h2>
            <div className="p-4 rounded-md">
               <ul className="list-disc pl-5 space-y-2">
                  <li>Paiement des frais de scolarité pour l'année 2023 : 5000€</li>
                  <li>Salaires des enseignants : 12000€</li>
                  <li>Achat de matériel pédagogique : 3000€</li>
               </ul>
            </div>
         </Card>
      </div>
   );
};

export default FinanceDashboard;
