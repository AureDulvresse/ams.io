import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const departments = await prisma.department.findMany({
    orderBy: {
      updated_at: 'desc'
    }
  });
  return NextResponse.json(departments);
}

export async function POST(request: { json: () => any }) {
  const departmentData = await request.json();

  // Vérifier si un département avec le même nom existe déjà
  const existingDepartment = await prisma.department.findUnique({
    where: {
      name: departmentData.name,
    },
  });

  if (existingDepartment) {
    return NextResponse.json(
      { message: "Un département avec ce nom existe déjà." },
      { status: 400 }
    );
  }

  // Créer le département (la date sera ajoutée automatiquement)
  const department = await prisma.department.create({
    data: departmentData,
  });

  return NextResponse.json(department, { status: 201 });
}
