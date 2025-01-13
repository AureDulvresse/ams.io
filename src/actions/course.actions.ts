"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/src/lib/prisma";
import { z } from "zod";
import { courseSchema } from "../schemas/course.schema";

// Helper functions
async function getSubjectByCode(code: string) {
  return await db.subject.findFirst({
    where: { code },
  });
}

async function getSubjectByName(name: string) {
  return await db.subject.findFirst({
    where: { name },
  });
}

async function getCourseByCode(code: string) {
  return await db.course.findFirst({
    where: { code },
  });
}

async function getCourseByName(name: string) {
  return await db.course.findFirst({
    where: { name },
  });
}

// Course actions
export async function createCourse(data: z.infer<typeof courseSchema>) {
  try {
    const validatedData = courseSchema.parse(data);
    const { prerequisites, ...courseData } = validatedData;

    // Vérifier si le cours existe déjà
    const existingCourseByCode = await getCourseByCode(courseData.code);
    if (existingCourseByCode) {
      return { success: false, error: "Un cours avec ce code existe déjà" };
    }

    const existingCourseByName = await getCourseByName(courseData.name);
    if (existingCourseByName) {
      return { success: false, error: "Un cours avec ce nom existe déjà" };
    }

    // Vérifier l'existence de la matière
    const subject = await db.subject.findUnique({
      where: { id: courseData.subject_id },
    });

    if (!subject) {
      return { success: false, error: "La matière sélectionnée n'existe pas" };
    }

    const course = await db.$transaction(async (tx) => {
      const newCourse = await tx.course.create({
        data: {
          ...courseData,
          status: "active",
        },
      });

      if (prerequisites?.length) {
        await tx.coursePrerequisite.createMany({
          data: prerequisites.map((prerequisiteId) => ({
            course_id: newCourse.id,
            prerequisite_id: prerequisiteId,
          })),
        });
      }

      return await tx.course.findUnique({
        where: { id: newCourse.id },
        include: {
          prerequisites: {
            include: {
              prerequisite: true,
            },
          },
          subject: true,
          semester: true,
        },
      });
    });

    revalidatePath("/academic/courses");
    return { success: true, data: course };
  } catch (error) {
    console.error("Erreur lors de la création du cours:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données de formulaire invalides" };
    }
    return { success: false, error: "Erreur lors de la création du cours" };
  }
}

export async function updateCourse(
  id: number,
  data: z.infer<typeof courseSchema>
) {
  try {
    const validatedData = courseSchema.parse(data);
    const { prerequisites, ...courseData } = validatedData;

    const existingCourse = await db.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return {
        success: false,
        error: "Ce cours ne peut être modifié car il n'existe pas",
      };
    }

    // Vérifier les doublons seulement si le nom ou le code a changé
    if (existingCourse.code !== courseData.code) {
      const duplicateCode = await getCourseByCode(courseData.code);
      if (duplicateCode) {
        return { success: false, error: "Un cours avec ce code existe déjà" };
      }
    }

    if (existingCourse.name !== courseData.name) {
      const duplicateName = await getCourseByName(courseData.name);
      if (duplicateName) {
        return { success: false, error: "Un cours avec ce nom existe déjà" };
      }
    }

    const course = await db.$transaction(async (tx) => {
      // Mettre à jour le cours
      const updatedCourse = await tx.course.update({
        where: { id },
        data: {
          ...courseData,
          prerequisites: {
            deleteMany: {}, // Supprime tous les prérequis existants
            create: prerequisites?.map((prerequisiteId) => ({
              prerequisite_id: prerequisiteId,
            })),
          },
        },
        include: {
          prerequisites: {
            include: {
              prerequisite: true,
            },
          },
          subject: true,
          semester: true,
        },
      });

      return updatedCourse;
    });

    revalidatePath("/academic/courses");
    return { success: true, data: course };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cours:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données de formulaire invalides" };
    }
    return { success: false, error: "Erreur lors de la mise à jour du cours" };
  }
}

export async function deleteCourse(id: number) {
  try {
    const existingCourse = await db.course.findUnique({
      where: { id },
      include: {
        prerequisites: true,
        classes: true,
      },
    });

    if (!existingCourse) {
      return {
        success: false,
        error: "Ce cours n'existe pas",
      };
    }

    // Vérifier si le cours est utilisé dans des classes
    if (existingCourse.classes.length > 0) {
      return {
        success: false,
        error:
          "Ce cours ne peut pas être supprimé car il est associé à des classes",
      };
    }

    // Supprimer les relations de prérequis
    await db.coursePrerequisite.deleteMany({
      where: {
        OR: [{ course_id: id }, { prerequisite_id: id }],
      },
    });

    const deletedCourse = await db.course.delete({
      where: { id },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: deletedCourse };
  } catch (error) {
    console.error("Erreur lors de la suppression du cours:", error);
    return {
      success: false,
      error:
        "Impossible de supprimer ce cours. Il est peut-être utilisé par d'autres éléments du système.",
    };
  }
}