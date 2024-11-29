"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import DataTable from "@/components/common/DataTable";
import SelectField from "@/components/common/SelectField";
import ErrorCard from "@/components/partials/ErrorCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useFetchData from "@/hooks/useFetchData";
import { Course, Grade, LevelStudy } from "@/types";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Administration des Notes", isCurrent: true },
];

const columns = [
  {
    header: "Nom de l'étudiant",
    accessorKey: "name",
    cell: ({ row }: { row: { original: Grade } }) => (
      <span>
        {row.original.student?.last_name} {" "} 
        {row.original.student?.first_name}
      </span>
    ),
  },
  {
    header: "Matière",
    accessorKey: "subject",
    cell: ({ row }: { row: { original: Grade } }) => (
      <span>{row.original.course?.name}</span>
    ),
  },
  {
    accessorKey: "classe",
    header: "Niveau d'étude",
    cell: ({ row }: { row: { original: Grade } }) => (
      <span>{row.original.student?.levelStudy?.designation }</span>
    ),
  },
  { header: "Note", accessorKey: "grade" },
];

const filters = ["name", "subject", "classe"];

const GradeAdministration = () => {
  const navigate = useRouter();
 const {
    data: studentGrades,
    isLoading,
    error,
  } = useFetchData<Grade[]>("/api/grades");

  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
 
  const {
    data: levelsStudy,
    isLoading: loadLevelStudy,
    error: errorLoadLevelStudy,
  } = useFetchData<LevelStudy[]>("/api/level-study");

  const { 
    data: courses,
    isLoading: loadCourses,
    error: errorLoadCourse,
  } = useFetchData<Course[]>("/api/courses");

  const levelStudyOptions = [
    { label: "Tout", value: "" },
    ...(levelsStudy
      ? levelsStudy.map((d) => ({
          label: d.designation,
          value: d.id.toString(),
        }))
      : []),
  ];

  const coursesOptions = [
    { label: "Tout", value: "" },
    ...(courses
      ? courses.map((d) => ({ label: d.name, value: d.id.toString() }))
      : []),
  ];

  // Fonction de filtrage
  const filteredData = useMemo(() => {
    return studentGrades?.filter((student) => {
      // Filtrage par classe
      const matchesClass = selectedClass
        ? levelsStudy?.some(
            (lvl) =>
              lvl.id.toString() === selectedClass &&
              lvl.designation === student.student?.levelStudy?.designation
          )
        : true;

      // Filtrage par matière
      const matchesSubject = selectedSubject
        ? courses?.some(
            (course) =>
              course.id.toString() === selectedSubject &&
              course.name === student.course?.name
          )
        : true;

      return matchesClass && matchesSubject;
    });
  }, [selectedClass, selectedSubject, levelsStudy, courses, studentGrades]);

  // Calcul de la moyenne générale
  const averageGrade = useMemo(() => {
    if (filteredData?.length === 0) return null;
    const totalGrades = filteredData?.reduce(
      (sum, student) => sum + student.grade,
      0
    );

    if (
      typeof totalGrades === "undefined" ||
      typeof filteredData?.length === "undefined"
    )
      return null;

    return (totalGrades / filteredData.length).toFixed(2);
  }, [filteredData]);

  const handleLevelStudyChange = (value: string) => {
    setSelectedClass(value || null);
  };

  const handleCourseChange = (value: string) => {
    setSelectedSubject(value || null);
  };

  if (errorLoadLevelStudy || errorLoadCourse) {
    const error = errorLoadLevelStudy || errorLoadCourse || { message: "" };
    return <ErrorCard message={error.message} />;
  }

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Administration des notes
        </h2>
        <Button
          className="font-inter flex items-center gap-1 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
          onClick={() => navigate.push("/grades/add")}
        >
          <Plus className="font-semibold" size={12} />
          Affecter une note
        </Button>
      </div>

      <Card className="p-4 bg-white dark:bg-gray-900 rounded-lg w-full flex items-center justify-between">
        <div className="flex items-center gap-4 mb-6 w-full">
          <SelectField
            label="Sélectionner le niveau d'étude"
            name="levelStudy_id"
            placeholder="Choisissez un niveau d'étude"
            options={levelStudyOptions}
            onChange={handleLevelStudyChange}
            isLoading={loadLevelStudy}
          />
          <SelectField
            label="Sélectionner le cours ou la matière"
            name="course_id"
            placeholder="Choisissez un cours"
            options={coursesOptions}
            onChange={handleCourseChange}
            isLoading={loadCourses}
          />
        </div>

        <div className="text-md text-slate-5  00 font-semibold w-1/3 p-1.5 border border-slate rounded-md">
          Moyenne générale :{" "}
          {averageGrade !== null ? (
            <span className="text-indigo-600">{averageGrade}</span>
          ) : (
            "Aucune donnée"
          )}
        </div>
      </Card>

      <DataTable
        data={filteredData || []}
        columns={columns}
        filters={filters}
        isLoading={isLoading}
        moduleName="grade"
      />
    </div>
  );
};

export default GradeAdministration;
