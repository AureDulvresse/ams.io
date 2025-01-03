import { db } from "../lib/prisma";
import { getUserById } from "./user";

/**
 * Récupère les permissions d'un utilisateur par son ID
 * @param id - ID de l'utilisateur
 * @returns Liste des codes de permissions ou null en cas d'erreur
 */
export const getUserPermissionsById = async (id: string) => {
  try {
    // Récupérer les informations de l'utilisateur (inclut son rôle)
    const user = await getUserById(id);

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Récupérer les permissions liées au rôle de l'utilisateur
    const permissions = await db.rolePermission.findMany({
      where: {
        role_id: user.role_id, // Utilise directement l'ID du rôle
      },
      include: {
        permission: {
          select: {
            code: true, // On ne sélectionne que le code des permissions
          },
        },
      },
    });

    // Retourner uniquement les codes des permissions
    return permissions.map((rp) => rp.permission.code);
  } catch (error) {
    console.error("Erreur lors de la récupération des permissions :", error);
    return null;
  }
};

export const getPermissionByCode = async (code: string) => {
  // Vérifier si un département avec le même nom existe déjà
  const existingPermission = await db.permission.findUnique({
    where: {
      code,
    },
  });

  if (existingPermission) {
    return existingPermission;
  }

  return null;
};

export const createPermission = async (data: any) => {
  // Vérifier si la permission avec le même code existe déjà
  const existingPermission = await getPermissionByCode(data?.code);

  if (existingPermission)
    return { error: "Un département avec ce nom existe déjà." };

  // Créer la permission
  const permission = await db.permission.create({
    data: data,
  });

  return { data: permission };
};

export const hasPermission = (code: string, permissionCodes: string[]) =>
  permissionCodes.includes(code);
