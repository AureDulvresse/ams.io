import { db } from "../lib/prisma";

// Récupérer un rôle par son nom
export const getRoleByName = async (name: string) => {
  try {
    const role = await db.role.findUniqueOrThrow({
      where: {
        name,
      },
      include: {
        permissions: {
          include: {
            permission: true, // Inclure les détails des permissions liées au rôle
          },
        },
      },
    });

    return role;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle :", error);
    return null;
  }
};

// Récupérer tous les rôles avec leurs permissions
export async function getRoles() {
  try {
    const roles = await db.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true, // Inclure les détails des permissions pour chaque rôle
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    return roles;
  } catch (error) {
    console.error("Erreur lors de la récupération des rôles :", error);
    return [];
  }
}

// Récupérer un rôle spécifique par son ID avec ses permissions
export async function getRoleById(id: number) {
  try {
    const role = await db.role.findUniqueOrThrow({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true, // Inclure les détails des permissions liées au rôle
          },
        },
      },
    });

    return role;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle par ID :", error);
    return null;
  }
}
