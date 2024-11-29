import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: any, { params }: any) {
  const { uuid } = params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(uuid) },
      include: {
        parentStudents: {
          select: {
            parent_id: true,
          }
        },
        levelStudy: {
          select: {
            id: true,
            designation: true
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while fetching the student' }, { status: 500 });
  }
}

import fs from 'fs';
import path from 'path';

export async function PUT(request: { json: () => any }, { params }: any) {
  const { uuid } = params;

  try {
    const updatedData = await request.json();

    // Validation des données transmises
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: parseInt(uuid) },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Préparer les données à mettre à jour dynamiquement
    const updateFields: { [key: string]: any } = {};

    if (updatedData.firstName) updateFields.first_name = updatedData.firstName;
    if (updatedData.lastName) updateFields.last_name = updatedData.lastName;
    if (updatedData.dob) updateFields.dob = new Date(updatedData.dob);
    if (updatedData.pob) updateFields.pob = updatedData.pob;
    if (updatedData.gender) updateFields.gender = updatedData.gender;
    if (updatedData.address) updateFields.address = updatedData.address;
    if (updatedData.email) updateFields.email = updatedData.email;
    if (updatedData.phone) updateFields.phone = updatedData.phone;
    if (updatedData.levelStudy_id) updateFields.levelStudy_id = updatedData.levelStudy_id;

    // Si une nouvelle image est fournie, gérer le remplacement de l'ancienne image
    if (updatedData.picture) {
      // Supprimer l'ancienne image si elle existe
      if (student.picture) {
        const oldImagePath = path.join(process.cwd(), 'app', 'uploads', student.picture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Supprime le fichier de l'ancienne image
        }
      }
      // Ajouter la nouvelle image
      updateFields.picture = updatedData.picture;
    }

    // Si aucun champ valide n'est transmis
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // Mise à jour de l'étudiant
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(uuid) },
      data: updateFields,
    });

    return NextResponse.json(updatedStudent);
  } catch (error: any) {
    if (error.code === "P2025") {
      // Code P2025 correspond à "Record not found" chez Prisma
      return NextResponse.json(
        { error: "Student not found for update" },
        { status: 404 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while updating the student" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: any, { params }: any) {
  const { uuid } = params;

  if (!uuid || isNaN(Number(uuid))) {
    return NextResponse.json(
      { error: "Invalid student ID provided" },
      { status: 400 }
    );
  }

  try {
    await prisma.student.delete({
      where: { id: Number(uuid) },
    });

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 204 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Student not found for deletion" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "An error occurred while deleting the student" },
      { status: 500 }
    );
  }
}
