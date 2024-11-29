import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: any) {
  const { id } = params;
  const task = await prisma.task.findUnique({ where: { id: Number(id) } });
  
  if (!task) {
    return NextResponse.json({ error: 'task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = parseInt(params.id);
    const taskData = await request.json();

    const updatedtask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: taskData.title,
        description: taskData.description || null,
        date: new Date(taskData.date).toLocaleDateString(),
        repeat: taskData.duration || 1,
      },
    });
    
    return NextResponse.json(updatedtask, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour de la tâche." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = parseInt(params.id);

    await prisma.task.delete({
      where: { id: taskId },
    });
    
    return NextResponse.json({ message: "Tâche supprimé avec succès." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression de la tâche." }, { status: 500 });
  }
}