'use client'
import React, { useEffect, useState } from 'react'
import features, { FeaturesProps } from '@/src/constants/features';
import { Loader2, MessagesSquareIcon, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '../../ui/input';

import {
   BadgeCheck,
   Bell,
   ChevronsUpDown,
   CreditCard,
   LogOut,
   Sparkles,
} from "lucide-react"

import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "@/src/components/ui/avatar"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { SidebarTrigger } from '../../ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Switch } from '../../ui/switch';

const TopBar = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState<FeaturesProps[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const { theme, setTheme } = useTheme();

   // Simule la recherche avec un délai pour les résultats
   useEffect(() => {
      if (searchQuery.length > 0) {
         setIsSearching(true);
         setTimeout(() => {
            setSearchResults(
               features.filter(({ name }) =>
                  name.toLowerCase().includes(searchQuery.toLowerCase())
               )
            );
            setIsSearching(false);
         }, 1000);
      } else {
         setSearchResults([]);
      }
   }, [searchQuery]);

   const navigate = useRouter();

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
   };

   const toggleTheme = () => {
      if (theme === "light") {
         setTheme("dark");
      } else if (theme === "dark") {
         setTheme("light");
      } else {
         setTheme("system");
      }
   };

   return (
      <header className="flex h-16 shrink-0 px-4 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
         <div className='flex items-center gap-2'>
            <SidebarTrigger />
            <Separator orientation='vertical' />
            <div className="relative w-80">
               <Search
                  className="absolute top-2 left-3 text-gray-400 dark:text-gray-500"
                  size={20}
               />
               <Input
                  className="h-10 w-full pl-10 pr-10 focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-lg bg-muted/50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Recherche rapide..."
                  value={searchQuery}
                  onChange={handleSearchChange}
               />
               {/* Spinner pendant la recherche */}
               {isSearching && (
                  <Loader2
                     className="absolute top-2 right-3 animate-spin text-indigo-600 dark:text-indigo-700"
                     size={24}
                  />
               )}
               {/* Résultats de recherche */}
               {searchResults.length > 0 && (
                  <ul className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 shadow-md rounded-md max-h-48 overflow-auto z-10 scrollbar-custom">
                     {searchResults.map((result, index) => (
                        <li
                           key={index}
                           className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                           onClick={() => navigate.push(`${result.shorcut}`)}
                        >
                           {result.name}
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </div>

         <div className='flex items-center justify-center gap-4'>
            <div>
               <Switch className="transition-all duration-150" onClick={toggleTheme} />
            </div>
            <Link href={"/"} className='relative'>
               <MessagesSquareIcon />
               <span className="absolute -top-1 -right-2 block h-2 w-2 rounded-full bg-green-600 ring-2 ring-white dark:ring-gray-800"></span>
            </Link>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant={'ghost'}
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-4"
                  >
                     <div className='relative'>
                        <Avatar className="h-8 w-8 rounded-lg">
                           <AvatarImage src={"aure"} alt={"aure"} />
                           <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 -right-0.5 block h-2 w-2 rounded-full bg-green-600 ring-2 ring-white dark:ring-gray-800"></span>
                     </div>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{"aure"}</span>
                        <span className="truncate text-xs">{"aure@gmail.com"}</span>
                     </div>
                     <ChevronsUpDown className="ml-auto size-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={"bottom"}
                  align="end"
                  sideOffset={4}
               >
                  <DropdownMenuLabel className="p-0 font-normal">
                     <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                           <AvatarImage src={"aure"} alt={"aure"} />
                           <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-semibold">{"aure"}</span>
                           <span className="truncate text-xs">{"aure"}</span>
                        </div>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>
                        <Sparkles />
                        Upgrade to Pro
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>
                        <BadgeCheck />
                        Account
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <CreditCard />
                        Billing
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <Bell />
                        Notifications
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                     <LogOut />
                     Log out
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

      </header >
   )
}

export default TopBar;