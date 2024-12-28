import React from 'react';
import {
   LayoutDashboard,
   Users,
   Settings,
   Shield,
   LogOut,
} from 'lucide-react';
import { User } from 'next-auth';
import ErrorState from '@/src/components/common/error-state';
import { Role } from '@/src/types/role';
import { Permission } from '@/src/types/permission';
import DashboardSkeleton from './dashboard-skeleton';

// Fonction pour obtenir la salutation selon l'heure
const getGreeting = () => {
   const hour = new Date().getHours();
   if (hour >= 5 && hour < 12) return "Bonjour";
   if (hour >= 12 && hour < 18) return "Bon après-midi";
   return "Bonsoir";
};

// Composants réutilisables
const Button = ({
   children,
   onClick,
   variant = 'primary'
}: {
   children: React.ReactNode;
   onClick?: () => void;
   variant?: 'primary' | 'outline';
}) => {
   const baseStyles = "px-4 py-2 rounded-md flex items-center gap-2 transition-colors";
   const variants = {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      outline: "border border-gray-300 hover:bg-gray-50"
   };

   return (
      <button
         className={`${baseStyles} ${variants[variant]}`}
         onClick={onClick}
      >
         {children}
      </button>
   );
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
   onLogout
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
   onLogout: () => void;
}) => {
   if (isLoading) return <DashboardSkeleton />;
   if (error) return <ErrorState message={error.message} />;
   if (!permissions) return <ErrorState message="Aucune permission trouvée" />;
   if (!user) return <ErrorState message="Utilisateur non trouvé" />;

   const permissionCodes = permissions.map(p => p.code);
   const hasPermission = (code: string) => permissionCodes.includes(code);
   const greeting = getGreeting();

   console.log(user)

   return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div className="space-y-2">
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {greeting}, {user.first_name}
               </h1>
               <div className="flex items-center gap-2 text-gray-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  <p>
                     Connecté en tant que <span className="font-medium">{user.role.name}</span>
                  </p>
               </div>
            </div>
            <Button
               variant="outline"
               onClick={onLogout}
            >
               <LogOut className="w-4 h-4" />
               Déconnexion
            </Button>
         </div>

         {/* Dashboard Grid */}
         <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Vue d'ensemble - visible par tous */}
            <Card
               title="Vue d'ensemble"
               icon={<LayoutDashboard className="w-4 h-4" />}
            >
               <p>Bienvenue sur votre tableau de bord</p>
            </Card>

            {/* Gestion des Utilisateurs */}
            {(user.role.name === "superuser" || hasPermission("SYSTEM_ADMIN")) && (
               <Card
                  title="Gestion des Utilisateurs"
                  icon={<Users className="w-4 h-4" />}
               >
                  <p>Gérez les utilisateurs et leurs accès</p>
               </Card>
            )}

            {/* Paramètres Système */}
            {user.role.name === "superuser" && (
               <Card
                  title="Paramètres Système"
                  icon={<Settings className="w-4 h-4" />}
               >
                  <p>Configuration avancée du système</p>
               </Card>
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
      </div>
   );
};

export default Dashboard;