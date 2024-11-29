import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: {
      updated_at: 'desc'
    }
  });
  return NextResponse.json(users);
}

export async function POST(request: { json: () => any }) {
  const userData = await request.json();

  // Vérifier si un département avec le même nom existe déjà
  const existinguser = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (existinguser) {
    return NextResponse.json(
      { message: "Un utilisateur avec cet email existe déjà." },
      { status: 400 }
    );
  }

  // Créer le département (la date sera ajoutée automatiquement)
  const user = await prisma.user.create({
    data: userData,
  });

  return NextResponse.json(user, { status: 201 });
}
