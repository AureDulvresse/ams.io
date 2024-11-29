"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import AcademicInfoForm from "@/components/forms/AcademicInfoForm";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { Student } from "@/types";
import useFetchData from "@/hooks/useFetchData";
import useServerAction from "@/hooks/useServerAction";

// Interface des données du formulaire
interface StudentData {
  firstName: string;
  lastName: string;
  dob: string | Date;
  pob: string;
  address: string;
  phone: string;
  email: string;
  gender: string;
  levelStudy_id: number;
  paymentMode: number;
}

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/students", label: "Gestion Etudiant" },
  { label: "Modification information étudiant", isCurrent: true },
];

const EditStudent: React.FC = () => {
  const navigate = useRouter();
    const { uuid } = useParams();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StudentData>({
    firstName: "",
    lastName: "",
    dob: "",
    pob: "",
    address: "",
    phone: "",
    email: "",
    gender: "",
    levelStudy_id: 1,
    paymentMode: 1,
  });

const { data: student, error } = useFetchData<Student>(
    `/api/students/${uuid}`
  );

   useEffect(() => {
    if (student) {
      setFormData({
    firstName: student.first_name || "",
    lastName: student.last_name || "",
    dob: student.dob || "",
    pob: student.pob ||"",
    address: student.address || "",
    phone: student.phone || "",
    email: student.email || "",
    gender: student.gender || "",
    levelStudy_id: student.levelStudy_id || 1,
    paymentMode: student.paymentMode || 1,
      });
    }
  }, [student]);

  // Hook pour les actions serveur
  const { executeAction, isLoading } = useServerAction(
    `/api/students/${uuid}`,
    "update"
  );

  // Calcul de la progression (exemple avec 3 étapes)
  const calculateProgress = () => {
    return (step / 2) * 100; // Ajuster en fonction du nombre d'étapes
  };

  // Fonction pour gérer les modifications de formulaire
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;

    const newValue = name === "levelStudy_id" ? Number(value) : value;

    setFormData({ ...formData, [name]: newValue });
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

    toast.success("Etudiant(e) modifié(e) avec succès !", {
      position: "bottom-right",
    });

    // Réinitialisation des données du formulaire après la soumission réussie
    setFormData({
      firstName: "",
      lastName: "",
      dob: "",
      pob: "",
      address: "",
      phone: "",
      email: "",
      gender: "",
      levelStudy_id: 1,
      paymentMode: 1,
    });

    navigate.push(`/students/${uuid}`);
  };

  return (
    <div className="mx-auto space-y-6">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="relative w-full h-2.5 mb-4 bg-gray-200 rounded-full">
        {/* Barre de progression */}
        <div
          className="absolute top-0 left-0 h-2.5 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-full animate-out"
          style={{ width: `${calculateProgress()}%` }}
        ></div>

        {/* Cercles des étapes */}
        <div className="absolute top-[-10px] w-full flex justify-between">
          {[1, 2].map((item) => (
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
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
         
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

export default EditStudent;
