"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import SelectField from "../common/SelectField";
import { Card } from "@/components/ui/card";
import useServerAction from "@/hooks/useServerAction";

const currencyOptions = [
  { label: "Franc CFA", value: "XAF" },
  { label: "Euro", value: "EUR" },
  { label: "Dollar USA", value: "USD" },
];

interface generalData {
  currency: "EUR" | "USD" | "XAF";
  academicYear: string;
}

const GeneralData: React.FC = () => {
const [formData, setFormData] = useState<generalData>({
    currency: "XAF",
    academicYear: "2023-2024",
  });

  const { executeAction, isLoading } = useServerAction(
    "/api/department",
    "update"
  );

    const handleCurrencyChange = (value: string) => {
    handleChange({
      target: { name: "currency", value },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSaveGeneralData =async (e: React.FormEvent) => {
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
    toast.success("Données générale mise à jour avec succès !", {
      position: "bottom-right",
    });
  };

  return (
    <div>
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Configurations Générales</h2>
        <form className="space-y-4" onSubmit={handleSaveGeneralData}>
          {/* Layout ajusté pour redimensionner les cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">

            {/* Carte pour la sélection de la devise */}
            <div className="bg-white shadow-lg rounded-lg p-4 lg:p-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-700">Devise</h4>
              <SelectField
                label="Devise"
                name="currency"
                placeholder="Sélectionner une devise"
                options={currencyOptions}
                onChange={handleCurrencyChange}
                required={true}
              />
            </div>

            {/* Carte pour l'année académique */}
            <div className="bg-white shadow-lg rounded-lg p-4 lg:p-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-700">
                Année Académique
              </h4>
              <Input
              name="academicYear"
                 value={formData.address}
              onChange={handleChange}
                placeholder="Année académique"
                className="w-full"
              />
            </div>
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

export default GeneralData;
