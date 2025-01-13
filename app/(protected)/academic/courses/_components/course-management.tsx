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
import SlideOverForm from "@/src/components/common/slide-over-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CourseFormFields } from "@/src/forms/course-form";
import { SubjectFormFields } from "@/src/forms/subject-form";
import { courseColumns, subjectColumns } from "@/constants/course-columns";
import { useRouter } from "next/navigation";
import { useDelete } from "@/src/hooks/use-server-action";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Course } from "@/src/types/course";
import { Subject } from "@/src/types/subject";
import { courseSchema } from "@/src/schemas/course.schema";
import { subjectSchema } from "@/src/schemas/subject.schema";
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/src/actions/course.actions";
import {
  createSubject,
  deleteSubject,
  updateSubject,
} from "@/src/actions/subject.actions";
import { Department } from "@/src/types/department";

interface CourseManagementProps extends MyPageProps {
  subjects: Subject[];
  departments: Department[];
}

const CourseManagement: React.FC<CourseManagementProps> = ({
  user,
  userPermissions = [],
  listItem,
  isLoading,
  subjects,
  departments,
}) => {
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);

  const courseForm = useForm<z.infer<typeof courseSchema>>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      credits: 0,
      semester_id: undefined,
      subject_id: undefined,
      prerequisites: [],
    },
  });

  const subjectForm = useForm<z.infer<typeof subjectSchema>>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      departmentIds: [],
    },
  });

  const router = useRouter();

  const deleteCourseMutation = useDelete<number>(deleteCourse, {
    onSuccess: () => toast.success("Cours supprimé avec succès"),
    onError: (error) => {
      toast.error(error.message);
      console.error("Erreur de suppression:", error);
    },
    invalidateQueries: ["/api/courses", "list"],
  });

  const deleteSubjectMutation = useDelete<number>(deleteSubject, {
    onSuccess: () => toast.success("Matière supprimée avec succès"),
    onError: (error) => {
      toast.error(error.message);
      console.error("Erreur de suppression:", error);
    },
    invalidateQueries: ["/api/subjects", "list"],
  });

  // Handlers
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    courseForm.reset({
      name: course.name,
      code: course.code,
      description: course.description || "",
      semester_id: course.semester_id,
      subject_id: course.subject_id,
      credits: course.credits,
      prerequisites: course.prerequisites?.map((p) => p.prerequisite_id) || [],
    });
    setIsEditCourseModalOpen(true);
  };

  const handleViewCourse = (course: Course) => {
    router.push(`/academic/courses/${course.id}`);
  };

  const handleDeleteCourse = async (course: Course) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      await deleteCourseMutation.mutate(course.id);
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    subjectForm.reset({
      name: subject.name,
      code: subject.code,
      description: subject.description || "",
    });
    setIsEditSubjectModalOpen(true);
  };

  const handleViewSubject = (subject: Subject) => {
    router.push(`/academic/subjects/${subject.id}`);
  };

  const handleDeleteSubject = async (subject: Subject) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
      await deleteSubjectMutation.mutate(subject.id);
    }
  };

  if (isLoading) return <AppPageSkeleton />;
  if (!user) return <ErrorState message="Utilisateur non trouvé" />;
  if (!userPermissions?.length) return <ErrorState message="Aucune permission trouvée" />;

  const userRole = user.role.name.toLowerCase();
  const canAccessCourses = isSuperUser(userRole) ||
    hasPermission("SYSTEM_ADMIN", userPermissions) ||
    hasPermission("COURSE_SHOW", userPermissions);

  if (!canAccessCourses) return <UnauthorizedAccess />;

  const hasPermissionFor = (action: string) =>
    isSuperUser(userRole) || hasPermission(action, userPermissions);

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
                onView={hasPermissionFor("COURSE_VIEW") ? handleViewCourse : undefined}
                onEdit={hasPermissionFor("COURSE_EDIT") ? handleEditCourse : undefined}
                onDelete={hasPermissionFor("COURSE_DELETE") ? handleDeleteCourse : undefined}
                onAdd={hasPermissionFor("COURSE_CREATE") ?
                  () => setIsAddCourseModalOpen(true) : undefined}
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
                onView={hasPermissionFor("SUBJECT_VIEW") ? handleViewSubject : undefined}
                onEdit={hasPermissionFor("SUBJECT_EDIT") ? handleEditSubject : undefined}
                onDelete={hasPermissionFor("SUBJECT_DELETE") ? handleDeleteSubject : undefined}
                onAdd={hasPermissionFor("SUBJECT_CREATE") ?
                  () => setIsAddSubjectModalOpen(true) : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SlideOverForm
        isOpen={isAddCourseModalOpen}
        onClose={() => {
          setIsAddCourseModalOpen(false);
          courseForm.reset();
        }}
        title="Créer un cours"
        defaultValues={courseForm.getValues()}
        className="overflow-auto max-h-96 grid"
        serverAction={createCourse}
        invalidQuery={["/api/courses", "list"]}
        successMessage="Cours créé avec succès"
      >
        <CourseFormFields form={courseForm} subjects={subjects} />
      </SlideOverForm>

      {selectedCourse && (
        <SlideOverForm
          isOpen={isEditCourseModalOpen}
          onClose={() => {
            setIsEditCourseModalOpen(false);
            setSelectedCourse(null);
            courseForm.reset();
          }}
          title={`Modifier le cours: ${selectedCourse.name}`}
          defaultValues={courseForm.getValues()}
          serverAction={(data) => updateCourse(selectedCourse.id, data)}
          invalidQuery={["/api/courses", "list"]}
          successMessage="Cours modifié avec succès"
        >
          <CourseFormFields form={courseForm} subjects={subjects} />
        </SlideOverForm>
      )}

      <ModalForm
        isOpen={isAddSubjectModalOpen}
        onClose={() => {
          setIsAddSubjectModalOpen(false);
          subjectForm.reset();
        }}
        title="Créer une matière"
        defaultValues={subjectForm.getValues()}
        serverAction={createSubject}
        invalidQuery={["/api/subjects", "list"]}
        successMessage="Matière créée avec succès"
      >
        <SubjectFormFields form={subjectForm} departments={departments} />
      </ModalForm>

      {selectedSubject && (
        <ModalForm
          isOpen={isEditSubjectModalOpen}
          onClose={() => {
            setIsEditSubjectModalOpen(false);
            setSelectedSubject(null);
            subjectForm.reset();
          }}
          title={`Modifier la matière: ${selectedSubject.name}`}
          defaultValues={subjectForm.getValues()}
          serverAction={(data) => updateSubject(selectedSubject.id, data)}
          invalidQuery={["/api/subjects", "list"]}
          successMessage="Matière modifiée avec succès"
        >
          <SubjectFormFields form={subjectForm} departments={departments} />
        </ModalForm>
      )}
    </div>
  );
};

export default CourseManagement;
