import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
  const { id } = params;
  const role = await prisma.role.findUnique({
    where: { id: Number(id) },
    include: {
      permission: true,
    }
  });

  if (!role) {
    return NextResponse.json({ error: 'role not found' }, { status: 404 });
  }

  return NextResponse.json(role);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const roleId = parseInt(params.id);
    const roleData = await request.json();

    const updatedrole = await prisma.role.update({
      where: { id: roleId },
      data: {
        name: roleData.name,
        description: roleData.description,
      },
    });

    return NextResponse.json(updatedrole, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour du rôle." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const roleId = parseInt(params.id);

    await prisma.role.delete({
      where: { id: roleId },
    });

    return NextResponse.json({ message: "Rôle supprimé avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression de ce rôle." }, { status: 500 });
  }
}