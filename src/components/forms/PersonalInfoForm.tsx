import React, { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SelectField from "../common/SelectField";
import PictureUpload from "../common/PictureUpload";
import { personalInfoSchema } from "@/schemas/studentSchemas";

interface PersonalInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    dob: string;
    pob: string;
    address: string;
    phone: string;
    email: string;
    gender: string;
    picture?: File | null; // Ajout du champ photo optionnel
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handlePhotoUpload?: (file: File | null) => void; // Callback pour gérer la photo
  nextStep: () => void;
}

const genders = [
  { label: "Masculin", value: "M" },
  { label: "Féminin", value: "F" },
];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleInputChange,
  handlePhotoUpload, // Callback pour le téléchargement de la photo
  nextStep,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGenderChange = (value: string) => {
    handleInputChange({
      target: { name: "gender", value },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleFileUpload = (file: File | null) => {
    // Appeler la fonction de gestion du téléchargement de la photo
    handlePhotoUpload?.(file);
    console.log(file);
  };

  const handleSubmit = () => {
    try {
      // Validation des données
      personalInfoSchema.parse(formData);
      setErrors({});
      nextStep();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Gestion des erreurs Zod
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 font-inter text-indigo-500">
        Étape 1 : Informations Personnelles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Prénom(s) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Entrer le/les prénom(s)"
            required
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom(s) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Entrer le/les nom(s)"
            required
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Date de naissance <span className="text-red-500">*</span>
          </label>

          <Input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            placeholder="Entrer la date de naissance"
            required
          />

          {errors.dob && <p className="text-red-500">{errors.dob}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Lieu de naissance <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="pob"
            value={formData.pob}
            onChange={handleInputChange}
            placeholder="Entrer le lieu de naissance"
            required
          />
          {errors.pob && <p className="text-red-500">{errors.pob}</p>}
        </div>

        <div>
          <SelectField
            label="Sexe"
            name="gender"
            placeholder="Sélectionner le sexe"
            options={genders}
            onChange={handleGenderChange}
            required={true}
            error={errors.gender}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Adresse <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Entrer l'adresse de l'etudiant"
            required
          />
          {errors.address && <p className="text-red-500">{errors.address}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Numéro de téléphone <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Téléphone"
            required
          />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Adresse electronique <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div>
          <PictureUpload
            onUpload={handleFileUpload} // Permet le téléchargement de la photo
          />
          {formData.picture ? null : (
            <p className="text-sm text-gray-500">
              Télécharger une photo (optionnel)
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          className="w-48 bg-gradient-to-tr from-indigo-400 to-indigo-500 text-white"
          onClick={handleSubmit}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
