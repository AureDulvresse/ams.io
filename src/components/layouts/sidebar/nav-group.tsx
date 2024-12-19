"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/src/components/ui/collapsible"
import {
   SidebarGroup,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
} from "@/src/components/ui/sidebar"

interface NavItem {
   title: string
   url: string
   icon?: LucideIcon
   isActive?: boolean
   items?: NavItem[]
}

const RenderMenuItems = ({ items }: { items: NavItem[] }) => {
   return (
      <>
         {items.map((item) => (
            <Collapsible
               key={item.title}
               asChild
               defaultOpen={item.isActive}
               className="group/collapsible"
            >
               <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                     <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                     </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items && (
                     <CollapsibleContent>
                        <SidebarMenuSub>
                           {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                 <SidebarMenuSubButton asChild>
                                    <a href={subItem.url}>
                                       <span>{subItem.title}</span>
                                    </a>
                                 </SidebarMenuSubButton>
                                 {subItem.items && (
                                    <CollapsibleContent>
                                       <SidebarMenuSub>
                                          {subItem.items.map((items) => (
                                             <SidebarMenuSubItem key={items.title}>
                                                <SidebarMenuButton asChild>
                                                   <a href={items.url}>
                                                      <span>{items.title}</span>
                                                   </a>
                                                </SidebarMenuButton>
                                             </SidebarMenuSubItem>
                                          ))}
                                       </SidebarMenuSub>
                                    </CollapsibleContent>
                                 )}
                              </SidebarMenuSubItem>
                           ))}
                        </SidebarMenuSub>
                     </CollapsibleContent>
                  )}
               </SidebarMenuItem>
            </Collapsible>
         ))}
      </>
   )
}

const NavGroup = ({
   groupTitle,
   items,
}: {
   groupTitle: string
   items: NavItem[]
}) => {
   return (
      <SidebarGroup>
         <SidebarGroupLabel className="capitalize">{groupTitle}</SidebarGroupLabel>
         <SidebarMenu>
            <RenderMenuItems items={items} />
         </SidebarMenu>
      </SidebarGroup>
   )
}

export default NavGroup
