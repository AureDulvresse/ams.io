import { db } from "../lib/prisma";

/**
 * Récupère les permissions d'un utilisateur par son ID
 * @param name - Nom du role
 * @returns Liste des codes de permissions ou null en cas d'erreur
 */
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

export const createRole = async (data: any) => {
  // Vérifier si la permission avec le même code existe déjà
  const existingRole = await getRoleByName(data?.name);

  if (existingRole)
    return { error: "Un rôle avec ce nom existe déjà." };

  // Créer le rôle
  const role = await db.role.create({
    data: data,
  });

  return { data: role };
};
