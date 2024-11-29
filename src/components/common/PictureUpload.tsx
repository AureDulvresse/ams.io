import React, { useState } from "react";
import { Input } from "../ui/input";
import { UploadIcon, ImageIcon } from "lucide-react"; // Utilisation d'icônes

interface PhotoUploadProps {
  label?: string;
  onUpload: (file: File) => void;
  error?: string;
}

const PictureUpload: React.FC<PhotoUploadProps> = ({
  label,
  onUpload,
  error,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      onUpload(file); // Appel du callback pour transmettre le fichier uploadé
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label || "Télécharger une photo"}
      </label>

      <div className="relative">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          name="picture"
          id="file-input"
        />

        <label
          htmlFor="file-input"
          className="flex justify-center items-center cursor-pointer py-2 px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <UploadIcon className="mr-2" size={20} />
          Sélectionner une photo
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {preview ? (
        <div className="mt-4 flex justify-center items-center">
          <img
            src={preview}
            alt="Prévisualisation"
            className="w-40 h-40 object-cover rounded-md border border-gray-300 shadow-md dark:border-gray-600"
          />
        </div>
      ) : (
        <div className="mt-4 flex flex-col justify-center items-center p-4 border border-dashed border-gray-300 rounded-md dark:border-gray-600">
          <ImageIcon className="text-gray-400" size={40} />
          <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
            Aucune photo sélectionnée
          </p>
        </div>
      )}
    </div>
  );
};

export default PictureUpload;
