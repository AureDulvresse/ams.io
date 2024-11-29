import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET pour récupérer toutes les écoles
export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        name: 'desc' // Trier par date de mise à jour
      }
    });
    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la récupération des écoles." },
      { status: 500 }
    );
  }
}

// POST pour créer une nouvelle école
export async function POST(request: Request) {
  try {
    const schoolData = await request.json();

    // Valider les données (on peut utiliser Zod ou autre)
    const newSchool = await prisma.school.create({
      data: schoolData,
    });

    return NextResponse.json(newSchool, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la création de l'école." },
      { status: 500 }
    );
  }
}
