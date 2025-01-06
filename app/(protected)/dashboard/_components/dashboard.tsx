"use client"
import React, { useEffect, useState } from 'react';
import {
   CalendarClock,
   Shield,
} from 'lucide-react';
import ErrorState from '@/src/components/common/error-state';
import DashboardSkeleton from '../../../../src/components/skeletons/dashboard-skeleton';
import { hasPermission } from '@/src/data/permission';
import dashboardSections from '../_sections/dashboard-sections';
import { MyPageProps } from '@/src/types/custom-props';
import UnauthorizedAccess from '@/src/components/common/unauthorized-access';
import { isSuperUser } from '@/src/data/user';

const Card = ({
   title,
   icon,
   children,
   className = ""
}: {
   title: string;
   icon: React.ReactNode;
   children: React.ReactNode;
   className?: string;
}) => (
   <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}>
      <div className="border-b border-gray-200 p-4 bg-gray-50">
         <h3 className="font-medium flex items-center gap-2 text-gray-700">
            {icon}
            {title}
         </h3>
      </div>
      <div className="p-4">
         {children}
      </div>
   </div>
);

const getGreeting = () => {
   const hour = new Date().getHours();
   if (hour >= 5 && hour < 12) return "Bonjour";
   if (hour >= 12 && hour < 18) return "Bon après-midi";
   return "Bonsoir";
};

const Dashboard = ({
   user,
   userPermissions,
   isLoading,
   error,
}: MyPageProps) => {
   const [currentTime, setCurrentTime] = useState<string | null>(null);

   useEffect(() => {
      const updateTime = () => {
         const now = new Date();
         const options: Intl.DateTimeFormatOptions = {
            dateStyle: 'long',
            timeStyle: 'medium'
         };
         setCurrentTime(new Intl.DateTimeFormat('fr-FR', options).format(now));
      };

      updateTime();
      const timer = setInterval(updateTime, 1000);
      return () => clearInterval(timer);
   }, []);

   if (isLoading) return <DashboardSkeleton />;
   if (error) return <ErrorState message={error.message} />;
   if (!user) return <ErrorState message="Utilisateur non trouvé" />;
   if (!userPermissions?.length) return <ErrorState message="Aucune permission trouvée" />;

   const userRole = user.role.name.toLowerCase();

   // Access control
   const canAccessRoles = isSuperUser(userRole) || hasPermission("SYSTEM_ADMIN", userPermissions || []) || hasPermission("DASHBOARD_SHOW", userPermissions || []);

   if (!canAccessRoles && !isLoading) {
      console.log(userPermissions)
      return <UnauthorizedAccess />;
   }

   const greeting = getGreeting();
   

   return (
      <div className="p-6 space-y-6">
         <div className="bg-gradient-to-tr from-indigo-600 to-primary rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center">
               <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                     {greeting}, {user.first_name}
                  </h1>
                  <p className="text-indigo-100">
                     Bienvenue sur votre tableau de bord
                  </p>
               </div>
               <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <CalendarClock size={16} />
                  <span className="text-sm font-medium">{currentTime}</span>
               </div>
            </div>
         </div>

         <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {dashboardSections.map(section => {
               const hasRole = section.roleNames.includes(userRole);
               const hasRequiredPermission = hasPermission(section.permission, userPermissions);

               if (hasRole || hasRequiredPermission) {
                  return (
                     <div key={section.id} className="col-span-full">
                        {section.component}
                     </div>
                  );
               }
               return null;
            })}

            {userRole === 'superuser' && (
               <Card
                  title="Sécurité"
                  icon={<Shield className="w-4 h-4" />}
                  className="col-span-full"
               >
                  <p>Gérez les paramètres de sécurité</p>
               </Card>
            )}
         </div>
      </div>
   );
};

export default Dashboard;