import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const roles = await prisma.role.findMany({
    orderBy: {
      updated_at: 'desc'
    }
  });
  return NextResponse.json(roles);
}

export async function POST(request: { json: () => any }) {
  const roleData = await request.json();

  // Vérifier si un département avec le même nom existe déjà
  const existingrole = await prisma.role.findUnique({
    where: {
      name: roleData.name,
    },
  });

  if (existingrole) {
    return NextResponse.json(
      { message: "Un role avec ce nom existe déjà." },
      { status: 400 }
    );
  }

  // Créer le département (la date sera ajoutée automatiquement)
  const role = await prisma.role.create({
    data: roleData,
  });

  return NextResponse.json(role, { status: 201 });
}
