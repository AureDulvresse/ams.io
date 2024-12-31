import React, { useEffect, useState } from 'react'
import { CalendarIcon, FileTextIcon, ClipboardListIcon, UserIcon } from 'lucide-react'
import StatCard from '@/src/components/common/stat-card'
import ErrorState from '@/src/components/common/error-state';
import { getNotifications } from '@/src/data/hr';
import { Notification, notificationColumns } from '@/constants/notification-columns';
import { Card } from '@/src/components/ui/card';
import { DataTable } from '@/src/components/common/data-table';

const StudentDashboard = () => {
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchNotifications = async () => {
         try {
            setIsLoading(true);
            const data = await getNotifications();
            setNotifications(data);
         } catch (err: any) {
            setError(err.message);
         } finally {
            setIsLoading(false);
         }
      };

      fetchNotifications();
 
   }, []);

   const handleView = (row: any) => {
      console.log("Viewing:", row);
   };

   const handleEdit = (row: any) => {
      console.log("Editing:", row);
   };

   const handleDelete = (row: any) => {
      console.log("Deleting:", row);
   };

   const handleAdd = () => {
      console.log("Adding new record");
   };

   if (error) return <ErrorState message={error} />

   if (isLoading) {
      return <div>Loading...</div>;
   }
   
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

         {/* Section des notifications */}
         <Card className="container mx-auto px-4 py-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Dernières notifications</h2>
            <DataTable
               columns={notificationColumns}
               data={notifications}
               onView={handleView}
               onDelete={handleDelete}
            />
         </Card>
      </div>
   )
}

export default StudentDashboard
