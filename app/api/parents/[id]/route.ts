import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getParentRelationship = async (studentId: number) => {

  const resultat = await prisma.parentStudentRelationship.findFirst({
      where: {
        student_id: studentId,
      }
    })

    return await resultat
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const studentId = parseInt(params.id);

   const result = await getParentRelationship(studentId);

   const parent_id = result?.parent_id;

  const parent = await prisma.parent.findUnique({
    where: { id: Number(parent_id) },
  });

  if (!parent) {
    return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
  }

  return NextResponse.json(parent);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = parseInt(params.id);
    const parentData = await request.json();

    const result = await getParentRelationship(studentId);

   const parent_id = result?.parent_id;

    const updatedparent = await prisma.parent.update({
      where: { id: parent_id },
      data: {
        name: parentData.name,
        email: parentData.email,
        phone: parentData.phone,
      },
    });

    return NextResponse.json(updatedparent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour d'un compte parent." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const parentId = parseInt(params.id);

    await prisma.parent.delete({
      where: { id: parentId },
    });

    return NextResponse.json({ message: "Parent supprimé avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression du parent." }, { status: 500 });
  }
}
