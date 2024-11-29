import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const levelStudys = await prisma.levelStudy.findMany({
    orderBy: {
      updated_at: 'desc'
    }
  });
  return NextResponse.json(levelStudys);
}

export async function POST(request: { json: () => any }) {
  const levelStudyData = await request.json();

  // Vérifier si un niveau d'étude avec le même nom existe déjà
  const existinglevelStudy = await prisma.levelStudy.findUnique({
    where: {
      designation: levelStudyData.designation,
    },
  });

  if (existinglevelStudy) {
    return NextResponse.json(
      { message: "Un niveau d'étude avec ce nom existe déjà." },
      { status: 400 }
    );
  }

  // Créer le niveau d'étude (la date sera ajoutée automatiquement)
  const levelStudy = await prisma.levelStudy.create({
    data: levelStudyData,
  });

  return NextResponse.json(levelStudy, { status: 201 });
}
