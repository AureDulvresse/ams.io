"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IdCardIcon,
  Pencil,
  PrinterIcon,
  User2,
} from "lucide-react";
import jsPDF from "jspdf";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import StudentSkeleton from "@/components/loaders/StudentSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/components/common/Modal";
import TutorForm from "@/components/forms/TutorForm";
import { Student, StudentTutor } from "@/types";
import { toast } from "react-toastify";
import useFetchData from "@/hooks/useFetchData";
import ErrorCard from "@/components/partials/ErrorCard";
import useServerAction from "@/hooks/useServerAction";


const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/students", label: "Gestion Étudiant" },
  { label: "Information Étudiant", isCurrent: true },
];

const StudentDetailPage: React.FC = () => {
  const navigate = useRouter();
  const { uuid } = useParams();
  const { data: student, isLoading: isLoadStudent, error } = useFetchData<Student>(`/api/students/${uuid}`);
  const { data: tutor, isLoading: isLoadParent, mutate } = useFetchData<StudentTutor>(`/api/parents/${student?.id}`);
  const [isTutorFormOpen, setIsTutorFormOpen] = useState(false);
  const { executeAction, isLoading: isLoadUpdatedParent } = useServerAction(`/api/parents/${uuid}`, "update");

  if (isLoadStudent || isLoadParent) return <StudentSkeleton />;
  if (error) return <ErrorCard message={error.message} />;
  if (!student) return <div>Aucun étudiant trouvé.</div>;

  const toggleTutorForm = () => {
    setIsTutorFormOpen((prev) => !prev);
  };

   const handleEditStudent = () => {
    // Logique pour rediriger vers la page d'édition du cours
    navigate.push(`/students/${student?.id}/edit`);
  };

  const handleDownloadIdentity = () => {
    const doc = new jsPDF();

      // Préparer le titre et la date
      doc.setFontSize(18);
      doc.text(`Fiche identité - ${student.first_name} ${student.last_name}`, 14, 22);
      doc.setFontSize(12);
      doc.text(`Date : ${new Date().toLocaleDateString()}`, 170, 22, { align: "right" });


      doc.setFontSize(14);
      doc.text(`Nom(s) et Prénom(s) : ${student.last_name} ${student.first_name}`, 14, 34);

      const pageHeight = doc.internal.pageSize.height; // Hauteur de la page
      const footerText = "© 2024 ams.io - Powered by ams.io";

      doc.setFontSize(10);
      const textWidth = doc.getTextWidth(footerText); // Largeur du texte du footer
      const pageWidth = doc.internal.pageSize.width; // Largeur de la page
      const xPosition = (pageWidth - textWidth) / 2; // Calculer la position x pour centrer le texte

      doc.text(footerText, xPosition, pageHeight - 10); // Positionner le footer centré à 10 unités du bas de la page

      // Enregistrer le PDF
      doc.save(`Fiche identité - ${student.first_name} ${student.last_name}.pdf`);
  }

  const handleSubmit = async (data: any) => {
    const { isSuccess, message } = await executeAction(data);
    if (!isSuccess) {
      toast.error(message || "Oops ! Une erreur est survenue...", { position: "bottom-right" });
      return;
    }
    toast.success("Information tuteur mise à jour avec succès !", { position: "bottom-right" });
    setIsTutorFormOpen(false);
    mutate();
  };

  return (
    <div className="mx-auto space-y-8">
      <DynamicBreadcrumb items={breadcrumbItems} />

      {/* Carte Principale Étudiant */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <img
              src={
                student.picture ||
                "https://randomuser.me/api/portraits/men/1.jpg"
              }
              alt={`${student.first_name} ${student.last_name}`}
              className="w-28 h-28 rounded-md object-cover shadow-md border-2 border-indigo-600"
            />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">
                {student.first_name} {student.last_name}
              </h1>
              <div>
                <p className="text-gray-500">
                  <strong>Sexe :</strong>{" "}
                  {student.gender === "M" ? "Masculin" : "Féminin"}
                </p>
                <p className="text-gray-500">
                  <strong>Niveau d'étude :</strong>{" "}
                  {student.levelStudy?.designation || "Non spécifié"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleEditStudent}>Modifier</Button>
            <Button
              variant="outline"
              className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:text-white"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-8">
        {/* Section Informations Personnelles */}
        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="flex items-center font-semibold text-indigo-600 mb-4">
            <User2 className="mr-2" /> Informations Personnelles
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="border-b border-gray-300 py-2">
              <strong>Date de naissance : </strong>
              {student.dob
                ? new Date(student.dob).toLocaleDateString()
                : "Non spécifié"}
            </li>
            <li className="border-b border-gray-300 py-2">
              <strong>Lieu de naissance : </strong>
              {student.pob || "Non spécifié"}
            </li>
            <li className="border-b border-gray-300 py-2">
              <strong>Adresse : </strong>
              {student.address || "Non spécifié"}
            </li>
            <li className="border-b border-gray-300 py-2">
              <strong>Téléphone : </strong>
              {student.phone || "Non spécifié"}
            </li>
            <li>
              <strong>Email : </strong>
              {student.email || "Non spécifié"}
            </li>
          </ul>
        </Card>

        {/* Section Informations Tuteur */}
        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center font-semibold text-indigo-600">
              <IdCardIcon className="mr-2" /> Tuteur
            </h2>
            <Button
              onClick={toggleTutorForm}
              className="bg-indigo-600 text-white text-sm hover:bg-indigo-700 gap-2"
            >
              <Pencil size={12} />
              Modifier le Tuteur
            </Button>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="border-b border-gray-300 py-2">
              <strong>Nom : </strong>
              {tutor?.name || "Non spécifié"}
            </li>
            <li className="border-b border-gray-300 py-2">
              <strong>Téléphone : </strong>
              {tutor?.phone || "Non spécifié"}
            </li>
            <li className="py-2">
              <strong>Email : </strong>
              {tutor?.email || "Non spécifié"}
            </li>
          </ul>
        </Card>

        {/* Section Progression Académique */}
        {/* <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
           <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-indigo-600">
            Progression Académique
          </h2>
           <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            Voir résultats
          </Button>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="border-b border-gray-300 py-2">
              <strong>Moyenne Générale : </strong>
              {student.generalAverage || "Non spécifié"}
            </li>
            <li className="border-b border-gray-300 py-2">
              <strong>Statut : </strong>
              {student.status || "Non spécifié"}
            </li>
            <li className="border-b border-gray-300 py-2">
              <strong>Matières suivies : </strong>
              {student.subjects?.join(", ") || "Non spécifié"}
            </li>
            <li className="py-2">
              <strong>Dernier Résultat : </strong>
              {student.lastResult || "Non spécifié"}
            </li>
          </ul>
         
        </Card> */}

        {/* Section Historique des Présences */}
        {/* <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="font-semibold text-indigo-600 mb-4">
            Historique des Présences
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="border-b border-gray-300 py-2">
              <strong>Nombre d'absences : </strong> {student.absences || 0}
            </li>
            <li className="border-b border-gray-300 py-2">
              <strong>Nombre de retards : </strong> {student.delays || 0}
            </li>
            <li className="py-2">
              <strong>Date de dernière absence : </strong>{" "}
              {student.lastAbsence
                ? new Date(student.lastAbsence).toLocaleDateString()
                : "Non spécifié"}
            </li>
          </ul>
        </Card> */}

        {/* Section Informations Financières */}
        {/* <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
               <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-indigo-600">
            Informations Financières
          </h2>
           <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            Ajouter un Paiement
          </Button>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="border-b border-gray-300 py-2">
              <strong>Solde à payer : </strong>{" "}
              {student.balance || "Non spécifié"} €
            </li>
            <li className="border-b border-gray-300 py-2">
              <strong>Dernier paiement : </strong>{" "}
              {student.lastPayment || "Non spécifié"}
            </li>
            <li className="py-2">
              <strong>Mode de paiement : </strong>{" "}
              {student.paymentMethod || "Non spécifié"}
            </li>
          </ul>
         
        </Card> */}

        {/* Section Documents */}
        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <h2 className="font-semibold text-indigo-600 mb-4 flex items-center gap-2">
            <PrinterIcon size={18} /> Documents
          </h2>
          <ul className="space-y-2">
             <li className="border-b border-gray-300 py-2">
              <Button
              variant="ghost"
                className="text-indigo-600 hover:underline"
                onClick={handleDownloadIdentity}
              >
                Fiche identité
              </Button>
            </li>
            <li className="border-b border-gray-300 py-2">
              <a
                href="/path-to-certificat"
                className="text-indigo-600 hover:underline"
              >
                Certificat de Scolarité
              </a>
            </li>
            <li className="border-b border-gray-300 py-2">
              <a
                href="/path-to-bulletin"
                className="text-indigo-600 hover:underline"
              >
                Bulletin de Notes
              </a>
            </li>
            <li className="py-2">
              <a
                href="/path-to-student-card"
                className="text-indigo-600 hover:underline"
              >
                Carte Étudiante
              </a>
            </li>
          </ul>
        </Card>
      </div>

      {/* Modal de modification du tuteur */}
      {isTutorFormOpen && (
        <Modal
          isOpen={isTutorFormOpen}
          onClose={toggleTutorForm}
          title="Modifier le Tuteur"
          content={
            <TutorForm
              initialData={{
                name: tutor?.name || "",
                phone: tutor?.phone || "",
                email: tutor?.email || "",
                created_at: tutor?.created_at || "",
                updated_at: tutor?.updated_at || "",
              }}
              isSubmitting={isLoadUpdatedParent}
              onSubmit={handleSubmit}
            />
          }
          footer={
            <p className="text-xs text-gray-400">
              Assurez-vous de remplir tous les champs.
            </p>
          }
        />
      )}
    </div>
  );
};

export default StudentDetailPage;
