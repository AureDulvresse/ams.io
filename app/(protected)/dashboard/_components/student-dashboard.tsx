import React from 'react'
import { CalendarIcon, FileTextIcon, ClipboardListIcon, UserIcon } from 'lucide-react'
import StatCard from '@/src/components/common/stat-card'

const StudentDashboard = () => {
   return (
      <div className="space-y-6">
         {/* Vue d'ensemble des statistiques */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
               libelle="Moyenne générale"
               data={15.5} // Remplacez par la moyenne dynamique
               icon={ClipboardListIcon}
               comparison={-0.5}
               unity="🔢"
            />
            <StatCard
               libelle="Devoirs en attente"
               data={3} // Remplacez par le nombre réel de devoirs à rendre
               icon={FileTextIcon}
               comparison={1.2}
               unity="📚"
            />
            <StatCard
               libelle="Examens à venir"
               data={2} // Remplacez par le nombre réel d'examens à venir
               icon={CalendarIcon}
               comparison={-0.3}
               unity="📅"
            />
            <StatCard
               libelle="Progrès des cours"
               data={75} // Remplacez par un pourcentage de progression réel
               icon={ClipboardListIcon}
               comparison={+5.1}
               unity="%"
            />
         </div>

         {/* Section des activités à venir */}
         <div className="mt-6">
            <h2 className="text-lg font-semibold">Activités à venir</h2>
            <div className="bg-white p-4 shadow-md rounded-md">
               <ul className="list-disc pl-5 space-y-2">
                  <li>Devoir de Mathématiques - Date limite: 15 janvier</li>
                  <li>Examen d'Histoire - Date: 20 janvier</li>
                  <li>Devoir de Physique - Date limite: 22 janvier</li>
               </ul>
            </div>
         </div>

         {/* Section des informations personnelles */}
         <div className="mt-6">
            <h2 className="text-lg font-semibold">Informations personnelles</h2>
            <div className="bg-white p-4 shadow-md rounded-md">
               <div className="flex items-center space-x-4">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                  <div>
                     <h3 className="font-semibold">Nom : Jean Dupont</h3>
                     <p className="text-sm text-muted-foreground">Date de naissance : 15 mars 2002</p>
                     <p className="text-sm text-muted-foreground">Email : jean.dupont@example.com</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Notifications */}
         <div className="mt-6">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <div className="bg-white p-4 shadow-md rounded-md">
               <ul className="list-disc pl-5 space-y-2">
                  <li>Votre devoir de Mathématiques a été noté : 14/20.</li>
                  <li>Rappel : Examen d'Histoire dans 2 jours.</li>
                  <li>Le cours de Physique sera en présentiel la semaine prochaine.</li>
               </ul>
            </div>
         </div>
      </div>
   )
}

export default StudentDashboard
