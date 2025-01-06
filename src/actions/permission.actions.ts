import { getPermissionByCode, getPermissionById } from "../data/permission";
import { db } from "../lib/prisma";

export const createPermission = async (data: {
  name: string;
  code: string;
  description?: string;
}) => {
  // Vérifier si la permission avec le même code existe déjà
  const existingPermission = await getPermissionByCode(data?.code);

  if (existingPermission)
    return { success: false, error: "Une permission avec ce code existe déjà." };

  // Créer la permission
  const permission = await db.permission.create({
    data: data,
  });

  return { success: true, data: permission };
};

// Mettre à jour une permission
export async function updatePermission(
  id: number,
  data: { name?: string; code?: string; description?: string }
) {
  // Vérifier si la permission avec le même code existe déjà
  const existingPermission = await getPermissionById(id);

  if (!existingPermission)
    return { success: false, error: "Cette permission ne peut être modifier car il n'existe pas" };

  const permission = await db.permission.update({
    where: { id },
    data,
  });

  return { success: true, data: permission };
}

// Supprimer une permission
export async function deletePermission(id: number) {
  return db.permission.delete({
    where: { id },
  });
}
