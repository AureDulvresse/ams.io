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
import useFetchData from "@/hooks/useFetchData";
import { Department } from "@/types";
import SelectField from "@/components/common/SelectField";
import { courseSchema } from "@/schemas/courseSchema";
import ErrorCard from "@/components/partials/ErrorCard";

// Interface pour les données du formulaire de cours
interface CourseData {
  name: string;
  description?: string;
  credits: number;
  department_id: number;
}

// Éléments de fil d'ariane (breadcrumbs)
const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/courses", label: "Gestion des cours" },
  { label: "Ajouter un cours", isCurrent: true },
];

const NewCourse = () => {
  const navigate = useRouter();
  const [formData, setFormData] = useState<CourseData>({
    name: "",
    description: "",
    credits: 2,
    department_id: 0,
  });

  // Récupération des départements
  const {
    data: departments,
    isLoading: loadDepartment,
    error,
  } = useFetchData<Department[]>("/api/department");

  // Hook pour gérer l'action d'enregistrement d'un cours
  const { executeAction, isLoading, validationErrors } = useServerAction(
    "/api/courses",
    "create",
    courseSchema
  );

  // Options pour le champ des départements
  const departmentOptions = departments
    ? departments.map((d) => ({ label: d.name, value: d.id.toString() }))
    : [];

  // Gestion des changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

     // Si le champ est de type "number", on convertit la valeur en nombre
    const newValue = name === "credits" ? Number(value) : value;

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  // Gestion du changement pour le SelectField
  const handleDepartmentChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      department_id: parseInt(value, 10),
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isSuccess, message } = await executeAction(formData);

    if (!isSuccess) {
      toast.error(
        `${message ? message : "Oops ! Une erreur est survenue..."}`,
        {
          position: "bottom-right",
        }
      );
      return;
    }

    toast.success("Cours ajouté avec succès !", {
      position: "bottom-right",
    });

    navigate.push("/courses");
  };

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="mx-auto space-y-6">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-4">Enregistrement cours</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nom du cours */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Désignation du cours <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              className="w-full"
              placeholder="Nom du cours"
              value={formData.name}
              onChange={handleChange}
              aria-label="Désignation du cours"
            />
            {validationErrors.name && (
              <p className="text-red-500">{validationErrors.name}</p>
            )}
          </div>

          {/* Description */}
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
              aria-label="Description du cours"
            />
            {validationErrors.description && (
              <p className="text-red-500">{validationErrors.description}</p>
            )}
          </div>

          {/* Département */}
          <div>
            <SelectField
              label="Département"
              name="department_id"
              placeholder="Choisissez un département"
              isLoading={loadDepartment}
              options={departmentOptions}
              onChange={handleDepartmentChange}
              required={true}
              error={validationErrors.department_id}
            />
          </div>

          {/* Nombre de crédits */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre de crédits <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              name="credits"
              className="w-full"
              placeholder="Nombre de crédits"
              value={formData.credits}
              onChange={handleChange}
              aria-label="Nombre de crédits"
              min={1}
            />
            {validationErrors.credits && (
              <p className="text-red-500">{validationErrors.credits}</p>
            )}
          </div>

          {/* Bouton de soumission */}
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

export default NewCourse;
