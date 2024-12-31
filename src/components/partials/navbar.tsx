"use client";
import React, { Suspense, useEffect, useState } from "react";
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
import { Bell, Loader2, MessageCircle, Search } from "lucide-react";
import { Input } from "../ui/input";
import appFeatures, { FeaturesProps } from '@/constants/features';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/src/hooks/use-current-user";

const Navbar = () => {
   const navigate = useRouter();
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState<FeaturesProps[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [isSearchOpen, setIsSearchOpen] = useState(false);

   const { user } = useCurrentUser();

   useEffect(() => {
      if (searchQuery.length > 0) {
         setIsSearching(true);
         setTimeout(() => {
            setSearchResults(
               appFeatures.filter(({ name }) =>
                  name.toLowerCase().includes(searchQuery.toLowerCase())
               )
            );
            setIsSearching(false);
         }, 1000);
      } else {
         setSearchResults([]);
      }
      if (searchQuery == "") { setSearchResults([]) }
   }, [searchQuery]);



   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);

   };

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
               <NavUser user={user} />
            </Suspense>
         </div>

         {/* Search Modal */}
         {isSearchOpen && (
            <Dialog open={isSearchOpen} onOpenChange={() => setIsSearchOpen(!isSearchOpen)}>
               <DialogOverlay
                  className="fixed inset-0 bg-muted/30 z-50"
                  onClick={toggleSearchModal}
               />
               <DialogContent className="w-[90%] min-h-48 max-w-lg rounded-lg bg-white p-6 shadow-lg">
                  <DialogTitle className="pb-2">Recherche rapide</DialogTitle>
                  <div className="relative">
                     <Search
                        className="absolute top-2.5 left-3 text-gray-400 dark:text-gray-500"
                        size={20}
                     />
                     <Input
                        className="h-10 w-full pl-10 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Recherche rapide..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                     />
                     {/* Spinner pendant la recherche */}
                     {isSearching && (
                        <Loader2
                           className="absolute top-2 right-3 animate-spin text-gray-400 dark:text-gray-500"
                           size={24}
                        />
                     )}

                  </div>
                  {/* Résultats de recherche */}
                  {searchResults.length > 0 && (
                     <div>
                        <ul className="max-h-20 overflow-auto scrollbar-custom">
                           {searchResults.map((result, index) => (
                              <li
                                 key={index}
                                 className="p-2 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
                                 onClick={() => navigate.push(`${result.shorcut}`)}
                              >
                                 {result.name}
                              </li>
                           ))}
                        </ul>
                     </div>

                  )}
               </DialogContent>
            </Dialog>
         )}
      </header>
   );
};

export default Navbar;
