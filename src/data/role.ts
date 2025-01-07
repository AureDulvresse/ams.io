import { db } from "../lib/prisma";

export const getRoleByName = async (name: string) => {
  try {
    // Récupérer les permissions liées au rôle de l'utilisateur
    const role = await db.role.findUniqueOrThrow({
      where: {
        name,
      },
    });

    return role;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle :", error);
    return null;
  }
};

// Lire les rôles
export async function getRoles() {
  return db.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: {
      updated_at: "desc",
    },
  });
}

// Lire un rôle spécifique
export async function getRoleById(id: number) {
  return db.role.findUnique({
    where: { id },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}
