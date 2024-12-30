import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
   SidebarRail,
} from "@/src/components/ui/sidebar"
import Image from 'next/image'
import logo from "@/storage/uploads/logo_light.png";
import { appRoute } from "@/routes";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
   return (
      <Sidebar {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                     <a href="#">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                           <Image src={logo} className="size-4" alt="logo AMS" />
                        </div>
                        <div className="flex flex-col gap-0.5 leading-none">
                           <span className="font-semibold text-indigo-700">Université Newton</span>
                           <span className="text-muted-foreground truncate text-xs">Powered by AMS</span>
                        </div>
                     </a>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarMenu>
                  {appRoute.navMain.map((item) => (
                     <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                           <a href={item.url} className="font-medium">
                              {item.title}
                           </a>
                        </SidebarMenuButton>
                        {item.items?.length ? (
                           <SidebarMenuSub>
                              {item.items.map((item) => (
                                 <SidebarMenuSubItem key={item.title}>
                                    <SidebarMenuSubButton asChild isActive={item.isActive}>
                                       <a href={item.url}>{item.title}</a>
                                    </SidebarMenuSubButton>
                                 </SidebarMenuSubItem>
                              ))}
                           </SidebarMenuSub>
                        ) : null}
                     </SidebarMenuItem>
                  ))}
               </SidebarMenu>
            </SidebarGroup>
         </SidebarContent>
         <SidebarRail />
      </Sidebar>
   )
}

export default AppSidebar;