import React from "react";
import { BookOpenIcon, CheckCircleIcon, UsersIcon, FileTextIcon } from "lucide-react";
import StatCard from "@/src/components/common/stat-card";

const TeacherDashboard = () => {
   return (
      <div className="space-y-4">

         {/* Statistiques principales */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
               libelle="Cours enseignés"
               data={5}
               icon={BookOpenIcon}
               comparison={0.0}
               unity="📘"
            />
            <StatCard
               libelle="Devoirs à noter"
               data={10}
               icon={CheckCircleIcon}
               comparison={8.2}
               unity="✏️"
            />
            <StatCard
               libelle="Étudiants inscrits"
               data={120}
               icon={UsersIcon}
               comparison={4.5}
               unity="👨‍🏫"
            />
            <StatCard
               libelle="Documents à préparer"
               data={3}
               icon={FileTextIcon}
               comparison={1.5}
               unity="📑"
            />
         </div>

         {/* Section des tâches et examens */}
         <div className="mt-6">
            <h2 className="text-lg font-semibold">Tâches et examens à préparer</h2>
            <div className="bg-white p-4 shadow-md rounded-md">
               <ul className="list-disc pl-5 space-y-2">
                  <li>Noter les devoirs de la semaine dernière.</li>
                  <li>Préparer l'examen de fin de semestre pour la classe de mathématiques.</li>
                  <li>Mettre à jour les supports de cours pour le prochain semestre.</li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default TeacherDashboard;
