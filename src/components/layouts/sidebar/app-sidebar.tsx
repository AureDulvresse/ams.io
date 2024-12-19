"use client"

import * as React from "react"
import {
   Command,
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
import NavAcademic from "./nav-academic"
import NavDashboard from "./nav-dashboard"
import app_routes from "@/src/router/routes"

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
                           <Command className="size-4" />
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
            <NavDashboard items={app_routes.navDashboard} />
            <NavAcademic items={app_routes.navAcademic} />
            {/* <NavProjects projects={data.projects} />
            <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
         </SidebarContent>
         <SidebarFooter>
            <SidebarMenuButton className="text-muted-foreground uppercase text-xs text-center">
               Developed by FenixAD
            </SidebarMenuButton>

         </SidebarFooter>
      </Sidebar>
   )
}
