import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
  const { id } = params;
  const department = await prisma.department.findUnique({
    where: { id: Number(id) },
    include: {
      courses: true
    }
  });

  if (!department) {
    return NextResponse.json({ error: 'Department not found' }, { status: 404 });
  }

  return NextResponse.json(department);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const departmentId = parseInt(params.id);
    const departmentData = await request.json();

    const updatedDepartment = await prisma.department.update({
      where: { id: departmentId },
      data: {
        name: departmentData.name,
        description: departmentData.description || null,
      },
    });

    return NextResponse.json(updatedDepartment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour du departement." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const departmentId = parseInt(params.id);

    await prisma.department.delete({
      where: { id: departmentId },
    });

    return NextResponse.json({ message: "Departement supprimé avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression du departement." }, { status: 500 });
  }
}