import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SelectField from "@/components/common/SelectField";
import useFetchData from "@/hooks/useFetchData";
import { administrativeInfoSchema } from "@/schemas/staffSchema";
import { toast } from "react-toastify";
import { Contract, Department, Role } from "@/types";
import ErrorCard from "../partials/ErrorCard";

interface AcademicInfoFormProps {
  initialData?: {
    employee_type: string;
    contract_id: number;
    role_id: number;
    daily_salary: number;
    department_id?: number;
    hire_at?: string | Date;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (data: {
    employee_type: string;
    contract_id: number;
    role_id: number;
    daily_salary: number;
    department_id: number;
    hire_at?: string | Date;
  }) => void;
  isSubmitting?: boolean;
  prevStep?: () => void;
}

const employeeTypeOptions = [
  { label: "Enseignant", value: "teacher" },
  { label: "Autre", value: "other" }
]

const AdministrativeInfoForm: React.FC<AcademicInfoFormProps> = ({
  initialData = {
    employee_type: "",
    contract_id: 0,
    role_id: 0,
    daily_salary: 2500,
    department_id: 0,
    hire_at: new Date().toDateString()
  },
  onSubmit,
  isSubmitting = false,
  handleInputChange,
  prevStep,
}) => {
  const [formData, setFormData] = useState({
    employee_type: initialData.employee_type || "",
    contract_id: initialData.contract_id || 0,
    role_id: initialData.role_id || 0,
    daily_salary: initialData.daily_salary || 0,
    department_id: initialData.department_id || 0,
    hire_at: initialData.hire_at || new Date().toLocaleDateString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: contracts,
    isLoading: loadContracts,
    error: errorLoadContracts,
  } = useFetchData<Contract[]>("/api/contracts");

  const {
    data: roles,
    isLoading: loadRole,
    error: errorLoadRole,
  } = useFetchData<Role[]>("/api/roles");

  const {
    data: departments,
    isLoading: loadDepartment,
    error: errorLoadDepartment,
  } = useFetchData<Department[]>("/api/departments");


  const contractsOptions = contracts
    ? contracts
      .map((contract) => ({ label: contract.libelle, value: contract.id.toString() }))
    : [];

  const rolesOptions = roles
    ? roles
      .filter((role) => role.name == "student" || role.name == "parent")
      .map((role) => ({ label: role.name, value: role.id.toString() }))
    : [];

  const departmentsOptions = departments
    ? departments
      .map((departement) => ({ label: departement.name, value: departement.id.toString() }))
    : [];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleContractChange = (value: string) => {
    handleInputChange({
      target: { name: "contract_id", value },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleEmployeeTypeChange = (value: string) => {
    handleInputChange({
      target: { name: "employee_type", value },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleRoleChange = (value: string) => {
    handleInputChange({
      target: { name: "role_id", value },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleDepartmentChange = (value: string) => {
    handleInputChange({
      target: { name: "department_id", value },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleSubmit = () => {
    // Validation des données avec Zod
    const result = administrativeInfoSchema.safeParse(formData);

    if (!result.success) {
      // Extraire les erreurs de validation de Zod et les afficher
      const validationErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          validationErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(validationErrors);

      toast.error("Une erreur est survenue !", {
        position: "bottom-right",
      });
    } else {
      // Réinitialiser les erreurs si la validation passe
      setErrors({});
      onSubmit(formData);

      toast.success("Informations enregistrées avec succès !", {
        position: "bottom-right",
      });
    }
  };

  if (errorLoadContracts || errorLoadRole || errorLoadDepartment) {
    const error = errorLoadContracts || errorLoadRole || errorLoadDepartment || { message: "" };
    return <ErrorCard message={error.message} />;
  }


  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Étape 3 : Informations administrative
      </h2>
      <div className="flex flex-col gap-4">
        <div>
          <SelectField
            name="contract_id"
            label="Sélectionner un type de contrat"
            placeholder="Choisissez un type de contrat"
            options={contractsOptions}
            onChange={handleContractChange}
            isLoading={loadContracts}
            error={errors.contract_id}
          />
          {errors.classId && (
            <p className="text-red-500 mt-1 text-sm">{errors.contract_id}</p>
          )}
        </div>
        <div>
          <SelectField
            name="employee_type"
            label="Type d'employé"
            placeholder="Choisissez un type d'employé"
            options={employeeTypeOptions}
            onChange={handleEmployeeTypeChange}
            error={errors.employee_type}
          />
          {errors.classId && (
            <p className="text-red-500 mt-1 text-sm">{errors.contract_id}</p>
          )}
        </div>

        <div>
          <SelectField
            name="role_id"
            label="Sélectionner une fonction"
            placeholder="Choisissez la fonction du personnel"
            isLoading={loadRole}
            options={rolesOptions}
            onChange={handleRoleChange}
            error={errors.department_id}
          />
          {errors.classId && (
            <p className="text-red-500 mt-1 text-sm">{errors.department_id}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Salaire journalier <span className="text-red-500">*</span>
          </label>
          <Input
            name="daily_salary"
            type="number"
            className="w-full"
            placeholder="Salaire journalier"
            value={formData.daily_salary}
            onChange={handleChange}
            required
            aria-label="Salaire journalier"
          />
          {errors.daily_salary && (
            <p className="text-red-500 mt-1 text-sm">{errors.daily_salary}</p>
          )}
        </div>

        <div>
          <SelectField
            name="department_id"
            label="Sélectionner un departement"
            placeholder="Choisissez un departement"
            options={departmentsOptions}
            onChange={handleDepartmentChange}
            isLoading={loadDepartment}
            error={errors.department_id}
          />
          {errors.classId && (
            <p className="text-red-500 mt-1 text-sm">{errors.department_id}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Engagé le : <span className="text-red-500">*</span>
          </label>
          <Input
            name="hire_at"
            type="date"
            className="w-full"
            placeholder="Engagé le (facultatif)"
            value={formData.hire_at.toLocaleString()}
            onChange={handleChange}
            aria-label="Engagé le"
          />
        </div>

        <div className="text-right mt-3">
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
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </div >
  );
};

export default AdministrativeInfoForm;
