import React, { useState } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

export type MultiSelectProps = {
  options: { label: string; value: number }[]; // Liste des options
  value: number[]; // Valeurs sélectionnées
  onChange: (value: number[]) => void; // Callback lorsque la sélection change
  placeholder?: string; // Texte indicatif lorsqu'aucune valeur n'est sélectionnée
};

export const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder,
}: MultiSelectProps) => {
  const [searchTerm, setSearchTerm] = useState(""); // État pour le terme de recherche

  const handleToggle = (optionValue: number) => {
    if (value.includes(optionValue)) {
      // Supprime l'option si elle est déjà sélectionnée
      onChange(value.filter((v) => v !== optionValue));
    } else {
      // Ajoute l'option si elle n'est pas encore sélectionnée
      onChange([...value, optionValue]);
    }
  };

  // Filtre les options en fonction du terme de recherche
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border p-2 rounded-md relative">
      {/* Champ de recherche */}
      <div className="w-full absolute top-0 left-0 p-2 flex items-center justify-center">
        <Input
          type="text"
          className="w-full p-1 border rounded-md"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

        <div className="mt-12 space-y-2 overflow-y-auto h-40 max-h-40">
        {/* Placeholder ou message d'indication */}
        {value.length === 0 && placeholder && (
          <p className="text-muted-foreground">{placeholder}</p>
        )}

        {/* Liste des options filtrées */}
        {filteredOptions.length === 0 && searchTerm && (
          <div className="text-gray-500">
            Aucune option ne correspond à votre recherche.
          </div>
        )}

        {filteredOptions.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-2 rounded-lg"
          >
            <Checkbox
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
            />
            <label>{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};
