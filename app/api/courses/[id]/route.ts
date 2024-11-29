import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
  const { id } = params;
  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
    include: {
      department: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  return NextResponse.json(course);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = parseInt(params.id);
    const courseData = await request.json();

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        name: courseData.name,
        description: courseData.description || null,
        credits: courseData.credits,
        department_id: courseData.department_id,
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour du cours." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = parseInt(params.id);

    await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ message: "Cours supprimé avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression du cours." }, { status: 500 });
  }
}