"use client";
import React from "react";
import { headers } from 'next/headers'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


const NotFoundPage: React.FC = async () => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-7xl font-bold font-fredoka text-indigo-500">404</h1>
      <p className="text-2xl mt-4 font-inter">Page non trouvée</p>
      <p className="text-lg mt-2 font-inter">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
       <Button variant="outline" onClick={() => router.back()} className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded-md">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
    </div>
  );
};

export default NotFoundPage;
