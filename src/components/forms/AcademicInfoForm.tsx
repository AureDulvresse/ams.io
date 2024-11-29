import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import SelectField from "../common/SelectField";
import { academicInfoSchema } from "@/schemas/studentSchemas";
import { Loader2 } from "lucide-react";
import useFetchData from "@/hooks/useFetchData";
import ErrorCard from "../partials/ErrorCard";
import { LevelStudy } from "@/types";

interface AcademicInfoFormProps {
  initialData?: {
    levelStudy_id: number;
    year?: string;
    paymentMode?: number;
  };
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string } }
  ) => void;
  onSubmit: (data: {
    levelStudy_id: number;
    year?: string;
    paymentMode?: number;
  }) => void;
  isSubmitting?: boolean;
  prevStep?: () => void;
}

const AcademicInfoForm: React.FC<AcademicInfoFormProps> = ({
  initialData = { levelStudy_id: 1, year: "", paymentMode: 1 }, // Par défaut, paiement mensuel
  onSubmit,
  isSubmitting = false,
  handleInputChange,
  prevStep,
}) => {
  const {
    data: levelsStudy,
    isLoading: loadLevelStudy,
    error,
  } = useFetchData<LevelStudy[]>("/api/level-study");

  const levelStudyOptions = levelsStudy
    ? levelsStudy.map((d) => ({ label: d.designation, value: d.id.toString() }))
    : [];

  const paymentModeOptions = [
    { label: "Mensuel", value: "1" },
    { label: "Trimestriel", value: "2" },
    { label: "Semestriel", value: "3" },
    { label: "Annuel", value: "4" },
  ];

  const [formData, setFormData] = useState({
    levelStudy_id: initialData.levelStudy_id || 0,
    year: initialData.year || "",
    paymentMode: initialData.paymentMode || 1, // Ajout du mode de paiement
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    handleInputChange(e);
  };

  const handleLevelStudyChange = (
    value: string,
    e: { target: { name: string; value: string } }
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      levelStudy_id: parseInt(value, 10),
    }));

    handleInputChange(e);
  };

  const handlePaymentModeChange = (
    value: string,
    e: { target: { name: string; value: string } }
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      paymentMode: parseInt(value, 10),
    }));

    handleInputChange(e);
  };

  const handleSubmit = () => {
    const result = academicInfoSchema.safeParse(formData);

    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          validationErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(validationErrors);
    } else {
      setErrors({});
      onSubmit(formData); // Envoie formData au composant parent
    }
  };

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Étape 3 : Informations académiques
      </h2>
      <div className="flex flex-col gap-4">
        <div>
          <SelectField
            label="Sélectionner le niveau d'étude"
            name="levelStudy_id"
            placeholder="Choisissez un niveau d'étude"
            options={levelStudyOptions}
            onChange={handleLevelStudyChange}
            isLoading={loadLevelStudy}
            required={true}
          />
          {errors.levelStudy_id && (
            <p className="text-red-500 mt-1 text-sm">{errors.levelStudy_id}</p>
          )}
        </div>
        <div>
          <Input
            name="year"
            className="w-full"
            placeholder="Année académique (facultatif)"
            value={formData.year}
            onChange={handleChange}
            aria-label="Année académique"
          />
        </div>
        <div>
          <SelectField
            label="Mode de paiement"
            name="paymentMode"
            placeholder="Choisissez un mode de paiement"
            options={paymentModeOptions}
            onChange={handlePaymentModeChange}
          />
        </div>
        <div className="flex justify-between mt-3">
          {prevStep && (
            <Button
              type="button"
              onClick={prevStep}
              className="w-48 bg-gray-400 text-white"
            >
              Précédent
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-48 bg-gradient-to-tr from-indigo-400 to-indigo-500 px-3 py-2 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-105 transition-transform"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1">
                <Loader2 className="animate-spin text-white" size={15} />
                <span className="text-white">Traitement...</span>
              </div>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcademicInfoForm;
