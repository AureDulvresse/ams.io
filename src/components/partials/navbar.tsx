"use client";
import React, { Suspense, useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import BreadcrumbSkeleton from "../skeletons/breadcrumb-skeleton";
import { Skeleton } from "../ui/skeleton";
import { NavUser } from "./nav-user";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog"; // Assuming you have a modal UI component
import { Bell, MessageCircle, Search } from "lucide-react";

const Navbar = () => {
   const [isSearchOpen, setIsSearchOpen] = useState(false);

   const toggleSearchModal = () => {
      setIsSearchOpen(!isSearchOpen);
   };

   return (
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-3">
         {/* Left Side */}
         <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Suspense fallback={<BreadcrumbSkeleton />}>
               <Breadcrumb>
                  <BreadcrumbList>
                     <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                           Building Your Application
                        </BreadcrumbLink>
                     </BreadcrumbItem>
                     <BreadcrumbSeparator className="hidden md:block" />
                     <BreadcrumbItem>
                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                     </BreadcrumbItem>
                  </BreadcrumbList>
               </Breadcrumb>
            </Suspense>
         </div>

         {/* Right Side */}
         <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button
               className="flex items-center justify-center rounded-full p-2 hover:bg-gray-200"
               onClick={toggleSearchModal}
               aria-label="Search"
            >
               <Search size={20} />
            </button>

            {/* Notification Icon */}
            <button
               className="flex items-center justify-center rounded-full p-2 hover:bg-gray-200"
               aria-label="Notifications"
            >
               <Bell size={20} />
            </button>

            {/* Messaging Icon */}
            <button
               className="flex items-center justify-center rounded-full p-2 hover:bg-gray-200"
               aria-label="Messages"
            >
               <MessageCircle size={20} />
            </button>

            {/* User Avatar */}
            <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
               <NavUser />
            </Suspense>
         </div>

         {/* Search Modal */}
         {isSearchOpen && (
            <Dialog>
               <DialogOverlay
                  className="fixed inset-0 bg-black/30"
                  onClick={toggleSearchModal}
               />
               <DialogContent className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold">Recherche</h3>
                  <input
                     type="text"
                     placeholder="Rechercher..."
                     className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="mt-4 flex justify-end">
                     <button
                        className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
                        onClick={toggleSearchModal}
                     >
                        Fermer
                     </button>
                  </div>
               </DialogContent>
            </Dialog>
         )}
      </header>
   );
};

export default Navbar;
