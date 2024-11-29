"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import ErrorCard from "@/components/partials/ErrorCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LevelStudy } from "@/types";
import useFetchData from "@/hooks/useFetchData";
import useServerAction from "@/hooks/useServerAction";
import { levelStudySchema } from "@/schemas/levelStudySchema";

interface LevelStudyData {
  designation: string;
  description?: string;
}

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/level-study", label: "Niveau d'étude" },
  { label: "Modification informations niveau d'étude", isCurrent: true },
];

const EditDepartment = () => {
  const router = useRouter();
  const { id } = useParams();

  // Fetch department data using the id from the route
  const { data: department, error } = useFetchData<LevelStudy>(
    `/api/level-study/${id}`
  );

  const [formData, setFormData] = useState<LevelStudyData>({
    designation: "",
    description: "",
  });

  const { executeAction, isLoading, validationErrors } = useServerAction(
    `/api/level-study/${id}`,
    "update",
    levelStudySchema
  );

  useEffect(() => {
    if (department) {
      setFormData({
        designation: department.designation || "",
        description: department.description || "",
      });
    }
  }, [department]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isSuccess, message } = await executeAction(formData);

    if (!isSuccess) {
      toast.error(message || "Une erreur est survenue.", {
        position: "bottom-right",
      });
      return;
    }

    toast.success("Département modifié avec succès !", {
      position: "bottom-right",
    });

    // Redirection après succès
    router.push("/department");
  };

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="mx-auto p-4 space-y-6">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-4">
          Modification information niveau d'étude
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Désignation <span className="text-red-500">*</span>
            </label>
            <Input
              name="designation"
              className="w-full"
              placeholder="Nom du département"
              value={formData.designation}
              onChange={handleChange}
              aria-label="Désignation"
            />
            {validationErrors.name && (
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

export default EditDepartment;
