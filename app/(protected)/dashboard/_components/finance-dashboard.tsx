import React from "react";
import { DollarSignIcon, FileTextIcon, UsersIcon, CalendarIcon } from "lucide-react";
import StatCard from "@/src/components/common/stat-card";

const FinanceDashboard = () => {
   return (
      <div className="space-y-6">
         <h1 className="text-2xl font-semibold">Tableau de bord Financier</h1>

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

         {/* Section des transactions récentes */}
         <div className="mt-6">
            <h2 className="text-lg font-semibold">Transactions récentes</h2>
            <div className="bg-white p-4 shadow-md rounded-md">
               <ul className="list-disc pl-5 space-y-2">
                  <li>Paiement des frais de scolarité pour l'année 2023 : 5000€</li>
                  <li>Salaires des enseignants : 12000€</li>
                  <li>Achat de matériel pédagogique : 3000€</li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default FinanceDashboard;
