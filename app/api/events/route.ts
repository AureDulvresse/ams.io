import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        updated_at: 'desc'
      }
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la récupération des événements." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const eventData = await request.json();

    // Vérifier si un département avec le même nom existe déjà
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: eventData.name,
        date: new Date(eventData.date),
      },
    });

    if (existingEvent) {
      return NextResponse.json(
        { message: "Un évènement avec ce titre est déjà prévu à cette date." },
        { status: 400 }
      );
    }

    // Valider les données (on peut utiliser Zod ou autre)
    const newEvent = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description || null,
        date: new Date(eventData.date),
        duration: eventData.duration || null,
        location: eventData.location,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la création de l'événement." },
      { status: 500 }
    );
  }
}