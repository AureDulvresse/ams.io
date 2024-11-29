import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const parents = await prisma.parent.findMany({
      orderBy: {
        updated_at: 'desc'
      }
    });
    return NextResponse.json(parents, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la récupération des cours." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const parentData = await request.json();

    // Valider les données (on peut utiliser Zod ou autre)
    const newParent = await prisma.parent.create({
      data: {
        name: parentData.name,
        email: parentData.email,
        phone: parentData.phone,
      },
    });

    return NextResponse.json(newParent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la création d'un compte parent." },
      { status: 500 }
    );
  }
}