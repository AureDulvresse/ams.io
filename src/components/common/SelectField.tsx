"use client";
import React, { useState } from "react";
import Select from "react-select";

interface SelectFieldProps {
  label: string;
  name: string;
  placeholder: string;
  isDisabled?: boolean; // Optionnel
  isLoading?: boolean; // Optionnel
  isClearable?: boolean; // Optionnel
  isSearchable?: boolean; // Optionnel
  required?: boolean; // Optionnel
  options: Array<{ label: string; value: string }>;
  onChange?: (
    value: string,
    e: { target: { name: string; value: string } }
  ) => void; // La fonction onChange reçoit un "événement" simulé
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  placeholder,
  isDisabled = false,
  isLoading = false,
  isClearable = false,
  isSearchable = false,
  required = false,
  options,
  onChange,
  error,
}) => {
  const [currentValue, setCurrentValue] = useState<{
    label: string;
    value: string;
  } | null>(null); // Initialiser à null

  const handleChange = (option: { label: string; value: string } | null) => {
    setCurrentValue(option);

    // Émuler un objet de type "événement"
    const event = {
      target: {
        name: name,
        value: option?.value || "",
      },
    };

    if (onChange && option) {
      onChange(option.value, event); // Envoi de la nouvelle valeur et de l'"événement" simulé
    } else if (onChange) {
      onChange("", event); // Si option est null, envoyer une valeur vide
    }
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required ? <span className="text-red-500">*</span> : ""}
      </label>
      <Select
        className={`react-select w-full ${error ? "border-red-600" : ""} ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        classNamePrefix="select"
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={false}
        isSearchable={isSearchable}
        name={name}
        options={options}
        value={currentValue}
        placeholder={placeholder}
        onChange={handleChange} // Utiliser la fonction handleChange ici
        styles={{
          control: (base) => ({
            ...base,
            boxShadow: "none",
            borderColor: error ? "red" : base.borderColor,
            "&:hover": {
              borderColor: error ? "red" : base.borderColor,
            },
          }),
          indicatorSeparator: () => ({
            display: "none",
          }),
        }}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default SelectField;
