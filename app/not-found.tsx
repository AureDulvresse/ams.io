"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";


const NotFoundPage = async () => {
  const router = useRouter();
  
  return (
    <div className="absolute z-50 flex flex-col items-center justify-center w-full min-h-screen bg-muted/50 text-muted-foreground">
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
