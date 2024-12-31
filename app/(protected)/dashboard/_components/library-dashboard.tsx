import React, { useEffect, useState } from "react";
import { BookIcon, UserIcon, FileTextIcon, ArchiveIcon } from "lucide-react";
import StatCard from "@/src/components/common/stat-card";
import { Notification, notificationColumns } from "@/constants/notification-columns";
import { getNotifications } from "@/src/data/hr";
import ErrorState from "@/src/components/common/error-state";
import { Card } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/common/data-table";

const LibraryDashboard = () => {
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
         <Card className="container mx-auto px-4 py-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Transactions récentes</h2>
            <DataTable
               columns={notificationColumns}
               data={notifications}
               onView={handleView}
               onDelete={handleDelete}
            />
         </Card>
      </div>
   );
};

export default LibraryDashboard;
