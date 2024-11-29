"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useServerAction from "@/hooks/useServerAction";
import { levelStudySchema } from "@/schemas/levelStudySchema";

interface levelStudyData {
  designation: string;
  description?: string;
}

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/configuration", label: "Configuration" },
  { href: "/level-study", label: "Niveaux d'étude" },
  { label: "Enregistrement niveau d'étude", isCurrent: true },
];

const NewLevelStudy = () => {
  const navigate = useRouter();
  const [formData, setFormData] = useState<levelStudyData>({
    designation: "",
    description: "",
  });

  const { executeAction, isLoading, validationErrors } = useServerAction(
    "/api/level-study",
    "create",
    levelStudySchema
  );

  // Gestion des changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {isSuccess, message} = await executeAction(formData);

    // Si des erreurs existent, afficher le toast d'erreur et stopper
    if (!isSuccess) {
      toast.error(
        `${message ? message : "Oops ! Une erreur est survenue..."}`,
        {
          position: "bottom-right",
        }
      );
      return; // Stopper ici
    }

    // Si aucune erreur, afficher le succès et rediriger
    toast.success("Niveau d'étude enregistré avec succès !", {
      position: "bottom-right",
    });

    // Redirection vers la page des départements
    navigate.push("/level-study");
  };


  return (
    <div className="mx-auto p-2 space-y-6">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-4">
          Enregistrement d'un niveau d'étude
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Designation <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="designation"
              className="w-full"
              placeholder="Désignation"
              value={formData.designation}
              onChange={handleChange}
              aria-label="Désignation"
            />
            {validationErrors.designation && (
              <p className="text-red-500">{validationErrors.designation}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Textarea
              name="description"
              className="w-full h-18 resize-none"
              placeholder="Description (Facultatif)"
              value={formData.description}
              onChange={handleChange}
              aria-label="Description du département"
            />
            {validationErrors.description && (
              <p className="text-red-500">{validationErrors.description}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-48 bg-gradient-to-tr from-indigo-400 to-indigo-500 px-3 py-2 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-105 transition-transform"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="animate-spin text-white" size={15} />
                <span className="text-white">Traitement...</span>
              </div>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default NewLevelStudy;
