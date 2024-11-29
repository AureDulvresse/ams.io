import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
  const { id } = params;
  const event = await prisma.event.findUnique({ where: { id: Number(id) } });
  
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    const eventData = await request.json();

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: eventData.title,
        description: eventData.description || null,
        date: new Date(eventData.date).toLocaleDateString(),
        duration: eventData.duration || 1,
        location: eventData.location,
      },
    });
    
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour de l'événement." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);

    await prisma.event.delete({
      where: { id: eventId },
    });
    
    return NextResponse.json({ message: "Événement supprimé avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression de l'événement." }, { status: 500 });
  }
}