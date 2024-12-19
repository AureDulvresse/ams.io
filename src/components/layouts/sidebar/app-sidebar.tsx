"use client"

import * as React from "react"
import {
   GraduationCap,
} from "lucide-react"


import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import app_routes from "@/src/router/routes"
import NavGroup from "./nav-group"

export const data = {
   user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
   },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar collapsible="icon" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                     <a href="#">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                           <GraduationCap className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-semibold">Acme Inc</span>
                           <span className="truncate text-xs">Enterprise</span>
                        </div>
                     </a>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavGroup groupTitle="Accueil" items={app_routes.navDashboard} />
            <NavGroup groupTitle="Academie" items={app_routes.navAcademic} />
            <NavGroup groupTitle="Ressources humaine" items={app_routes.navHR} />
            <NavGroup groupTitle="Finance" items={app_routes.navFinance} />
            <NavGroup groupTitle="Settings" items={app_routes.navSettings} />
         </SidebarContent>
      </Sidebar>
   )
}
