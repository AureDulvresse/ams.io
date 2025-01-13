"use client";

import React, { useState } from "react";
import { hasPermission } from "@/src/data/permission";
import UnauthorizedAccess from "@/src/components/common/unauthorized-access";
import { MyPageProps } from "@/src/types/custom-props";
import ErrorState from "@/src/components/common/error-state";
import { Card, CardContent } from "@/src/components/ui/card";
import { DataTable } from "@/src/components/common/data-table";
import { isSuperUser } from "@/src/data/user";
import AppPageSkeleton from "@/src/components/skeletons/app-page-skeleton";
import ModalForm from "@/src/components/common/modal-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CourseFormFields } from "@/src/forms/course-form";
import { courseColumns, subjectColumns } from "@/constants/course-columns";
import {
  createCourse,
  deleteCourse,
  updateCourse,
  createSubject,
  deleteSubject,
  updateSubject
} from "@/src/actions/course.actions";
import { useRouter } from "next/navigation";
import { useDelete } from "@/src/hooks/use-server-action";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Course, Subject } from "@/src/types/course";
import { courseSchema, subjectSchema } from "@/src/schemas/course.schema";
import { SubjectFormFields } from "@/src/forms/subject-form";
import SlideOverForm from "@/src/components/common/slide-over-form";

