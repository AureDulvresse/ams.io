"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import TutorForm from "@/components/forms/TutorForm";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import AcademicInfoForm from "@/components/forms/AcademicInfoForm";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Progress } from "@/components/ui/progress";
import { StudentTutor } from "@/types";
import useServerAction from "@/hooks/useServerAction";
import { toast } from "react-toastify";

// Interface des données du formulaire
interface StudentData {
  matricule: string;
  firstName: string;
  lastName: string;
  dob: string;
  pob: string;
  address: string;
  phone: string;
  email: string;
  gender: string;
  picture?: File | null;
  levelStudy_id: number;
  tutor: StudentTutor;
  paymentMode: number;
}

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/students", label: "Gestion Etudiant" },
  { label: "Enregistrement Etudiant", isCurrent: true },
];

const StudentRegistrationForm: React.FC = () => {
  const navigate = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StudentData>({
    matricule: "",
    firstName: "",
    lastName: "",
    dob: "",
    pob: "",
    address: "",
    phone: "",
    email: "",
    gender: "",
    picture: null,
    levelStudy_id: 1,
    tutor: {
      name: "",
      phone: "",
      email: "",
      created_at: "",
      updated_at: "",
    },
    paymentMode: 1,
  });

  // Hook pour les actions serveur
  const { executeAction, isLoading } = useServerAction(
    "/api/students",
    "create"
  );

  // Calcul de la progression
  const calculateProgress = () => {
    return (step / 3) * 100;
  };

  // Fonction pour gérer les modifications de formulaire
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;

    const newValue = name === "levelStudy_id" ? Number(value) : value;

    setFormData({ ...formData, [name]: newValue });
  };

  const handlePhotoUpload = (file: File | null) => {
    setFormData((prevState) => ({
      ...prevState,
      picture: file,
    }));
  };

  // Fonction pour passer à l'étape suivante
  const nextStep = () => {
    setStep(step + 1);
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    setStep(step - 1);
  };

  // Fonction pour soumettre le formulaire final
  const handleSubmit = async () => {

    try {
    // Générer le matricule
    const generatedMatricule = `AS-${formData.firstName[0]}${
      formData.lastName[0]
    }${new Date()
      .toLocaleDateString("fr-FR")
      .replace(/\//g, "")}-${Math.random()
      .toString(36)
      .substr(2, 8)
      .toUpperCase()}`;

    const studentData = { ...formData, matricule: generatedMatricule, };

    const { isSuccess, message } = await executeAction(studentData);

    if (!isSuccess) {
      toast.error(
        `${message ? message : "Oops ! Une erreur est survenue..."}`,
        {
          position: "bottom-right",
        }
      );
      return;
    }

    toast.success("Etudiant(e) créé(e) avec succès !", {
      position: "bottom-right",
    });

    // Réinitialisation des données du formulaire après la soumission réussie
    setFormData({
      matricule: "",
      firstName: "",
      lastName: "",
      dob: "",
      pob: "",
      address: "",
      phone: "",
      email: "",
      gender: "",
      picture: null,
      levelStudy_id: 1,
      tutor: {
        name: "",
        phone: "",
        email: "",
        created_at: "",
        updated_at: "",
      },
      paymentMode: 1,
    });

    navigate.push("/students");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      toast.error(
        "Une erreur est survenue lors de l'inscription du personnel.",
        {
          position: "bottom-right",
        }
      );
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="relative w-full h-2.5 mb-4 bg-gray-200 rounded-full">
        {/* Barre de progression */}
        <Progress
          className="absolute top-0 left-0 h-2.5 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-full animate-out"
          style={{ width: `${calculateProgress()}%` }}
        />

        {/* Cercles des étapes */}
        <div className="absolute top-[-10px] w-full flex justify-between">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="relative flex items-center justify-center"
            >
              {/* Le cercle */}
              <div
                className={`w-6 h-6 rounded-full border-2 border-gray-300 ${
                  step >= item
                    ? "bg-gradient-to-tr from-indigo-400 to-indigo-500"
                    : "bg-white"
                } flex items-center justify-center`}
              >
                <span
                  className={`text-xs font-bold ${
                    step >= item ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-4">
        {step === 1 && (
          <PersonalInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handlePhotoUpload={handlePhotoUpload}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <TutorForm
            title="Étape 2 : Information tuteur"
            initialData={formData.tutor}
            onSubmit={(tutorData) => {
              setFormData((prevData) => ({
                ...prevData,
                tutor: {
                  ...tutorData,
                  created_at:
                    prevData.tutor.created_at || new Date().toISOString(), // Ajout de created_at
                  updated_at: new Date().toISOString(), // Ajout de updated_at
                },
              }));
              nextStep();
            }}
            isSubmitting={isLoading} // Utilisation de isLoading provenant de useServerAction
            prevStep={prevStep}
            showNavigation={true} // Afficher la navigation Précédent/Suivant
          />
        )}
        {step === 3 && (
          <AcademicInfoForm
            initialData={{
              levelStudy_id: formData.levelStudy_id,
              paymentMode: 1,
            }}
            handleInputChange={handleInputChange}
            onSubmit={(academicData) => {
              setFormData((prevData) => ({
                ...prevData,
                levelStudy_id: academicData.levelStudy_id,
                paymentMode: academicData.paymentMode || 1,
              }));
              handleSubmit();
            }}
            isSubmitting={isLoading} // Utilisation de isLoading provenant de useServerAction
            prevStep={prevStep}
          />
        )}
      </Card>
    </div>
  );
};

export default StudentRegistrationForm;
