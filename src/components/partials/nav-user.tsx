"use client";

import {
   BadgeCheck,
   Bell,
   ChevronsUpDown,
   CreditCard,
   LogOut,
   LucideLayoutDashboard,
   MessageCircleIcon,
   Sparkles,
   User2,
} from "lucide-react";

import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "@/src/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/src/components/ui/sidebar";
import { logout } from "@/src/actions/auth.actions";
import { toast } from "sonner";
import { User } from "next-auth";
import { Role } from "@/src/types/role";
import { useRouter } from "next/navigation";

export const NavUser = ({
   user,
}: {
   user:
   | (User & {
      id: string;
      first_name: string;
      last_name: string;
      role: Role;
      is_active: boolean;
      emailVerified?: Date;
      last_login?: Date;
   })
   | undefined;
}) => {
   const navigate = useRouter();
   const { isMobile } = useSidebar();

   const handleLogout = async () => {
      await logout();
      navigate.push("/login");
      toast.success("Vous êtes déconnecté !");
   };

   return (
      <div className="mr-2">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
               >
                  <Avatar className="h-8 w-8 rounded-full">
                     <AvatarImage
                        src={user?.image || ""}
                        alt={`${user?.first_name} ${user?.last_name}`}
                     />
                     <AvatarFallback className="rounded-full">AMS</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                     <span className="truncate font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
                     <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="truncate">Connecté</span>
                     </div>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
               </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white dark:bg-gray-900"
               side={isMobile ? "bottom" : "bottom"}
               align="end"
               sideOffset={4}
            >
               {/* User Info */}
               <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-3 py-2 text-left">
                     <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage
                           src={user?.image || ""}
                           alt={`${user?.first_name} ${user?.last_name}`}
                        />
                        <AvatarFallback className="rounded-full">AMS</AvatarFallback>
                     </Avatar>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
                        <span className="truncate text-xs text-gray-400">{user?.email}</span>
                     </div>
                  </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               {/* User Role */}
               <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-default bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                     <BadgeCheck className="w-4 h-4 text-primary" />
                     <span className="font-medium capitalize text-primary">
                        {user?.role.name}
                     </span>
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               {/* Navigation */}
               <DropdownMenuGroup>
                  <DropdownMenuItem
                     className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                     onClick={() => navigate.push("/dashboard")}
                  >
                     <LucideLayoutDashboard />
                     Vue d'ensemble
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                     onClick={() => navigate.push("/settings/account")}
                  >
                     <User2 />
                     Mon profil
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                  <DropdownMenuItem
                     className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                     onClick={() => navigate.push("/notifications")}
                  >
                     <Bell />
                     Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                     onClick={() => navigate.push("/forum")}
                  >
                     <MessageCircleIcon />
                     Forum
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               {/* Logout */}
               <DropdownMenuItem
                  className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-800"
                  onClick={handleLogout}
               >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">Déconnexion</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};
