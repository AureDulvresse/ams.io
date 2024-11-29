import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
  const { id } = params;
  const contract = await prisma.contractType.findUnique({
    where: { id: Number(id) },
    include: {
      Staff: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          matricule: true,
        }
      }
    }
  });

  if (!contract) {
    return NextResponse.json({ error: 'Contract Type not found' }, { status: 404 });
  }

  return NextResponse.json(contract);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const contractId = parseInt(params.id);
    const contractData = await request.json();

    const updatedcontract = await prisma.contractType.update({
      where: { id: contractId },
      data: {
        libelle: contractData.name,
        description: contractData.description || null,
        duration: contractData.duration || null,
      },
    });

    return NextResponse.json(updatedcontract, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour du type de contrat." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const contractId = parseInt(params.id);

    await prisma.contractType.delete({
      where: { id: contractId },
    });

    return NextResponse.json({ message: "Type de contrat supprimé avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression du cours." }, { status: 500 });
  }
}