const CourseManagement = ({
  user,
  userPermissions,
  listItem,
  isLoading,
}: MyPageProps) => {
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const courseForm = useForm<z.infer<typeof courseSchema>>();
  const subjectForm = useForm<z.infer<typeof subjectSchema>>();
  const router = useRouter();

  // Mutations pour les cours
  const deleteCourseMutation = useDelete<number>(deleteCourse, {
    onSuccess: () => {
      toast.success("Cours supprimé avec succès");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Erreur de suppression:", error);
    },
    invalidateQueries: ["/api/courses", "list"],
  });

  // Mutations pour les matières
  const deleteSubjectMutation = useDelete<number>(deleteSubject, {
    onSuccess: () => {
      toast.success("Matière supprimée avec succès");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Erreur de suppression:", error);
    },
    invalidateQueries: ["/api/subjects", "list"],
  });

  // Gestionnaires CRUD pour les cours
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditCourseModalOpen(true);
  };

  const handleViewCourse = (course: Course) => {
    router.push(`/academic/courses/${course.id}`);
  };

  const handleDeleteCourse = (course: Course) => {
    deleteCourseMutation.mutate(course.id);
  };

  // Gestionnaires CRUD pour les matières
  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsEditSubjectModalOpen(true);
  };

  const handleViewSubject = (subject: Subject) => {
    router.push(`/academic/subjects/${subject.id}`);
  };

  const handleDeleteSubject = (subject: Subject) => {
    deleteSubjectMutation.mutate(subject.id);
  };

  if (isLoading) return <AppPageSkeleton />;

  if (!user) return <ErrorState message="Utilisateur non trouvé" />;
  if (!userPermissions?.length)
    return <ErrorState message="Aucune permission trouvée" />;

  const userRole = user.role.name.toLowerCase();

  // Contrôle d'accès
  const canAccessCourses =
    isSuperUser(userRole) ||
    hasPermission("SYSTEM_ADMIN", userPermissions || []) ||
    hasPermission("COURSE_SHOW", userPermissions || []);

  if (!canAccessCourses && !isLoading) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-oswald text-primary">
            Gestion des Cours et Matières
          </h1>
          <p className="text-muted-foreground">
            Gérez les cours et matières de votre établissement
          </p>
        </div>
      </div>

      <Tabs defaultValue="subjects" className="w-full">
        <TabsList>
          <TabsTrigger value="subjects">Matières</TabsTrigger>
          <TabsTrigger value="courses">Cours</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={courseColumns}
                data={listItem?.courses || []}
                loading={isLoading}
                onView={
                  isSuperUser(userRole) ||
                    hasPermission("COURSE_VIEW", userPermissions || [])
                    ? handleViewCourse
                    : undefined
                }
                onEdit={
                  isSuperUser(userRole) ||
                    hasPermission("COURSE_EDIT", userPermissions || [])
                    ? handleEditCourse
                    : undefined
                }
                onDelete={
                  isSuperUser(userRole) ||
                    hasPermission("COURSE_DELETE", userPermissions || [])
                    ? handleDeleteCourse
                    : undefined
                }
                onAdd={
                  isSuperUser(userRole) ||
                    hasPermission("COURSE_CREATE", userPermissions || [])
                    ? () => setIsAddCourseModalOpen(true)
                    : undefined
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={subjectColumns}
                data={listItem?.subjects || []}
                loading={isLoading}
                onView={
                  isSuperUser(userRole) ||
                    hasPermission("SUBJECT_VIEW", userPermissions || [])
                    ? handleViewSubject
                    : undefined
                }
                onEdit={
                  isSuperUser(userRole) ||
                    hasPermission("SUBJECT_EDIT", userPermissions || [])
                    ? handleEditSubject
                    : undefined
                }
                onDelete={
                  isSuperUser(userRole) ||
                    hasPermission("SUBJECT_DELETE", userPermissions || [])
                    ? handleDeleteSubject
                    : undefined
                }
                onAdd={
                  isSuperUser(userRole) ||
                    hasPermission("SUBJECT_CREATE", userPermissions || [])
                    ? () => setIsAddSubjectModalOpen(true)
                    : undefined
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal d'ajout de cours */}
      <SlideOverForm
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        title="Créer un cours"
        defaultValues={{
          name: "",
          code: "",
          department_id: undefined,
          description: "",
          credits: 0,
          prerequisites: [],

        }}
        className="overflow-auto max-h-96 grid"
        serverAction={createCourse}
        invalidQuery={["/api/courses", "list"]}
        successMessage="Cours créé avec succès"
      >
        <CourseFormFields form={courseForm} subjects={[]} />
      </SlideOverForm>

      {/* Modal d'édition de cours */}
      {selectedCourse && (
        <SlideOverForm
          isOpen={isEditCourseModalOpen}
          onClose={() => {
            setIsEditCourseModalOpen(false);
            setSelectedCourse(null);
          }}
          title={`Modifier le cours: ${selectedCourse.name}`}
          defaultValues={{
            name: selectedCourse.name,
            code: selectedCourse.code,
            department_id: selectedCourse.department_id,
            description: selectedCourse.description || "",
            credits: selectedCourse.credits,
            prerequisites: selectedCourse.prerequisites ? selectedCourse.prerequisites.map((p) => p.prerequisite_id)
              : []
          }}
          serverAction={(data) => updateCourse(selectedCourse.id, data)}
          invalidQuery={["/api/courses", "list"]}
          successMessage="Cours modifié avec succès"
        >
          <CourseFormFields form={courseForm} subjects={[]} />
        </SlideOverForm>
      )}

      {/* Modales pour les matières - similaires aux modales de cours */}
      <ModalForm
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        title="Créer une matière"
        defaultValues={{
          name: "",
          code: "",
          description: "",
        }}
        serverAction={createSubject}
        invalidQuery={["/api/subjects", "list"]}
        successMessage="Matière créée avec succès"
      >
        <SubjectFormFields form={subjectForm} />
      </ModalForm>

      {selectedSubject && (
        <ModalForm
          isOpen={isEditSubjectModalOpen}
          onClose={() => {
            setIsEditSubjectModalOpen(false);
            setSelectedSubject(null);
          }}
          title={`Modifier la matière: ${selectedSubject.name}`}
          defaultValues={{
            name: selectedSubject.name,
            code: selectedSubject.code,
            description: selectedSubject.description || "",
            course_id: selectedSubject.course_id,
          }}
          serverAction={(data) => updateSubject(selectedSubject.id, data)}
          invalidQuery={["/api/subjects", "list"]}
          successMessage="Matière modifiée avec succès"
        >
          <SubjectFormFields form={subjectForm} />
        </ModalForm>
      )}
    </div>
  );
};

export default CourseManagement;