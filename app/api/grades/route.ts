import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        student: {
          include: {
            levelStudy: {
              select: {
                id: true,
                designation: true,
              },
            },
          },
        },
        course: {
          select: { name: true },
        },
      },
    });

    // Retourner les résultats
    return NextResponse.json(grades, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la récupération des notes :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la récupération des notes.",
        error: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// Ajouter de nouvelles notes
export async function POST(request: Request) {
  try {
    const gradeData = await request.json();

    if (!Array.isArray(gradeData)) {
      return NextResponse.json(
        { message: "Les données doivent être un tableau." },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      gradeData.map(async (data) => {
        const { academic_year, semester, student_id, course_id, grade, observation } = data;

        // Validation de base
        if (!academic_year || !semester || !student_id || !course_id || grade == null) {
          return NextResponse.json(
            { message: "Tous les champs requis doivent être remplis." },
            { status: 400 }
          );
        }

        // Vérifier si la note existe déjà pour cet étudiant et ce cours
        const existingGrade = await prisma.grade.findFirst({
          where: {
            student_id: parseInt(student_id),
            course_id: parseInt(course_id),
            semester,
            academic_year,
          },
        });

        if (existingGrade) {
          return NextResponse.json(
            {
              message:
                `Une note existe déjà pour l'étudiant ${student_id} dans le cours ${course_id}.`,
            },
            { status: 400 }
          );
        }

        // Créer la note
        return prisma.grade.create({
          data: {
            student_id: parseInt(student_id),
            course_id: parseInt(course_id),
            grade: parseInt(grade),
            observation: observation || "",
            semester: semester,
            academic_year: academic_year,
          },
        });
      })
    );

    return NextResponse.json(results, { status: 201 });
  } catch (error: any) {
    console.error("Erreur lors de la création des notes :", error);

    return NextResponse.json(
      { message: "Une erreur est survenue.", details: error.message },
      { status: 400 }
    );
  }
}
