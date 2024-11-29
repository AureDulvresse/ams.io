"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Progress } from "@/components/ui/progress";
import useServerAction from "@/hooks/useServerAction";
import { toast } from "react-toastify";
import AdministrativeInfoForm from "@/components/forms/AdministrativeInfoForm";

// Interface des données du formulaire
interface StaffData {
  matricule: string;
  firstName: string;
  lastName: string;
  dob: string;
  pob: string;
  address: string;
  phone: string;
  email: string;
  gender: string;
  employee_type: string;
  contract_id: number;
  role_id: number;
  daily_salary: number;
  department_id?: number;
  hire_at?: string | Date;
}

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/hr", label: "Ressources humaine" },
  { label: "Enregistrement Personnel", isCurrent: true },
];

const HireStaff: React.FC = () => {
  const navigate = useRouter();
  const [step, setStep] = useState(1); // Étape actuelle
  const [formData, setFormData] = useState<StaffData>({
    matricule: "",
    firstName: "",
    lastName: "",
    dob: "",
    pob: "",
    address: "",
    phone: "",
    email: "",
    gender: "",
    employee_type: "",
    contract_id: 0,
    role_id: 0,
    daily_salary: 2500,
    department_id: 0,
    hire_at: new Date().toDateString()
  });

  // Hook pour les actions serveur
  const { executeAction, isLoading } = useServerAction(
    "/api/hr/staff",
    "create"
  );

  // Calcul de la progression
  const calculateProgress = () => {
    return (step / 2) * 100;
  };

  // Fonction pour gérer les modifications de formulaire
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
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
    try {
      // Générer le matricule ici
      const generatedMatricule = `NUM_PERSONNEL-${Math.random()
        .toString(36)
        .substr(2, 9)
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

      // Réinitialiser le formulaire ou rediriger après la création
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
        employee_type: "",
        contract_id: 0,
        role_id: 0,
        daily_salary: 2500,
        department_id: 0,
        hire_at: new Date().toDateString()
      });

      navigate.push("/hr");

    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      toast.error(
        "Une erreur est survenue lors de l'enregistrement du personnel.",
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
          {[1, 2].map((item) => (
            <div
              key={item}
              className="relative flex items-center justify-center"
            >
              {/* Le cercle */}
              <div
                className={`w-6 h-6 rounded-full border-2 border-gray-300 ${step >= item
                    ? "bg-gradient-to-tr from-indigo-400 to-indigo-500"
                    : "bg-white"
                  } flex items-center justify-center`}
              >
                <span
                  className={`text-xs font-bold ${step >= item ? "text-white" : "text-gray-500"
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
          <AdministrativeInfoForm
            initialData={{
              employee_type: formData.employee_type || "",
              contract_id: formData.contract_id || 0,
              role_id: formData.role_id || 0,
              daily_salary: formData.daily_salary || 2500,
              department_id: formData.department_id || 0,
              hire_at: formData.hire_at || new Date().toDateString()
            }}
            onSubmit={handleSubmit}
            isSubmitting={false}
            handleInputChange={handleInputChange}
          />
        )}
      </Card>
    </div>
  );
};

export default HireStaff;
