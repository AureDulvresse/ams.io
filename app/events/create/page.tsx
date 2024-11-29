"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useServerAction from "@/hooks/useServerAction";
import { eventSchema } from "@/schemas/eventSchema";
import { Card } from "@/components/ui/card";

// Interface pour le type des données de formulaire
interface EventData {
  title: string;
  description?: string;
  date: string;
  duration?: number;
  location: string;
}

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/events", label: "Evènement" },
  { label: "Planification évènement", isCurrent: true },
];

const NewEvent = () => {
  const [formData, setFormData] = useState<EventData>({
    title: "",
    description: "",
    date: "",
    duration: 1,
    location: "",
  });

  const { executeAction, isLoading, validationErrors } =
    useServerAction("/api/events", "create", eventSchema);
  const router = useRouter();

  // Gestion du changement des champs de formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const newValue = name === "duration" ? Number(value) : value;
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isSuccess, message } = await executeAction(formData);

    // Si des erreurs existent, afficher le toast d'erreur et stopper
    if (!isSuccess) {
      toast.error(
        `${message ? message : "Oops ! Une erreur est survenue..."}`,
        {
          position: "bottom-right",
        }
      );
      return; // Stopper ici
    }

    // Si aucune erreur, afficher le succès et rediriger
    toast.success("Evènement enregistré avec succès !", {
      position: "bottom-right",
    });

    router.push("/events");
  };

  return (
    <div className="mx-auto space-y-6">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-4">Créer un nouvel événement</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titre de l'événement <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="title"
              placeholder="Titre de l'événement"
              value={formData.title}
              onChange={handleChange}
              aria-label="Titre de l'événement"
            />
            {validationErrors.title && (
              <p className="text-red-500">{validationErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Facultatif)
            </label>
            <Textarea
              name="description"
              placeholder="Description de l'événement"
              className="w-full h-18 resize-none"
              value={formData.description}
              onChange={handleChange}
              aria-label="Description de l'événement"
            />
          </div>

          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date<span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              aria-label="Date"
            />
            {validationErrors.date && (
              <p className="text-red-500">
                {validationErrors.date}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Durée de l'évènement (en jours)
            </label>
            <Input
              type="number"
              name="duration"
              className="w-full"
              placeholder="Durée de l'évènement"
              value={formData.duration}
              onChange={handleChange}
              aria-label="Durée de l'évènement"
              min={1}
            />
            {validationErrors.duration && (
              <p className="text-red-500">{validationErrors.duration}</p>
            )}
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lieu <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="location"
              placeholder="Lieu de l'événement"
              value={formData.location}
              onChange={handleChange}
              aria-label="Lieu de l'événement"
            />
            {validationErrors.location && (
              <p className="text-red-500">{validationErrors.location}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-48 bg-gradient-to-tr from-indigo-400 to-indigo-500 px-3 py-2 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-105 transition-transform"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="animate-spin text-white" size={15} />
                <span className="text-white">Traitement...</span>
              </div>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default NewEvent;
