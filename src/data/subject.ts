import { db } from "../lib/prisma";

export const getSubjectByName = async (name: string) => {
  try {
    // Récupérer les permissions liées au matière de l'utilisateur
    const subject = await db.subject.findUniqueOrThrow({
      where: {
        name,
      },
    });

    return subject;
  } catch (error) {
    console.error("Erreur lors de la récupération du matière :", error);
    return null;
  }
};

// Lire les matières
export async function getSubjects() {
  return db.subject.findMany({
    include: {
      departments: true,
    },
  });
}

// Lire un matière spécifique
export async function getSubjectById(id: number) {
  return db.subject.findUnique({
    where: { id },
    // include: {
    //   courses: true,
    //   staff: true,
    //   programs: true,
    // },
  });
}

export async function getSubjectByCode(code: string) {
  return db.subject.findUnique({
    where: { code },
    include: {
      departments: true,
    },
  });
}
