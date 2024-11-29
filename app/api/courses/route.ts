import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        department: {
          select:{
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        updated_at: 'desc'
      }
    });
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la récupération des cours." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const courseData = await request.json();

    // Vérifier si un département avec le même nom existe déjà
    const existingCourse = await prisma.course.findFirst({
      where: {
        name: courseData.name,
        department_id: courseData.department_id
      },
    });

    if (existingCourse) {
      return NextResponse.json(
        { message: "Un cours avec ce nom existe déjà dans ce departement." },
        { status: 400 }
      );
    }


    const newCourse = await prisma.course.create({
      data: {
        name: courseData.name,
        description: courseData.description || null,
        credits: courseData.credits,
        department_id: courseData.department_id
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la création du cours." },
      { status: 500 }
    );
  }
}