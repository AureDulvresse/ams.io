import React from "react";
import { BookIcon, UserIcon, FileTextIcon, ArchiveIcon } from "lucide-react";
import StatCard from "@/src/components/common/stat-card";

const LibraryDashboard = () => {
   return (
      <div className="space-y-6">
         <h1 className="text-2xl font-semibold">Tableau de bord de la Librairie</h1>

         {/* Vue d'ensemble de la librairie */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
               libelle="Livres en stock"
               data={120} // Nombre total de livres en stock
               icon={BookIcon}
               comparison={+3.5}
               unity="📚"
            />
            <StatCard
               libelle="Livres empruntés"
               data={30} // Nombre de livres actuellement empruntés
               icon={UserIcon}
               comparison={-2.3}
               unity="📖"
            />
            <StatCard
               libelle="Demandes de livres"
               data={5} // Nombre de demandes de livres en attente
               icon={FileTextIcon}
               comparison={+0.7}
               unity="🔖"
            />
            <StatCard
               libelle="Transactions récentes"
               data={8} // Nombre de transactions récentes
               icon={ArchiveIcon}
               comparison={+1.0}
               unity="🔄"
            />
         </div>

         {/* Section des transactions récentes */}
         <div className="mt-6">
            <h2 className="text-lg font-semibold">Transactions récentes</h2>
            <div className="bg-white p-4 shadow-md rounded-md">
               <ul className="list-disc pl-5 space-y-2">
                  <li>Emprunt du livre "Introduction à la physique" - 15 décembre</li>
                  <li>Retour du livre "Histoire contemporaine" - 10 décembre</li>
                  <li>Demande d'achat de "Mathématiques avancées" - 12 décembre</li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default LibraryDashboard;
