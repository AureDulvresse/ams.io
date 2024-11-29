import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Si aucun levelStudy_id n'est fourni, récupérer tous les étudiants
    const students = await prisma.student.findMany({
      include: {
        levelStudy: {
          select: {
            id: true,
            designation: true,
          }
        }
      }
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des étudiants." },
      { status: 500 }
    );
  }
}


// Chemin de stockage des images
const IMAGE_UPLOAD_PATH = path.join(process.cwd(), "app/uploads/students");

export async function POST(request: Request) {
  try {
    // Utilisation de FormData pour récupérer les données
    const formData = await request.json();

    const studentData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      dob: formData.dob,
      pob: formData.pob,
      gender: formData.gender,
      address: formData.address,
      phone: formData.phone,
      levelStudy_id: parseInt(formData.levelStudy_id as string),
      matricule: formData.matricule,
      tutor: {
        name: formData.tutor.name,
        phone: formData.tutor.phone,
        email: formData.tutor.email,
      },
    };

    // On récupère le fichier avec multer
    const picture = formData.picture;

    // Vérification de l'existence de l'étudiant
    const existingStudent = await prisma.student.findFirst({
      where: {
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        email: studentData.email,
        dob: new Date(studentData.dob),
      },
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          message:
            "Un étudiant avec ce nom, prénom, date de naissance et adresse mail existe déjà.",
        },
        { status: 400 }
      );
    }

    // Vérification de l'existence du parent
    const existingParent = await prisma.parent.findFirst({
      where: {
        name: studentData.tutor.name,
        phone: studentData.tutor.phone,
        email: studentData.tutor.email,
      },
    });

    let parent;
    if (existingParent) {
      parent = existingParent;
    } else {
      // Si le parent n'existe pas, on le crée
      parent = await prisma.parent.create({
        data: {
          name: studentData.tutor.name,
          phone: studentData.tutor.phone,
          email: studentData.tutor.email,
        },
      });
    }

    // Gestion de l'upload d'image (si présente)
    let picturePath = "";
    if (picture && picture instanceof File) {
      const timestamp = Date.now();
      const fileExtension = path.extname(picture.name); // Obtenir l'extension du fichier
      const imageName = `${studentData.matricule}_${timestamp}${fileExtension}`; // Renommer le fichier
      const imageFullPath = path.join(IMAGE_UPLOAD_PATH, imageName);

      // Créer le dossier si nécessaire
      if (!fs.existsSync(IMAGE_UPLOAD_PATH)) {
        fs.mkdirSync(IMAGE_UPLOAD_PATH, { recursive: true });
      }

      // Sauvegarder le fichier image dans le dossier public/uploads
      await picture.arrayBuffer().then((buffer) => {
        const imageBuffer = Buffer.from(buffer);
        fs.writeFileSync(imageFullPath, imageBuffer);
      });

      picturePath = `/uploads/students/${imageName}`;
    }

    // Création de l'étudiant
    const student = await prisma.student.create({
      data: {
        matricule: studentData.matricule,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        dob: new Date(studentData.dob),
        pob: studentData.pob,
        gender: studentData.gender,
        address: studentData.address,
        phone: studentData.phone,
        email: studentData.email,
        levelStudy_id: studentData.levelStudy_id,
        picture: picturePath,
      },
    });

    // Relation entre l'étudiant et le parent dans ParentStudentRelationship
    await prisma.parentStudentRelationship.create({
      data: {
        parent_id: parent.id,
        student_id: student.id,
      },
    });

    // Retour de la réponse avec succès
    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("Erreur lors de la création de l'étudiant:", error);

    // Log des détails de l'erreur pour diagnostic
    console.error(error.stack);

    // Gestion des erreurs de validation ou Prisma
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Erreur de validation : " + error.message },
        { status: 422 }
      );
    }

    // Gestion des erreurs inattendues
    return NextResponse.json(
      { message: "Une erreur inattendue s'est produite.", error: error.message },
      { status: 500 }
    );
  }
}