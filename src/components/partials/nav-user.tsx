"use client"

import {
   BadgeCheck,
   Bell,
   ChevronsUpDown,
   CreditCard,
   LogOut,
   Sparkles,
} from "lucide-react"

import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "@/src/components/ui/avatar"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/src/components/ui/sidebar"
import { User } from "next-auth"
import { Role } from "@prisma/client"
import { Button } from "../ui/button"
import { logout } from "@/src/actions/auth.actions"
import { toast } from "sonner"
import { useCurrentUser } from "@/src/hooks/use-current-user"

export const NavUser = () => {
   const { isMobile } = useSidebar()
   const user = useCurrentUser();

   const handleLogout = async () => {
      await logout();
      toast.success("Déconnexion effectuée !");
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
                     <AvatarImage src={user?.image || ""} alt={`${user?.first_name} ${user?.last_name}`} />
                     <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                     <span className="truncate font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
                     <div className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="truncate">
                           Connecté <span className="font-medium">{`(${user?.role.name})`}</span>
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
               <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                     <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.image || ''} alt={`${user?.first_name} ${user?.last_name}`} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                     </Avatar>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
                        <span className="truncate text-xs">{user?.email}</span>
                     </div>
                  </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                  <DropdownMenuItem>
                     <Sparkles />
                     Upgrade to Pro
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                  <DropdownMenuItem>
                     <BadgeCheck />
                     Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                     <CreditCard />
                     Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                     <Bell />
                     Notifications
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuItem>
                  <Button
                     variant="ghost"
                     onClick={handleLogout}
                  >
                     <LogOut className="w-4 h-4" />
                     Déconnexion
                  </Button>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   )
}
