import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET pour récupérer une école par ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const school = await prisma.school.findUnique({
    where: { id: Number(id) }, // Assurez-vous que l'ID est un nombre
  });

  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 });
  }

  return NextResponse.json(school);
}

// PUT pour mettre à jour une école
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const schoolId = parseInt(params.id);
    const schoolData = await request.json();

    const updatedSchool = await prisma.school.update({
      where: { id: schoolId },
      data: {
        name: schoolData.name,
        // Ajoutez d'autres champs ici si nécessaire
      },
    });

    return NextResponse.json(updatedSchool, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour de l'école." }, { status: 500 });
  }
}

// DELETE pour supprimer une école
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const schoolId = parseInt(params.id);

    await prisma.school.delete({
      where: { id: schoolId },
    });

    return NextResponse.json({ message: "École supprimée avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression de l'école." }, { status: 500 });
  }
}
