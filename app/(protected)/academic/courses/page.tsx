"use client";

import React from "react";
import { useUserData } from "@/context";
import { useList } from "@/src/hooks/use-fetch-data";
import ErrorState from "@/src/components/common/error-state";
import Navbar from "@/src/components/partials/navbar";
import AppPageSkeleton from "@/src/components/skeletons/app-page-skeleton";
import { Department } from "@/src/types/department";
import { Course } from "@/src/types/course";
import { Subject } from "@/src/types/subject";
import CourseManagement from "./_components/course-management";

const BREADCRUMB_ITEMS = [
  { href: "/", label: "Vue d'ensemble" },
  { href: "#", label: "Academie" },
  { label: "Cours & Matière", isCurrent: true },
];

export default function CoursesPage() {
  // Récupération des données utilisateur depuis le contexte
  const {
    user,
    permissions,
    isLoading: isLoadingUser,
    error: userError,
  } = useUserData();

  // Récupération des departments
  const {
    data: departmentsResponse,
    isLoading: isLoadingDepartments,
    error: departmentsError,
  } = useList<Department>("/api/departments");

  // Récupération des cours
  const {
    data: coursesResponse,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useList<Course>("/api/courses");

  // Récupération des matières
  const {
    data: subjectsResponse,
    isLoading: isLoadingSubjects,
    error: subjectsError,
  } = useList<Subject>("/api/subjects");

  // Gestion du chargement global
  const isLoading =
    isLoadingUser ||
    isLoadingDepartments ||
    isLoadingCourses ||
    isLoadingSubjects;

  if (isLoading) return <AppPageSkeleton />;

  // Gestion des erreurs
  const error = userError || departmentsError || coursesError || subjectsError;
  if (error) {
    return <ErrorState message={error.message || "Une erreur est survenue"} />;
  }

  // Extraction des données des réponses
  const departments = departmentsResponse?.data ?? [];
  const courses = coursesResponse?.data ?? [];
  const subjects = subjectsResponse?.data ?? [];

  // Préparation des données pour le composant CourseManagement
  const listItem = {
    courses,
    subjects,
  };

  return (
    <div>
      <Navbar breadcrumb={BREADCRUMB_ITEMS} />
      <CourseManagement
        user={user}
        userPermissions={permissions}
        listItem={listItem}
        isLoading={isLoading}
        error={error}
        subjects={subjects}
        departments={departments}
      />
    </div>
  );
}