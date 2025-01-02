import React from 'react';
import {
   SidebarMenuItem,
   SidebarMenuButton,
   SidebarMenuSub,
   SidebarMenuSubItem,
   SidebarMenuSubButton,
} from "@/src/components/ui/sidebar";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { Plus, Minus } from "lucide-react";

interface MenuItem {
   title: string;
   url: string;
   icon?: React.ComponentType;
   items?: Array<{
      title: string;
      url: string;
   }>;
}

interface SidebarMenuItemWithSubmenuProps {
   item: MenuItem;
   index: number;
   isActive: (url: string) => boolean;
}

const SidebarMenuItemWithSubmenu: React.FC<SidebarMenuItemWithSubmenuProps> = ({
   item,
   index,
   isActive,
}) => {
   return (
      <Collapsible
         key={item.title}
         defaultOpen={index === 1}
         className="group/collapsible cursor-pointer"
      >
         <SidebarMenuItem>
            <CollapsibleTrigger asChild>
               <SidebarMenuButton className={`${isActive(item.url) && "text-white bg-primary hover:bg-primary-foreground hover:text-white"}`} asChild>
                  <div className="flex items-center justify-between w-full">
                     {item.icon && <item.icon />}
                     <span
                        className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out`}
                     >
                        {item.title}
                     </span>
                     <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                     <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />

                  </div>
               </SidebarMenuButton>
            </CollapsibleTrigger>

            {item.items?.length ? (
               <CollapsibleContent>
                  <SidebarMenuSub>
                     {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                           <SidebarMenuSubButton
                              className={`${isActive(item.url) && "text-white bg-primary hover:bg-primary-foreground hover:text-white"}`}
                              asChild
                              isActive={isActive(subItem.url)}
                           >
                              <div className="flex items-center justify-between w-full">
                                 <a
                                    href={subItem.url}
                                    className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out`}
                                 >
                                    {subItem.title}
                                 </a>
                              </div>
                           </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                     ))}
                  </SidebarMenuSub>
               </CollapsibleContent>
            ) : null
            }
         </SidebarMenuItem >
      </Collapsible >
   );
};

export default SidebarMenuItemWithSubmenu;