import { revalidatePath } from "next/cache";
import { getSubjectByCode, getSubjectByName } from "../data/subject";
import { subjectSchema } from "../schemas/subject.schema";
import { db } from "../lib/prisma";
import { z } from "zod";

// Subject actions
export async function createSubject(data: z.infer<typeof subjectSchema>) {
  try {
    const validatedData = subjectSchema.parse(data);
    const { departmentIds, ...subjectData } = validatedData;

    if (!departmentIds || departmentIds.length === 0) {
      return {
        success: false,
        error: "Une matière doit être associée à au moins un département",
      };
    }

    const existingSubjectByCode = await getSubjectByCode(subjectData.code);
    if (existingSubjectByCode) {
      return { success: false, error: "Une matière avec ce code existe déjà" };
    }

    const existingSubjectByName = await getSubjectByName(subjectData.name);
    if (existingSubjectByName) {
      return { success: false, error: "Une matière avec ce nom existe déjà" };
    }

    const subject = await db.$transaction(async (tx) => {
      const newSubject = await tx.subject.create({
        data: subjectData,
      });

      await tx.subjectDepartment.createMany({
        data: departmentIds.map((departmentId) => ({
          subject_id: newSubject.id,
          department_id: departmentId,
        })),
      });

      return await tx.subject.findUnique({
        where: { id: newSubject.id },
        include: {
          departments: {
            include: {
              department: true,
            },
          },
        },
      });
    });

    revalidatePath("/academic/subjects");
    return { success: true, data: subject };
  } catch (error) {
    console.error("Erreur lors de la création de la matière:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données de formulaire invalides" };
    }
    return {
      success: false,
      error: "Erreur lors de la création de la matière",
    };
  }
}

export async function updateSubject(
  id: number,
  data: z.infer<typeof subjectSchema>
) {
  try {
    const validatedData = subjectSchema.parse(data);
    const { departmentIds, ...subjectData } = validatedData;

    if (!departmentIds || departmentIds.length === 0) {
      return {
        success: false,
        error: "Une matière doit être associée à au moins un département",
      };
    }

    const existingSubject = await db.subject.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      return {
        success: false,
        error: "Cette matière ne peut être modifiée car elle n'existe pas",
      };
    }

    // Vérifier les doublons seulement si le nom ou le code a changé
    if (existingSubject.code !== subjectData.code) {
      const duplicateCode = await getSubjectByCode(subjectData.code);
      if (duplicateCode) {
        return {
          success: false,
          error: "Une matière avec ce code existe déjà",
        };
      }
    }

    if (existingSubject.name !== subjectData.name) {
      const duplicateName = await getSubjectByName(subjectData.name);
      if (duplicateName) {
        return { success: false, error: "Une matière avec ce nom existe déjà" };
      }
    }

    const subject = await db.$transaction(async (tx) => {
      // Mettre à jour la matière
      const updatedSubject = await tx.subject.update({
        where: { id },
        data: {
          ...subjectData,
          departments: {
            deleteMany: {}, // Supprime toutes les associations existantes
            create: departmentIds.map((departmentId) => ({
              department_id: departmentId,
            })),
          },
        },
        include: {
          departments: {
            include: {
              department: true,
            },
          },
        },
      });

      return updatedSubject;
    });

    revalidatePath("/academic/subjects");
    return { success: true, data: subject };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la matière:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données de formulaire invalides" };
    }
    return {
      success: false,
      error: "Erreur lors de la mise à jour de la matière",
    };
  }
}

export async function deleteSubject(id: number) {
  try {
    const existingSubject = await db.subject.findUnique({
      where: { id },
      include: {
        departments: true,
      },
    });

    if (!existingSubject) {
      return {
        success: false,
        error: "Cette matière n'existe pas",
      };
    }

    // Vérifier si la matière est utilisée dans des cours
    const coursesUsingSubject = await db.course.findMany({
      where: { subject_id: id },
    });

    if (coursesUsingSubject.length > 0) {
      return {
        success: false,
        error:
          "Cette matière ne peut pas être supprimée car elle est associée à des cours",
      };
    }

    // Supprimer les associations avec les départements
    await db.subjectDepartment.deleteMany({
      where: { subject_id: id },
    });

    const deletedSubject = await db.subject.delete({
      where: { id },
    });

    revalidatePath("/academic/subjects");
    return { success: true, data: deletedSubject };
  } catch (error) {
    console.error("Erreur lors de la suppression de la matière:", error);
    return {
      success: false,
      error:
        "Impossible de supprimer cette matière. Elle est peut-être utilisée par d'autres éléments du système.",
    };
  }
}
