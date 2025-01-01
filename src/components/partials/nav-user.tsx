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
import {
   SidebarMenuButton,
   useSidebar,
} from "@/src/components/ui/sidebar";
import { logout } from "@/src/actions/auth.actions";
import { toast } from "sonner";
import { User } from "next-auth";
import { Role } from "@/src/types/role";
import { useRouter } from "next/navigation";

export const NavUser = ({ user }: {
   user: (User & {
      id: string;
      first_name: string;
      last_name: string;
      role: Role;
      is_active: boolean;
      emailVerified?: Date;
      last_login?: Date;
   }) | undefined;
}) => {
   const navigate = useRouter();
   const { isMobile } = useSidebar();

   const handleLogout = async () => {
      await logout();
      toast.success("Vous êtes déconnecté !");
      navigate.push("/login");
   };

   return (
      <div className="mr-2">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
               >
                  <Avatar className="h-8 w-8 rounded-lg">
                     <AvatarImage
                        src={user?.image || ""}
                        alt={`${user?.first_name} ${user?.last_name}`}
                     />
                     <AvatarFallback className="rounded-lg">AMS</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                     <span className="truncate font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
                     <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="truncate">
                           Connecté
                        </span>
                     </div>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
               </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
               side={isMobile ? "bottom" : "bottom"}
               align="end"
               sideOffset={4}
            >
               {/* User Info */}
               <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                     <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                           src={user?.image || ""}
                           alt={`${user?.first_name} ${user?.last_name}`}
                        />
                        <AvatarFallback className="rounded-lg">AMS</AvatarFallback>
                     </Avatar>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
                        <span className="truncate text-xs">{user?.email}</span>
                     </div>
                  </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               {/* Navigation */}
               <DropdownMenuGroup>
                  <DropdownMenuItem>
                     <BadgeCheck />
                     <span className="font-medium capitalize">{user?.role.name}</span>
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate.push("/dashboard")}>
                     <LucideLayoutDashboard />
                     Vue d'ensemble
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate.push("/profile")}>
                     <User2 />
                     Mon profil
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate.push("/notifications")}>
                     <Bell />
                     Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate.push("/notifications")}>
                     <MessageCircleIcon />
                    Forum
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               {/* Logout */}
               <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Déconnexion
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};
