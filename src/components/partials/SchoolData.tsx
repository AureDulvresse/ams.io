"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { schoolSchema } from "@/schemas/schoolSchema";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useServerAction from "@/hooks/useServerAction";

interface schoolData {
  name: string;
  address: string;
  email: string;
  phone: string;
}

const SchoolData: React.FC = () => {
  const [formData, setFormData] = useState<schoolData>({
    name: "Academia",
    address: "Rue de l'école",
    email: "contact@academia.com",
    phone: "+242 06 768 67 77",
  });

  const { executeAction, isLoading, validationErrors } = useServerAction(
    "/api/department",
    "update",
    schoolSchema
  );

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveSchoolData = async (e: React.FormEvent) => {
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
    toast.success("Informations établissement mise à jour avec succès !", {
      position: "bottom-right",
    });
  };

  return (
    <div>
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4"> Données de l'École</h2>
        <form className="space-y-4" onSubmit={handleSaveSchoolData}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom de l'etablissement <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              aria-label="Nom du département"
              placeholder="Nom de l'école"
              className="w-full"
            />
            {validationErrors.name && (
              <p className="text-red-500">{validationErrors.name}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom de l'etablissement <span className="text-red-500">*</span>
            </label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              aria-label="Adresse"
              placeholder="Adresse de l'établissement"
              className="w-full"
            />
            {validationErrors.name && (
              <p className="text-red-500">{validationErrors.address}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Adresse mail <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.email}
              onChange={handleChange}
              aria-label="Adresse mail"
              placeholder="Email de contact"
              className="w-full"
            />
            {validationErrors.name && (
              <p className="text-red-500">{validationErrors.email}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              aria-label="Téléphone"
              placeholder="Téléphone"
              className="w-full"
            />
            {validationErrors.name && (
              <p className="text-red-500">{validationErrors.phone}</p>
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

export default SchoolData;
