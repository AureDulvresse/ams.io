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
import ErrorCard from "@/components/partials/ErrorCard";
import DetailSkeleton from "@/components/loaders/DetailSkeleton";
import useFetchData from "@/hooks/useFetchData";
import { LevelStudy } from "@/types";


const breadcrumbItems = [
  { href: "/", label: "Accueil" },
    { href: "/level-study", label: "Niveaux d'étude" },
  { label: "Détail niveau d'étude", isCurrent: true },
];

const levelStudyDetailPage = () => {
  const {id} = useParams();
  const navigate = useRouter();
  const {
    data: levelStudy,
    isLoading,
    error,
  } = useFetchData<LevelStudy>(`/api/level-study/${id}`);

  if (error) return <ErrorCard message={error.message} />;

  const handleEditlevelStudy = () => {
    // Logique pour rediriger vers la page d'édition du cours
    navigate.push(`/level-study/${levelStudy?.id}/edit`);
  };

  const handleDeletelevelStudy = () => {
    // Logique pour supprimer le cours
    if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      // Action de suppression
      alert("Cours supprimé");
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <DynamicBreadcrumb items={breadcrumbItems} />

      {isLoading ? <DetailSkeleton /> : (
        <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Button className="rounded-lg shadow-md bg-indigo-500 text-white px-2 py-[0.5px] focus:bg-indigo-600 hover:bg-indigo-600" onClick={() => navigate.back()}>
            <ArrowLeft size={14} />
          </Button>
          <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
            Niveau d'étude | {levelStudy?.designation}
          </h2>
        </div>
      </div>

      {/* Informations du cours */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{levelStudy?.designation}</h2>
          <div className="flex space-x-2">
            <Button onClick={handleEditlevelStudy} variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button onClick={handleDeletelevelStudy} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
        <p className="text-gray-700 mt-2">{levelStudy?.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          {`Enregistré le : ${new Date(levelStudy?.created_at || "").toLocaleDateString()} à ${new Date(levelStudy?.created_at || "").toLocaleTimeString()}`}
        </p>
      </Card>

      {/* Table des cours du deépartement */}
      {/* <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Salles de cours</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levelStudy?.courses?.length?? 0 > 0 ? (
              levelStudy?.courses?.map((course, index) => (
                <TableRow key={course.id}>
                  <TableCell>{++index}</TableCell>
                  <TableCell>{course?.name}</TableCell>
                  <TableCell>{course?.description}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">...</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate.push(`/courses/${course?.id}`)
                          }
                        >
                          Détail du cours
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            alert(`Retirer ${course.name} du cours`)
                          }
                          className="text-red-500"
                        >
                          Retirer du cours
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Aucun cours dispensé dans ce département.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card> */}
      </div>
    )}
    </div>
   
  );
};

export default levelStudyDetailPage;
