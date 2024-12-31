import { Sidebar } from 'lucide-react'
import React from 'react'
import { SidebarContent, SidebarGroup, SidebarHeader, SidebarMenuSkeleton } from '../ui/sidebar'

const AppSidebarSkeleton = () => {
   return (
      <Sidebar>
         <SidebarHeader>
            <SidebarMenuSkeleton className='aspect-video rounded-xl bg-muted/50' />
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarMenuSkeleton className='aspect-video rounded-xl bg-muted/50' />
               <SidebarMenuSkeleton className='aspect-video rounded-xl bg-muted/50' />
               <SidebarMenuSkeleton className='aspect-video rounded-xl bg-muted/50' />
            </SidebarGroup>
            <SidebarGroup>
               <SidebarMenuSkeleton className='aspect-video rounded-xl bg-muted/50' />
               <SidebarMenuSkeleton className='aspect-video rounded-xl bg-muted/50' />
               <SidebarMenuSkeleton className='aspect-video rounded-xl bg-muted/50' />
            </SidebarGroup>
            <SidebarGroup>
               <SidebarMenuSkeleton className='aspect-video rounded-xl bg-muted/50' />
               <SidebarMenuSkeleton className='aspect-video rounded-xl bg-muted/50' />
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   )
}

export default AppSidebarSkeleton