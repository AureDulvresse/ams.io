import React from "react";
import { UsersIcon, CalendarIcon, DollarSignIcon, FileTextIcon } from "lucide-react";
import StatCard from "@/src/components/common/stat-card";

const HRDashboard = () => {
   return (
      <div className="space-y-4">
         <h1 className="text-2xl font-bold">Dashboard Ressources Humaines</h1>

         {/* Statistiques principales */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
               libelle="Employés enregistrés"
               data={50}
               icon={UsersIcon}
               comparison={2.5}
               unity="👥"
            />
            <StatCard
               libelle="Congés demandés"
               data={10}
               icon={CalendarIcon}
               comparison={3.1}
               unity="📅"
            />
            <StatCard
               libelle="Paiements à effectuer"
               data={5000}
               icon={DollarSignIcon}
               comparison={-1.2}
               unity="€"
            />
            <StatCard
               libelle="Tâches à exécuter"
               data={7}
               icon={FileTextIcon}
               comparison={8.5}
               unity="📑"
            />
         </div>

         {/* Section des notifications */}
         <div className="mt-6">
            <h2 className="text-lg font-semibold">Dernières notifications</h2>
            <div className="bg-white p-4 shadow-md rounded-md">
               <ul className="list-disc pl-5 space-y-2">
                  <li>Demande de congé de John Doe approuvée.</li>
                  <li>Les paiements des salaires sont en cours pour ce mois.</li>
                  <li>Une nouvelle demande de recrutement pour un professeur est arrivée.</li>
               </ul>
            </div>
         </div>

         {/* Section des tâches RH */}
         <div className="mt-6">
            <h2 className="text-lg font-semibold">Tâches à accomplir</h2>
            <div className="bg-white p-4 shadow-md rounded-md">
               <ul className="list-disc pl-5 space-y-2">
                  <li>Vérifier les demandes de congés en attente.</li>
                  <li>Mettre à jour les informations des employés dans le système.</li>
                  <li>Finaliser les paiements des primes de fin d'année.</li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default HRDashboard;
