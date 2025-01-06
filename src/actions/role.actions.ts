"use server";

import { getRoleById, getRoleByName } from "../data/role";
import { db } from "../lib/prisma";

// Créer un rôle avec au moins une permission
export async function createRole(data: {
  name: string;
  description?: string;
  permissionIds: number[];
}) {
  if (!data.permissionIds || data.permissionIds.length === 0) {
    return {
      success: false,
      error: "Un rôle doit avoir au moins une permission.",
    };
  }

  const existingRole = await getRoleByName(data.name);

  if (existingRole)
    return { success: false, error: "Un rôle avec ce nom existe déjà" };

  const role = await db.role.create({
    data: {
      name: data.name,
      description: data.description,
      permissions: {
        create: data.permissionIds.map((permissionId) => ({
          permission_id: permissionId,
        })),
      },
    },
  });

  return { success: true, data: role };
}

// Mettre à jour un rôle avec au moins une permission
export async function updateRole(
  id: number,
  data: { name?: string; description?: string; permissionIds: number[] }
) {
  if (!data.permissionIds || data.permissionIds.length === 0) {
    return {
      success: false,
      error: "Un rôle doit avoir au moins une permission.",
    };
  }

  const existingRole = await getRoleById(id);

  if (!existingRole)
    return {
      success: false,
      error: "Ce rôle ne peut être modifier car il n'existe pas",
    };

  const role = await db.role.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      permissions: {
        deleteMany: {}, // Supprime toutes les permissions existantes
        create: data.permissionIds.map((permissionId) => ({
          permission_id: permissionId,
        })),
      },
    },
  });

  return { success: true, data: role };
}

// Supprimer un rôle
export async function deleteRole(id: number) {
  return db.role.delete({
    where: { id },
  });
}
