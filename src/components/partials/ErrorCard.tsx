"use client";
import React from "react";
import { Frown } from "lucide-react"
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const ErrorCard: React.FC<{ message: string | undefined }> = async ({ message }) => {
  const navigate = useRouter()
  
  return (
    <Card className="flex flex-col items-center justify-center h-screen rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-8xl text-indigo-500">
        <Frown size={65} />
      </h1>
      <p className="text-2xl mt-4 font-inter">
        Oops ! Une erreur est survenue...
      </p>
      <p className="text-lg mt-2 font-inter">{message}</p>
      <Button
        type="button"
        onClick={() => navigate.refresh()}
        className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded-md"
      >
        Rafraîchir
      </Button>
    </Card>
  );
};

export default ErrorCard;