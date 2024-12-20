import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
  const { id } = params;
  const levelStudy = await prisma.levelStudy.findUnique({
    where: { id: Number(id) },
    include: {
      classes: true
    }
  });

  if (!levelStudy) {
    return NextResponse.json({ error: 'LevelStudy not found' }, { status: 404 });
  }

  return NextResponse.json(levelStudy);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const levelStudyId = parseInt(params.id);
    const levelStudyData = await request.json();
    const updatedDate = new Date().toLocaleDateString()

    const updatedlevelStudy = await prisma.levelStudy.update({
      where: { id: levelStudyId },
      data: {
        designation: levelStudyData.designation,
        description: levelStudyData.description || null,
      },
    });

    return NextResponse.json(updatedlevelStudy, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour du niveau d'étude." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const levelStudyId = parseInt(params.id);

    await prisma.levelStudy.delete({
      where: { id: levelStudyId },
    });

    return NextResponse.json({ message: "Niveau d'étude supprimé avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression du niveau d'étude." }, { status: 500 });
  }
}