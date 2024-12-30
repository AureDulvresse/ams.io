"use client"
import React, { useEffect, useState } from 'react';
import {
   CalendarClock,
   Shield,
} from 'lucide-react';
import { User } from 'next-auth';
import ErrorState from '@/src/components/common/error-state';
import { Role } from '@/src/types/role';
import { Permission } from '@/src/types/permission';
import DashboardSkeleton from './dashboard-skeleton';
import AdminDashboard from './admin-dashboard';

// Fonction pour obtenir la salutation selon l'heure
const getGreeting = () => {
   const hour = new Date().getHours();
   if (hour >= 5 && hour < 12) return "Bonjour";
   if (hour >= 12 && hour < 18) return "Bon après-midi";
   return "Bonsoir";
};

const Card = ({ title, icon, children }: {
   title: string;
   icon: React.ReactNode;
   children: React.ReactNode;
}) => (
   <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 p-4">
         <h3 className="font-medium flex items-center gap-2">
            {icon}
            {title}
         </h3>
      </div>
      <div className="p-4">
         {children}
      </div>
   </div>
);

// Composant principal
const Dashboard = ({
   user,
   permissions,
   isLoading,
   error,
}: {
   user: (User & {
      id: string;
      first_name: string;
      last_name: string;
      role: Role;
      is_active: boolean;
      emailVerified?: Date;
      last_login?: Date;
   }) | undefined | null;
   permissions: Permission[] | null;
   isLoading: boolean;
   error: Error | null;
}) => {

   const [currentTime, setCurrentTime] = useState<string | null>(null);

   useEffect(() => {
      const timer = setInterval(() => {
         const now = new Date();
         const formattedTime = now.toLocaleTimeString();
         const formattedDate = now.toLocaleDateString();
         setCurrentTime(`${formattedDate} ${formattedTime}`);
      }, 1000);

      return () => clearInterval(timer);
   }, []);

   if (isLoading) return <DashboardSkeleton />;
   if (error) return <ErrorState message={error.message} />;
   if (!permissions) return <ErrorState message="Aucune permission trouvée" />;
   if (!user) return <ErrorState message="Utilisateur non trouvé" />;

   const permissionCodes = permissions.map(p => p.code);
   const hasPermission = (code: string) => permissionCodes.includes(code);
   const greeting = getGreeting();

   return (
      <div className="p-6 space-y-6">
         <div className="flex justify-between items-start bg-muted rounded-lg p-2">
            <div className="space-y-2">
               <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  {greeting}, {user.first_name}
               </h1>
               <p>Bienvenue sur votre tableau de bord</p>
            </div>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-900 px-2 py-1.5">
               <CalendarClock size={14}/>
               {currentTime}
            </div>
         </div>


         {/* Paramètres Système */}
         {user.role.name === "superuser" && (
            <AdminDashboard />
         )}

         {/* Sécurité */}
         {hasPermission("manage_security") && (
            <Card
               title="Sécurité"
               icon={<Shield className="w-4 h-4" />}
            >
               <p>Gérez les paramètres de sécurité</p>
            </Card>
         )}

      </div>
   );
};

export default Dashboard;