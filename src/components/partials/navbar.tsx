"use client";
import React, { Suspense, useEffect, useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Skeleton } from "../ui/skeleton";
import { NavUser } from "./nav-user";
import { Bell, Loader2, Menu, MessageCircle, Search, X } from "lucide-react";
import { Input } from "../ui/input";
import appFeatures, { FeaturesProps } from '@/constants/features';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import DynamicBreadcrumb, { BreadcrumbItemProps } from "../common/dynamique-breadcrumb";

const Navbar = ({ breadcrumb }: { breadcrumb: BreadcrumbItemProps[] }) => {
   const navigate = useRouter();
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState<FeaturesProps[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const { user, isLoading } = useCurrentUser();

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

   const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
   };

   return (
      <header className="relative flex h-16 shrink-0 items-center justify-between gap-2 border-b px-3">
         {/* Left Side */}
         <div className="flex items-center gap-2">
            <div className="hidden md:block">
               <SidebarTrigger />
            </div>
            <button
               className="md:hidden"
               onClick={toggleMobileMenu}
               aria-label="Toggle mobile menu"
            >
               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
            <div className="hidden md:block">
               <DynamicBreadcrumb items={breadcrumb} isLoading={isLoading} />
            </div>
         </div>

         {/* Right Side - Desktop */}
         <div className="hidden md:flex items-center gap-4">
            <button
               className="flex items-center justify-center rounded-full p-2 hover:bg-gray-200"
               onClick={toggleSearchModal}
               aria-label="Search"
            >
               <Search size={20} />
            </button>
            <button
               className="flex items-center justify-center rounded-full p-2 hover:bg-gray-200"
               aria-label="Notifications"
            >
               <Bell size={20} />
            </button>
            <button
               className="flex items-center justify-center rounded-full p-2 hover:bg-gray-200"
               aria-label="Messages"
            >
               <MessageCircle size={20} />
            </button>
            <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
               <NavUser user={user} />
            </Suspense>
         </div>

         {/* Right Side - Mobile */}
         <div className="md:hidden flex items-center gap-2">
            <button
               className="flex items-center justify-center rounded-full p-2 hover:bg-gray-200"
               onClick={toggleSearchModal}
               aria-label="Search"
            >
               <Search size={20} />
            </button>
            <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
               <NavUser user={user} />
            </Suspense>
         </div>

         {/* Mobile Menu */}
         {isMobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden">
               <div className="p-4">
                  <DynamicBreadcrumb items={breadcrumb} isLoading={isLoading} />
                  <div className="flex items-center justify-around mt-4">
                     <button
                        className="flex flex-col items-center gap-1"
                        aria-label="Notifications"
                     >
                        <Bell size={20} />
                        <span className="text-sm">Notifications</span>
                     </button>
                     <button
                        className="flex flex-col items-center gap-1"
                        aria-label="Messages"
                     >
                        <MessageCircle size={20} />
                        <span className="text-sm">Messages</span>
                     </button>
                  </div>
               </div>
            </div>
         )}

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
                     {isSearching && (
                        <Loader2
                           className="absolute top-2 right-3 animate-spin text-gray-400 dark:text-gray-500"
                           size={24}
                        />
                     )}
                  </div>
                  {searchResults.length > 0 && (
                     <div>
                        <ul className="max-h-48 overflow-auto scrollbar-custom">
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