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
import FinanceDashboard from './finance-dashboard';
import DirectorDashboard from './director-dashboard';
import { hasPermission } from '@/src/data/permission';
import StudentDashboard from './student-dashboard';
import HRDashboard from './hr-dashboard';
import TeacherDashboard from './teacher-dashboard';
import LibraryDashboard from './library-dashboard';

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
               <CalendarClock size={14} />
               {currentTime}
            </div>
         </div>



         {user.role.name === "superuser" && (
            <div className='flex flex-col gap-2'>
               <AdminDashboard />
               <DirectorDashboard />
               <HRDashboard />
               <FinanceDashboard />
               <StudentDashboard />
               <TeacherDashboard />
               <LibraryDashboard />
            </div>
         )}

         {user.role.name === "admin" || hasPermission("access_admin_dashbord", permissionCodes) && (
            <AdminDashboard />
         )}

         {user.role.name === "directeur" || hasPermission("access_director_dashbord", permissionCodes) && (
            <DirectorDashboard />
         )}

         {user.role.name === "comptable" || hasPermission("access_finance_dashbord", permissionCodes) && (
            <FinanceDashboard />
         )}

         {user.role.name === "student" || hasPermission("access_student_dashbord", permissionCodes) && (
            <StudentDashboard />
         )}

         {user.role.name === "hr" || hasPermission("access_hr_dashbord", permissionCodes) && (
            <HRDashboard />
         )}

         {user.role.name === "teacher" || hasPermission("access_teacher_dashbord", permissionCodes) && (
            <TeacherDashboard />
         )}

         {user.role.name === "library" || hasPermission("access_library_dashbord", permissionCodes) && (
            <LibraryDashboard />
         )}

         {/* Sécurité */}
         {hasPermission("manage_security", permissionCodes) && (
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