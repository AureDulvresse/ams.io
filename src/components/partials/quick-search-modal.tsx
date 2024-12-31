import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogOverlay } from "../ui/dialog";
import { Input } from "../ui/input";
import { useRouter } from 'next/router';
import appFeatures, { FeaturesProps } from '@/constants/features';
import { Loader2, Search } from 'lucide-react';

const QuickSearchModal = (onChangeOpen : () => void) => {
   const navigate = useRouter();
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState<FeaturesProps[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [isSearchOpen, setIsSearchOpen] = useState(false);

   const toggleSearchModal = () => {
      setIsSearchOpen(!isSearchOpen);
   };

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
   }, [searchQuery]);

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
   };

   return (
      <Dialog open={isSearchOpen} onOpenChange={() => setIsSearchOpen(!isSearchOpen)}>
         <DialogOverlay
            className="fixed inset-0 bg-muted/30 z-50"
            onClick={toggleSearchModal}
         />
         <DialogContent className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Recherche</h3>
            <div className="relative w-80">
               <Search
                  className="absolute top-2 left-3 text-gray-400 dark:text-gray-500"
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
         </DialogContent>
      </Dialog>
   )
}

export default QuickSearchModal