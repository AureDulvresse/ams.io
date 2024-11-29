import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        updated_at: 'desc'
      }
    });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la récupération des tâches." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const taskData = await request.json();

    // Valider les données (on peut utiliser Zod ou autre)
    const newtask = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description || null,
        date: new Date(taskData.date),
        repeat: taskData.repeat || null,
      },
    });

    return NextResponse.json(newtask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la création de la tâche." },
      { status: 500 }
    );
  }
}