import React from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/src/components/ui/sidebar";
import Image from "next/image";
import logo from "@/storage/uploads/logo_light.png";
import { appRoute } from "@/routes";
import { usePathname } from "next/navigation";
import { User } from "next-auth";
import { Role } from "@/src/types/role";
import { hasPermission } from "@/src/data/permission";
import SidebarMenuItemWithSubmenu from "./sidebar-menu-item-with-submenu";

const AppSidebarUser = ({
  user,
  permissions,
}: {
  user:
    | (User & {
        id: string;
        first_name: string;
        last_name: string;
        role: Role;
        is_active: boolean;
        emailVerified?: Date;
        last_login?: Date;
      })
    | undefined;
  permissions: string[];
}) => {
  const pathname = usePathname();
  const isActive = (url: string) => {
    return pathname.startsWith(url);
  };

  return (
    <>
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
                    Powered by ams.io
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
            {appRoute.navMain.map((item, index) => (
               <SidebarMenuButton className={`${isActive(item.url) && "text-white bg-indigo-700 hover:bg-indigo-700 hover:text-white"}`} asChild>
                <div className="flex items-center justify-between w-full">
                  {item.icon && <item.icon />}
                  <a
                    href={item.url}
                    className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out`}
                  >
                    {item.title}
                  </a>
                </div>
              </SidebarMenuButton>
            ))}

            {user?.role.name === "superuser" ||
            hasPermission("ACADEMY_MODULE_SHOW", permissions)
              ? appRoute.navAcademy.map((item, index) => (
                  <SidebarMenuItemWithSubmenu
                    key={item.title}
                    item={item}
                    index={index}
                    isActive={isActive}
                  />
                ))
              : null}

            {user?.role.name === "superuser" ||
            hasPermission("HR_MODULE_SHOW", permissions)
              ? appRoute.navHR.map((item, index) => (
                  <SidebarMenuItemWithSubmenu
                    key={item.title}
                    item={item}
                    index={index}
                    isActive={isActive}
                  />
                ))
              : null}

            {user?.role.name === "superuser" ||
            hasPermission("DRAFTING_MODULE_SHOW", permissions)
              ? appRoute.navDrafting.map((item, index) => (
                  <SidebarMenuItemWithSubmenu
                    key={item.title}
                    item={item}
                    index={index}
                    isActive={isActive}
                  />
                ))
              : null}

            {user?.role.name === "superuser" ||
            hasPermission("FINANCE_MODULE_SHOW", permissions)
              ? appRoute.navFinance.map((item, index) => (
                  <SidebarMenuItemWithSubmenu
                    key={item.title}
                    item={item}
                    index={index}
                    isActive={isActive}
                  />
                ))
              : null}

            {user?.role.name === "superuser" ||
            hasPermission("LIBRARY_MODULE_SHOW", permissions)
              ? appRoute.navLibrary.map((item, index) => (
                  <SidebarMenuItemWithSubmenu
                    key={item.title}
                    item={item}
                    index={index}
                    isActive={isActive}
                  />
                ))
              : null}

            {user?.role.name === "superuser" ||
            hasPermission("PATRIMONY_MODULE_SHOW", permissions)
              ? appRoute.navPatrimony.map((item, index) => (
                  <SidebarMenuItemWithSubmenu
                    key={item.title}
                    item={item}
                    index={index}
                    isActive={isActive}
                  />
                ))
              : null}

            {user?.role.name === "superuser" ||
            hasPermission("SYSTEM_USERS", permissions)
              ? appRoute.navUser.map((item, index) => (
                  <SidebarMenuItemWithSubmenu
                    key={item.title}
                    item={item}
                    index={index}
                    isActive={isActive}
                  />
                ))
              : null}

            {user?.role.name === "superuser" ||
            hasPermission("SYSTEM_USERS", permissions)
              ? appRoute.navSettings.map((item, index) => (
                  <SidebarMenuItemWithSubmenu
                    key={item.title}
                    item={item}
                    index={index}
                    isActive={isActive}
                  />
                ))
              : null}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </>
  );
};

export default AppSidebarUser;
