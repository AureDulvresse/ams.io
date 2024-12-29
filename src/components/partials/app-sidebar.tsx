import React from 'react'
import { Sidebar, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import Image from 'next/image'
import logo from "@/storage/uploads/logo_light.png";
import Link from 'next/link';

const AppSidebar = () => {
   return (
      <div>
         <Sidebar>
            <SidebarHeader className='px-2 flex items-center justify-between'>
               <div className="flex items-center gap-4 relative">
                  <Image src={logo} className="w-14 h-auto" alt="logo AMS" />
                  <h1 className="text-base font-semibold text-indigo-500 font-fredoka">Academia Management Sync</h1>
               </div>
               <Separator dir="horizontal" />
            </SidebarHeader>

            <SidebarGroup>
               <SidebarGroupLabel>
                  Dashboard
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     <SidebarMenuItem>
                        <Link href={"/dashboard"}>Overview</Link>
                     </SidebarMenuItem>
                  </SidebarMenu>
                  
               </SidebarGroupContent>
            </SidebarGroup>

         </Sidebar>
      </ div>
   )
}

export default AppSidebar