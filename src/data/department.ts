import { db } from "../lib/prisma";

export const getDepartmentByName = async (name: string) => {
  try {
    // Récupérer les permissions liées au rôle de l'utilisateur
    const department = await db.department.findUniqueOrThrow({
      where: {
        name,
      },
    });

    return department;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle :", error);
    return null;
  }
};

// Lire les rôles
export async function getDepartments() {
  return db.department.findMany({
    include: {
      courses: true,
      staff: true,
      programs: true,
    },
  });
}

// Lire un rôle spécifique
export async function getDepartmentById(id: number) {
  return db.department.findUnique({
    where: { id },
    include: {
      courses: true,
      staff: true,
      programs: true,
    },
  });
}

export async function getDepartmentByCode(code: string) {
  return db.department.findUnique({
    where: { code },
    include: {
      courses: true,
      staff: true,
      programs: true,
    },
  });
}
