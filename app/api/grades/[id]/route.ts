import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
  const { id } = params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      logins: true,
      messagesReceived: true,
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id);
    const userData = await request.json();

    const updateduser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: userData.password,
        role_id: userData.roleId,
      },
    });

    return NextResponse.json(updateduser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour des informations de cette utilisateur." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id);

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "Utilisateur supprimé avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression de cette utilisateur." }, { status: 500 });
  }
}