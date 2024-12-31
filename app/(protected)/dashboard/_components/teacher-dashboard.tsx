import React, { useEffect, useState } from "react";
import { BookOpenIcon, CheckCircleIcon, UsersIcon, FileTextIcon } from "lucide-react";
import StatCard from "@/src/components/common/stat-card";
import { Card } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/common/data-table";
import { Notification, notificationColumns } from "@/constants/notification-columns";
import ErrorState from "@/src/components/common/error-state";
import { getNotifications } from "@/src/data/hr";

const TeacherDashboard = () => {
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
         <Card className="container mx-auto px-4 py-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Tâches et examens à préparer</h2>
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

export default TeacherDashboard;
