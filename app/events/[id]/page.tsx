"use client";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import DetailSkeleton from "@/components/loaders/DetailSkeleton";
import ErrorCard from "@/components/partials/ErrorCard";
import useFetchData from "@/hooks/useFetchData";
import { Event } from "@/types";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/events", label: "Evènement" },
  { label: "Détail évènement", isCurrent: true },
];

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useRouter();
  const {
    data: event,
    isLoading,
    error,
  } = useFetchData<Event>(`/api/events/${id}`);

  if (error) return <ErrorCard message={error.message} />;

  const handleEditEvent = () => {
    // Logique pour rediriger vers la page d'édition du cours
    navigate.push(`/events/${event?.id}/edit`);
  };

  const handleDeleteEvent = () => {
    // Logique pour supprimer le cours
    if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      // Action de suppression
      alert("Cours supprimé");
    }
  };

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />

      {isLoading ? (
        <DetailSkeleton />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Button
                className="rounded-lg shadow-md bg-indigo-500 text-white px-2 py-[0.5px] focus:bg-indigo-600 hover:bg-indigo-600"
                onClick={() => navigate.back()}
              >
                <ArrowLeft size={14} />
              </Button>
              <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
                Evènement | {event?.title}
              </h2>
            </div>
          </div>

          {/* Informations du cours */}
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{event?.title}</h2>
              <div className="flex space-x-2">
                <Button onClick={handleEditEvent} variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button onClick={handleDeleteEvent} variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>
            <p className="text-gray-700 mt-2">{event?.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {`Date ${new Date(
                event?.date || ""
              ).toLocaleDateString()}. Durée ${event?.duration || 1} jour${
                typeof event?.duration === "number"
                  ? event?.duration > 1 && "s"
                  : ""
              }`}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Lieu : <span className="font-semibold">{event?.location}</span>
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
