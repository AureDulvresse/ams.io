"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search, Bell, MessageCircle, Moon, Sun, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import FEATURES, { FeaturesProps } from "@/constants/FEATURES";

const Topbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FeaturesProps[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { theme, setTheme } = useTheme();

  const [currentTime, setCurrentTime] = useState<string | null>(null);

  // Simulation des notifications
  const [notifications] = useState([
    "Notification 1",
    "Notification 2",
    "Notification 3",
  ]);

  // Mettre à jour l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString();
      const formattedDate = now.toLocaleDateString();
      setCurrentTime(`${formattedDate} ${formattedTime}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simule la recherche avec un délai pour les résultats
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true);
      setTimeout(() => {
        setSearchResults(
          FEATURES.filter(({ name }) =>
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
    <div
      className={`fixed w-[calc(100%-268px)] z-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-md rounded-md max-w-[calc(100%-268px)]`}
    >
      <div className="flex justify-between items-center px-4 py-3">
        {/* Recherche rapide */}
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

        <div className="flex items-center gap-4">
          {/* Heure actuelle */}
          <div className="text-sm text-gray-500 dark:text-gray-300 border-r-[1.75px] border-r-slate-300 px-2 py-1.5">
            {currentTime}
          </div>

          {/* Icônes et Avatar */}
          <div className="flex items-center space-x-3.5">
            {/* Thème */}
            <div className="cursor-pointer" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="text-yellow-300" size={24} />
              ) : (
                <Moon className="text-gray-500 dark:text-gray-300" size={24} />
              )}
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative">
                  <Bell
                    className="text-gray-500 dark:text-gray-300"
                    size={24}
                  />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-gray-800"></span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {notifications.map((notif, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-center gap-2"
                    onClick={() => alert("ABC")}
                  >
                    {notif}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => navigate.push("/notifications")}
                >
                  Voir plus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messagerie */}
            <Link href="/chat" className="relative cursor-pointer">
              <MessageCircle
                className="text-gray-500 dark:text-gray-300"
                size={24}
              />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-600 ring-2 ring-white dark:ring-gray-800"></span>
            </Link>

            {/* Avatar */}
            <div className="flex items-center space-x-2">
              <h4 className="text-sm text-gray-500 dark:text-gray-300">
                Aure Dulvresse
              </h4>
              <div className="relative w-10 h-10">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-400 dark:border-indigo-500">
                  <Avatar>
                    <AvatarImage
                      src={"https://randomuser.me/api/portraits/men/1.jpg"}
                      alt="profile"
                      className="rounded-full"
                      style={{ objectFit: "cover" }}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>

                {/* Avatar école */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[0.75px] border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <Avatar>
                    <AvatarImage
                      src={"https://randomuser.me/api/portraits/men/2.jpg"}
                      alt="school-logo"
                      className="rounded-full"
                      style={{ objectFit: "cover" }}
                    />
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
