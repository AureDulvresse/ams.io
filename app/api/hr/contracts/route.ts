import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const contracts = await prisma.contractType.findMany({
      include: {
        Staff: {
          select:{
            id: true,
            first_name: true,
            last_name: true,
          }
        }
      },
      orderBy: {
        updated_at: 'desc'
      }
    });
    return NextResponse.json(contracts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la récupération des types de contracts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const contractData = await request.json();

    // Vérifier si un département avec le même nom existe déjà
    const existingcontract = await prisma.contractType.findFirst({
      where: {
        libelle: contractData.name,
      },
    });

    if (existingcontract) {
      return NextResponse.json(
        { message: "Un type de contrat avec ce nom existe déjà." },
        { status: 400 }
      );
    }


    const newcontract = await prisma.contractType.create({
      data: {
        libelle: contractData.libelle,
        description: contractData.description || null,
        duration: contractData.duration || null,
      },
    });

    return NextResponse.json(newcontract, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la création du type de contrat." },
      { status: 500 }
    );
  }
}