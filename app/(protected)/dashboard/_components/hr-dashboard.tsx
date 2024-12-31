import React, { useEffect, useState } from "react";
import { UsersIcon, CalendarIcon, DollarSignIcon, FileTextIcon } from "lucide-react";
import StatCard from "@/src/components/common/stat-card";
import { Card } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/common/data-table";
import { Notification, notificationColumns } from "@/constants/notification-columns";
import ErrorState from "@/src/components/common/error-state";
import { getNotifications } from "@/src/data/hr";
import { getTasks } from "@/src/data/task";
import { Task, taskColumns } from "@/constants/task-columns";

const HRDashboard = () => {
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [tasks, setTasks] = useState<Task[]>([]);
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

      const fetchTasks = async () => {
         try {
            setIsLoading(true);
            const data = await getTasks();
            setTasks(data);
         } catch (err: any) {
            setError(err.message);
         } finally {
            setIsLoading(false);
         }
      };

      fetchNotifications();
      fetchTasks()
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
         <Card className="container mx-auto px-4 py-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Dernières notifications</h2>
            <DataTable
               columns={notificationColumns}
               data={notifications}
               onView={handleView}
               onDelete={handleDelete}
            />
         </Card>

         {/* Section des tâches RH */}
         <Card className="container mx-auto px-4 py-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Tâches à accomplir</h2>
            <DataTable
               columns={taskColumns}
               data={tasks}
               onAdd={handleAdd}
               onView={handleView}
               onDelete={handleDelete}
               onEdit={handleEdit}
            />
         </Card>
      </div>
   );
};

export default HRDashboard;
