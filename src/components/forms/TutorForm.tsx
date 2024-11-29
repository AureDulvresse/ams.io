import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { StudentTutor } from "@/types";
import { Loader2 } from "lucide-react";

interface TutorFormProps {
  title?: string;
  initialData?: StudentTutor;
  onSubmit: (data: {
    name: string;
    phone: string;
    email: string;
    created_at: string | Date;
    updated_at: string | Date;
  }) => void;
  isSubmitting?: boolean;
  nextStep?: () => void;
  prevStep?: () => void;
  showNavigation?: boolean;
}

const TutorForm: React.FC<TutorFormProps> = ({
  title,
  initialData = {
    name: "",
    phone: "",
    email: "",
    created_at: "",
    updated_at: "",
  },
  onSubmit,
  isSubmitting = false,
  nextStep,
  prevStep,
  showNavigation = false, // Valeur par défaut
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
  });

  // État pour les erreurs de validation
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Réinitialiser les erreurs pour le champ en cours de modification
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      email: "",
    };

    // Vérifier que le nom est rempli
    if (!formData.name) {
      newErrors.name = "Le nom du tuteur est requis.";
    }

    // Vérifier que le numéro de téléphone est rempli et valide
    if (!formData.phone) {
      newErrors.phone = "Le numéro de téléphone du tuteur est requis.";
    } else if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Le numéro de téléphone doit contenir 9 chiffres.";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();

    if (validationErrors.name || validationErrors.phone) {
      // S'il y a des erreurs, les afficher et ne pas soumettre le formulaire
      setErrors(validationErrors);
      return;
    }

    // Si tout est valide, soumettre le formulaire
    onSubmit({
      ...formData,
      created_at: initialData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (isSubmitting && nextStep) {
      nextStep(); // Passer à l'étape suivante si isSubmitting est true
    }
  };

  return (
    <div>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom complet du tuteur <span className="text-red-500">*</span>
          </label>
          <Input
            name="name"
            className="w-full"
            placeholder="Nom complet du tuteur"
            value={formData.name}
            onChange={handleChange}
            required
            aria-label="Nom complet du tuteur"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Numéro du tuteur <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            name="phone"
            className="w-full"
            placeholder="Numéro de téléphone du tuteur"
            value={formData.phone}
            onChange={handleChange}
            required
            aria-label="Numéro de téléphone du tuteur"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email du tuteur <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            className="w-full"
            placeholder="Adresse e-mail du tuteur"
            value={formData.email}
            onChange={handleChange}
            aria-label="Adresse e-mail du tuteur"
          />
        </div>

        {showNavigation ? (
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
              className="w-48 bg-gradient-to-tr from-indigo-400 to-indigo-500 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="animate-spin text-white" size={15} />
                  <span className="text-white">Traitement...</span>
                </div>
              ) : (
                "Suivant"
              )}
            </Button>
          </div>
        ) : (
          <div className="text-right mt-3">
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-48 bg-gradient-to-tr from-indigo-400 to-indigo-500 text-white"
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
        )}
      </div>
    </div>
  );
};

export default TutorForm;
