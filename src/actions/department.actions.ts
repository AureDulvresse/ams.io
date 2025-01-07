"use server";

import {
  getDepartmentByCode,
  getDepartmentById,
  getDepartmentByName,
} from "../data/department";
import { db } from "../lib/prisma";

// Créer un department
export async function createDepartment(data: {
  name: string;
  code: string;
  type: string // "academic" | "administrative" | "service";
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
    type: string // "academic" | "administrative" | "service";
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
  try {
    const existingRole = await getDepartmentById(id);

    if (!existingRole) {
      return {
        success: false,
        error: "Ce departement n'existe pas",
      };
    }

    // Vérifier si le deépartement est utilisé par des courses, personel, programmes
    const coursesWithDepartment = await db.course.findMany({
      where: {
        department_id: existingRole.id,
      },
    });

    const staffWithDepartment = await db.staff.findMany({
      where: {
        department_id: existingRole.id,
      },
    });

    const programsWithDepartment = await db.program.findMany({
      where: {
        department_id: existingRole.id,
      },
    });

    const linkedDepartment = coursesWithDepartment.length > 0 || staffWithDepartment.length > 0 || programsWithDepartment.length > 0;

    if (linkedDepartment) {
      return {
        success: false,
        error:
          "Ce département ne peut pas être supprimé car il est actuellement attribué à des cours ou un personnel ou encore à un programme",
      };
    }

    // Puis supprimer le departement
    const deletedDepartment = await db.role.delete({
      where: { id },
    });

    return {
      success: true,
      data: deletedDepartment,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du rôle:", error);
    return {
      success: false,
      error:
        "Impossible de supprimer ce rôle. Il est peut-être utilisé par d'autres éléments du système.",
    };
  }
}