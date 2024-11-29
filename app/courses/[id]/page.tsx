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
import { Course } from "@/types";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/courses", label: "Gestion des cours" },
  { label: "Détail cours", isCurrent: true },
];

const CourseDetailPage = () => {
  const searchParams = useParams();
  const courseId = searchParams["id"];
  const navigate = useRouter();
  const {
    data: course,
    isLoading,
    error,
  } = useFetchData<Course>(`/api/courses/${courseId}`);

  if (error) return <ErrorCard message={error.message} />;

  const handleEditCourse = () => {
    // Logique pour rediriger vers la page d'édition du cours
    navigate.push(`/courses/edit/${course?.id}`);
  };

  const handleDeleteCourse = () => {
    // Logique pour supprimer le cours
    if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      // Action de suppression
      alert("Cours supprimé");
    }
  };

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />

       {isLoading ? <DetailSkeleton /> : (
        <div>
      <div className="flex justify-between items-center mb-3">
         <div className="flex items-center gap-2">
          <Button className="rounded-lg shadow-md bg-indigo-500 text-white px-2 py-[0.5px] focus:bg-indigo-600 hover:bg-indigo-600" onClick={() => navigate.back()}>
              <ArrowLeft size={14} />
            </Button>
            <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
              Gestion des cours | {course?.name}
            </h2>
          </div>
      </div>

      {/* Informations du cours */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{course?.name}</h2>
          <div className="flex space-x-2">
            <Button onClick={handleEditCourse} variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button onClick={handleDeleteCourse} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
        <p className="text-gray-700 mt-2">{course?.description}</p>
        <p className="text-gray-700 mt-2">Nombre de crédits : {course?.credits}</p>
         <p className="text-gray-700 mt-2">Département : {course?.department.name}</p>
        {/* <p className="text-sm text-gray-500 mt-2">
          Instructeur : {course.instructor}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Dates : {course.startDate} - {course.endDate}
        </p> */}
      </Card>

      {/* Table des étudiants inscrits */}
      {/* {/* <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Étudiants inscrits</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {course.students.length > 0 ? (
              course.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">...</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            alert(`Afficher le profil de ${student.name}`)
                          }
                        >
                          Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            alert(`Retirer ${student.name} du cours`)
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
                  Aucun étudiant inscrit pour ce cours.
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

export default CourseDetailPage;
