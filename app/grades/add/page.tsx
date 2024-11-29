"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import SelectField from "@/components/common/SelectField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ErrorCard from "@/components/partials/ErrorCard";
import useServerAction from "@/hooks/useServerAction";
import useFetchData from "@/hooks/useFetchData";
import { Course, LevelStudy, Student } from "@/types";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Interface pour les données de formulaire
interface GradeData {
  year: string;
  semester: string;
  level_id: number;
  student_id: number;
  course_id: number;
  grade: number;
  observation?: string;
}

// Interface pour la note prévisualisée
interface PreviewGrade extends GradeData {
  student_name: string;
  course_name: string;
}

// Eléments du fil d'Ariane
const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { href: "/grades", label: "Administration des Notes" },
  { label: "Affecter une note", isCurrent: true },
];

const AddGrade = () => {
  const navigate = useRouter();
  const currentYear = new Date().getFullYear().toString();
  const [formData, setFormData] = useState<GradeData>({
    year: currentYear,
    semester: "",
    level_id: 0,
    student_id: 0,
    course_id: 0,
    grade: 0,
    observation: "",
  });

  const [studentOptions, setStudentOptions] = useState<{ label: string; value: string }[]>([])
  const [previewGrades, setPreviewGrades] = useState<PreviewGrade[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Fetching levels, students, and courses
  const {
    data: levelsStudy,
    isLoading: loadLevelStudy,
    error: errorLoadLevelStudy,
  } = useFetchData<LevelStudy[]>("/api/level-study");
  const {
    data: students,
    isLoading: loadStudents,
    error: errorLoadStudents,
    mutate,
  } = useFetchData<Student[]>("/api/students/");

  const {
    data: courses,
    isLoading: loadCourses,
    error: errorLoadCourse,
  } = useFetchData<Course[]>("/api/courses");

  // Options for selection fields
  const levelStudyOptions = levelsStudy
    ? levelsStudy.map((d) => ({ label: d.designation, value: d.id.toString() }))
    : [];

  const coursesOptions = courses
    ? courses.map((d) => ({ label: d.name, value: d.id.toString() }))
    : [];

    useEffect(()=> {
      setStudentOptions(students
        ? students.map((s) => ({ label: `${s.first_name} ${s.last_name}`, value: s.id.toString() }))
        : []);
    }, [students]);

  // Hook for handling form submission
  const { executeAction, isLoading } = useServerAction(
    "/api/grades",
    "create",
  );

  // Handling form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handling SelectField change
  const handleSelectChange = (field: keyof GradeData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: parseInt(value, 10) }));
    if (field === "level_id") {
      mutate()
      const filteredStudents = students?.filter(
        (student) => student.levelStudy_id === parseInt(value, 10)
      ).map((s) => ({ label: `${s.first_name} ${s.last_name}`, value: s.id.toString() }));

      setStudentOptions(filteredStudents || []);

      console.log(studentOptions);
      console.log(filteredStudents)
    }
  };

  // Handle adding note to preview list
  const handlePreview = () => {
    const selectedStudent = students?.find((s) => s.id === formData.student_id);
    const selectedCourse = courses?.find((c) => c.id === formData.course_id);

    // Vérifier si la note existe déjà dans le tableau de prévisualisation
    const isAlreadyInPreview = previewGrades.some(
      (grade) =>
        grade.student_id === formData.student_id &&
        grade.course_id === formData.course_id
    );

    if (isAlreadyInPreview) {
      toast.error("L'étudiant a déjà une note pour ce cours.", {
        position: "bottom-right",
      });
      return;
    }

    if (selectedStudent && selectedCourse) {
      setPreviewGrades((prevGrades) => [
        ...prevGrades,
        {
          ...formData,
          student_name: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
          course_name: selectedCourse.name,
        },
      ]);
      setFormData({ ...formData, grade: 0, observation: "" });
      setIsPreviewing(true);
    }
  };

  // Fonction pour télécharger le PDF de la prévisualisation
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Liste des notes provisoires", 14, 20); // Ajout du titre
    doc.autoTable({
      head: [["Etudiant(e)", "Cours", "Note", "Observation"]],
      body: previewGrades.map((grade) => [
        grade.student_name,
        grade.course_name,
        grade.grade,
        grade.observation || "-",
      ]),
    });
    doc.save("notes_provisoires.pdf");
  };

  // Handle submission of all notes
  const handleSubmit = async () => {
    if (previewGrades.length === 0) {
      toast.error("Veuillez ajouter au moins une note avant de soumettre.", {
        position: "bottom-right",
      });
      return;
    }



    // Préparer les données au format JSON
    const dataToSubmit = previewGrades.map((grade) => ({
      academic_year: grade.year,
      semester: grade.semester,
      student_id: grade.student_id,
      course_id: grade.course_id,
      grade: grade.grade,
      observation: grade.observation || "", // Valeur par défaut si non définie
    }));

    try {
      const { isSuccess, message } = await executeAction(dataToSubmit);

      if (!isSuccess) {
        toast.error(message || "Oops! Une erreur est survenue...", {
          position: "bottom-right",
        });
        return;
      }

      toast.success("Notes enregistrées avec succès !", {
        position: "bottom-right",
      });

      navigate.push("/grades");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi des données.", {
        position: "bottom-right",
      });
      console.error("Erreur soumission des notes:", error);
    }
  };


  if (errorLoadLevelStudy || errorLoadCourse || errorLoadStudents) {
    const error = errorLoadLevelStudy || errorLoadCourse || errorLoadStudents || { message: "" };
    return <ErrorCard message={error.message} />;
  }

  return (
    <div className="mx-auto space-y-6">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-4">Enregistrement des Notes</h2>
        {/* Formulaire */}
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Année académique */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Année académique
              </label>
              <Input
                name="year"
                className="w-full"
                value={formData.year}
                readOnly
              />
            </div>
            {/* Semestre */}
            <div>
              <SelectField
                label="Semestre"
                name="semester"
                placeholder="Choisissez un semestre"
                options={[
                  { label: "Semestre 1", value: "1" },
                  { label: "Semestre 2", value: "2" },
                  { label: "Semestre 3", value: "3" },
                  { label: "Semestre 4", value: "4" },
                  { label: "Semestre 5", value: "5" },
                  { label: "Semestre 6", value: "6" },
                ]}
                onChange={(value) => handleSelectChange("semester", value)}
                required={true}
              />
            </div>
          </div>

          {/* Niveau d'étude */}
          <SelectField
            label="Niveau d'étude"
            name="level_id"
            placeholder="Choisissez un niveau d'étude"
            isLoading={loadLevelStudy}
            options={levelStudyOptions}
            onChange={(value) => handleSelectChange("level_id", value)}
            required={true}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Etudiant */}
            <SelectField
              label="Etudiant(e)"
              name="student_id"
              placeholder="Choisissez l'étudiant(e)"
              isLoading={loadStudents}
              options={studentOptions}
              onChange={(value) => handleSelectChange("student_id", value)}
              required={true}
            />
            {/* Cours */}
            <SelectField
              label="Cours / Matière"
              name="course_id"
              placeholder="Choisissez un cours/une matière"
              isLoading={loadCourses}
              options={coursesOptions}
              onChange={(value) => handleSelectChange("course_id", value)}
              required={true}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Note obtenue
            </label>
            <Input
              type="number"
              name="grade"
              className="w-full"
              placeholder="Note obtenue"
              value={formData.grade}
              onChange={handleChange}
              min={0}
              max={20} // Limite maximum pour une note typique
            />
          </div>

          {/* Observation */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Observation (Facultatif)
            </label>
            <Textarea
              name="observation"
              className="w-full resize-none"
              placeholder="Ajoutez des commentaires sur la note"
              value={formData.observation}
              onChange={handleChange}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={handlePreview}
              disabled={isLoading}
            >
              Ajouter la note
            </Button>
          </div>
        </form>

        {/* Tableau de prévisualisation */}
        {isPreviewing && (
          <div className="mt-8">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Prévisualisation des Notes</h3>
              <Button variant="secondary" onClick={handleDownloadPdf}>
                Télécharger PDF
              </Button>
            </div>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Etudiant(e)</th>
                  <th className="border p-2">Cours</th>
                  <th className="border p-2">Note</th>
                  <th className="border p-2">Observation</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {previewGrades.map((grade, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="border p-2">{grade.student_name}</td>
                    <td className="border p-2">{grade.course_name}</td>
                    <td className="border p-2">{grade.grade}</td>
                    <td className="border p-2">{grade.observation || "-"}</td>
                    <td className="border p-2 flex items-center justify-center">
                      <Button
                        variant="outline"
                        className="text-red-500 flex items-center"
                        onClick={() => {
                          setPreviewGrades(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Retirer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Bouton de soumission */}
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className="w-48 bg-gradient-to-tr from-indigo-400 to-indigo-500 px-3 py-2 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-105 transition-transform"
                disabled={isLoading}
                onClick={handleSubmit}
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
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AddGrade;
