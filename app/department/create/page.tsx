"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { departmentSchema } from "@/schemas/departmentSchema";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useServerAction from "@/hooks/useServerAction";

interface departmentData {
  name: string;
  description?: string;
}

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/department", label: "Gestion des departements" },
  { label: "Enregistrement département", isCurrent: true },
];

const DepartmentForm = () => {
  const navigate = useRouter();
  const [formData, setFormData] = useState<departmentData>({
    name: "",
    description: "",
  });

  const { executeAction, isLoading, validationErrors } = useServerAction(
    "/api/department",
    "create",
    departmentSchema
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

    const { isSuccess, message } = await executeAction(formData);

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
    toast.success("Département enregistré avec succès !", {
      position: "bottom-right",
    });

    // Redirection vers la page des départements
    navigate.push("/department");
  };

  return (
    <div className="mx-auto p-2 space-y-6">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-4">Enregistrement département</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom du département <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              className="w-full"
              placeholder="Nom du département"
              value={formData.name}
              onChange={handleChange}
              aria-label="Nom du département"
            />
            {validationErrors.name && (
              <p className="text-red-500">{validationErrors.name}</p>
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

export default DepartmentForm;
