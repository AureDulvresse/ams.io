"use client";
import * as React from "react";
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
} from "@/src/components/ui/sidebar";
import Image from "next/image";
import logo from "@/storage/uploads/logo_light.png";
import { appRoute } from "@/routes";
import { usePathname } from "next/navigation";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();

  // Fonction pour vérifier si la route est active (inclut les routes imbriquées)
  const isActive = (url: string) => {
    return pathname.startsWith(url);
  };

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src={logo} className="size-4" alt="logo AMS" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-indigo-700">
                    Université Newton
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    Powered by AMS
                  </span>
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
                  <div className="flex items-center justify-between w-full">
                    <a
                      href={item.url}
                      className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${
                        isActive(item.url)
                          ? "text-white bg-indigo-500 hover:bg-indigo-500"
                          : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                      }`}
                    >
                      {item.title}
                    </a>
                    {isActive(item.url) && (
                      <div className="h-8 w-1 bg-indigo-500 rounded-lg"></div>
                    )}
                  </div>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive(subItem.url)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <a
                              href={subItem.url}
                              className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${
                                isActive(item.url)
                                  ? "text-white bg-indigo-500 hover:bg-indigo-500"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                              }`}
                            >
                              {subItem.title}
                            </a>
                            {isActive(item.url) && (
                              <div className="h-8 w-1 bg-indigo-500 rounded-lg"></div>
                            )}
                          </div>
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
  );
};

export default AppSidebar;
