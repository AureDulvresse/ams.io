"use server";

import {
  getDepartmentByCode,
  getDepartmentById,
  getDepartmentByName,
} from "../data/department";
import { db } from "../lib/prisma";

// Créer un department avec au moins une permission
export async function createDepartment(data: {
  name: string;
  code: string;
  type: "academic" | "administrative" | "service";
  description?: string | undefined;
}) {
  const existingDepartment =
    (await getDepartmentByName(data.name)) ||
    (await getDepartmentByCode(data.code));

  if (existingDepartment)
    return {
      success: false,
      error: "Un department avec ce nom ou cette codification existe déjà",
    };

  const department = await db.department.create({
    data: data,
  });

  return { success: true, data: department };
}

// Mettre à jour un department avec au moins une permission
export async function updateDepartment(
  id: number,
  data: {
    name: string;
    code: string;
    type: "academic" | "administrative" | "service";
    description?: string | undefined;
  }
) {
  const existingDepartment = await getDepartmentById(id);

  if (!existingDepartment)
    return {
      success: false,
      error: "Ce department ne peut être modifier car il n'existe pas",
    };

  const department = await db.department.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });

  return { success: true, data: department };
}

// Supprimer un department
export async function deleteDepartment(id: number) {
  return db.department.delete({
    where: { id },
  });
}
