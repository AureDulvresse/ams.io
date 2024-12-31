import React from "react";
import {
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
import { User } from "next-auth";
import { Role } from "@/src/types/role";
import { hasPermission } from "@/src/data/permission";

const AppSidebarUser = ({
  user,
  permissions,
}: {
  user: (User & {
    id: string;
    first_name: string;
    last_name: string;
    role: Role;
    is_active: boolean;
    emailVerified?: Date;
    last_login?: Date;
  }) | undefined;
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
            {appRoute.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <div className="flex items-center justify-between w-full">
                    <a
                      href={item.url}
                      className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
              </SidebarMenuItem>
            ))}
            {user?.role.name === "superuser" ||
              hasPermission("ACADEMY_MODULE_SHOW", permissions)
              ? appRoute.navAcademy.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={item.url}
                        className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
                                className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
              ))
              : null}
            {user?.role.name === "superuser" ||
              hasPermission("HR_MODULE_SHOW", permissions)
              ? appRoute.navHR.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={item.url}
                        className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
                                className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
              ))
              : null}
            {user?.role.name === "superuser" ||
              hasPermission("DRAFTING_MODULE_SHOW", permissions)
              ? appRoute.navDrafting.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={item.url}
                        className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
                                className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
              ))
              : null}
            {user?.role.name === "superuser" ||
              hasPermission("FINANCE_MODULE_SHOW", permissions)
              ? appRoute.navFinance.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={item.url}
                        className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
                                className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
              ))
              : null}
            {user?.role.name === "superuser" ||
              hasPermission("LIBRARY_MODULE_SHOW", permissions)
              ? appRoute.navLibrary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={item.url}
                        className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
                                className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
              ))
              : null}
            {user?.role.name === "superuser" ||
              hasPermission("PATRIMONY_MODULE_SHOW", permissions)
              ? appRoute.navPatrimony.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={item.url}
                        className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
                                className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
              ))
              : null}
            {user?.role.name === "superuser" ||
              hasPermission("SYSTEM_USERS", permissions)
              ? appRoute.navUser.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={item.url}
                        className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
                                className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
              ))
              : null}
            {user?.role.name === "superuser" ||
              hasPermission("SYSTEM_USERS", permissions)
              ? appRoute.navSettings.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between w-full">
                      <a
                        href={item.url}
                        className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
                                className={`w-full h-8 px-1 py-3 flex items-center rounded-lg transition-all duration-300 ease-in-out ${isActive(item.url)
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
