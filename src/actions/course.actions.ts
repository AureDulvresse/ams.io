// src/actions/course.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/src/lib/prisma";
import { z } from "zod";
import { courseSchema, subjectSchema } from "../schemas/course.schema";

// Classe d'erreur personnalisée
class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

// Créer un cours
export async function createCourse(data: z.infer<typeof courseSchema>) {
  try {
    const validatedData = courseSchema.parse(data);
    const { prerequisites, ...courseData } = validatedData;

    // Vérifier l'existence du département
    const department = await db.department.findUnique({
      where: { id: courseData.department_id },
    });

    if (!department) {
      throw new ActionError("Le département sélectionné n'existe pas");
    }

    // Vérifier l'unicité du code
    const existingCourse = await db.course.findFirst({
      where: {
        OR: [{ code: courseData.code }, { name: courseData.name }],
      },
    });

    if (existingCourse) {
      if (existingCourse.code === courseData.code) {
        throw new ActionError("Un cours avec ce code existe déjà");
      }
      throw new ActionError("Un cours avec ce nom existe déjà");
    }

    // Vérifier l'existence des prérequis
    if (prerequisites && prerequisites.length > 0) {
      const prerequisitesCourses = await db.course.findMany({
        where: {
          id: {
            in: prerequisites,
          },
        },
      });

      if (prerequisitesCourses.length !== prerequisites.length) {
        throw new ActionError("Certains cours prérequis n'existent pas");
      }
    }

    // Créer le cours avec ses prérequis
    const course = await db.course.create({
      data: {
        ...courseData,
        created_at: new Date(),
        updated_at: new Date(),
        prerequisites: prerequisites
          ? {
              create: prerequisites.map((prerequisiteId) => ({
                prerequisite: {
                  connect: { id: prerequisiteId },
                },
              })),
            }
          : undefined,
      },
      include: {
        prerequisites: {
          include: {
            prerequisite: true,
          },
        },
        department: true,
      },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: course };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ActionError("Données de formulaire invalides");
    }
    if (error instanceof ActionError) {
      throw error;
    }
    throw new ActionError("Erreur lors de la création du cours");
  }
}

// Mettre à jour un cours
export async function updateCourse(
  id: number,
  data: z.infer<typeof courseSchema>
) {
  try {
    const validatedData = courseSchema.parse(data);
    const { prerequisites, ...courseData } = validatedData;

    // Vérifier l'existence du cours
    const existingCourse = await db.course.findUnique({
      where: { id },
      include: {
        prerequisites: true,
      },
    });

    if (!existingCourse) {
      throw new ActionError("Cours non trouvé");
    }

    // Vérifier l'unicité du code et du nom
    const duplicateCourse = await db.course.findFirst({
      where: {
        OR: [{ code: courseData.code }, { name: courseData.name }],
        NOT: { id },
      },
    });

    if (duplicateCourse) {
      if (duplicateCourse.code === courseData.code) {
        throw new ActionError("Un cours avec ce code existe déjà");
      }
      throw new ActionError("Un cours avec ce nom existe déjà");
    }

    // Vérifier l'existence des prérequis
    if (prerequisites && prerequisites.length > 0) {
      const prerequisitesCourses = await db.course.findMany({
        where: {
          id: {
            in: prerequisites,
          },
        },
      });

      if (prerequisitesCourses.length !== prerequisites.length) {
        throw new ActionError("Certains cours prérequis n'existent pas");
      }

      // Vérifier qu'un cours ne se référence pas lui-même
      if (prerequisites.includes(id)) {
        throw new ActionError("Un cours ne peut pas être son propre prérequis");
      }
    }

    // Mettre à jour le cours et ses prérequis
    const updatedCourse = await db.course.update({
      where: { id },
      data: {
        ...courseData,
        updated_at: new Date(),
        prerequisites: {
          deleteMany: {},
          create: prerequisites?.map((prerequisiteId) => ({
            prerequisite: {
              connect: { id: prerequisiteId },
            },
          })),
        },
      },
      include: {
        prerequisites: {
          include: {
            prerequisite: true,
          },
        },
        department: true,
      },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: updatedCourse };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ActionError("Données de formulaire invalides");
    }
    if (error instanceof ActionError) {
      throw error;
    }
    throw new ActionError("Erreur lors de la mise à jour du cours");
  }
}

// Supprimer un cours
export async function deleteCourse(id: number) {
  try {
    // Vérifier l'existence du cours et ses dépendances
    const course = await db.course.findUnique({
      where: { id },
      include: {
        subjects: true,
        classes: true,
        teachers: true,
        materials: true,
        prerequisites: true,
        requiredFor: true,
      },
    });

    if (!course) {
      throw new ActionError("Cours non trouvé");
    }

    // Vérifier les dépendances
    const dependencies = [];
    if (course.subjects.length > 0) dependencies.push("matières");
    if (course.classes.length > 0) dependencies.push("classes");
    if (course.teachers.length > 0) dependencies.push("enseignants");
    if (course.requiredFor.length > 0)
      dependencies.push("autres cours (prérequis)");

    if (dependencies.length > 0) {
      throw new ActionError(
        `Impossible de supprimer ce cours car il est utilisé par des ${dependencies.join(
          ", "
        )}`
      );
    }

    // Supprimer dans l'ordre pour respecter les contraintes de clé étrangère
    await db.$transaction([
      // Supprimer les matériels associés
      db.courseMaterial.deleteMany({
        where: { course_id: id },
      }),
      // Supprimer les relations de prérequis
      db.coursePrerequisite.deleteMany({
        where: {
          OR: [{ course_id: id }, { prerequisite_id: id }],
        },
      }),
      // Supprimer le cours
      db.course.delete({
        where: { id },
      }),
    ]);

    revalidatePath("/academic/courses");
    return { success: true };
  } catch (error) {
    if (error instanceof ActionError) {
      throw error;
    }
    throw new ActionError("Erreur lors de la suppression du cours");
  }
}

// Créer une matière
export async function createSubject(data: z.infer<typeof subjectSchema>) {
  try {
    const validatedData = subjectSchema.parse(data);

    // Vérifier l'existence du cours
    const course = await db.course.findUnique({
      where: { id: validatedData.course_id },
    });

    if (!course) {
      throw new ActionError("Le cours sélectionné n'existe pas");
    }

    // Vérifier l'unicité du code et du nom
    const existingSubject = await db.subject.findFirst({
      where: {
        OR: [{ code: validatedData.code }, { name: validatedData.name }],
      },
    });

    if (existingSubject) {
      if (existingSubject.code === validatedData.code) {
        throw new ActionError("Une matière avec ce code existe déjà");
      }
      throw new ActionError("Une matière avec ce nom existe déjà");
    }

    const subject = await db.subject.create({
      data: {
        ...validatedData,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        courses: true,
      },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: subject };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ActionError("Données de formulaire invalides");
    }
    if (error instanceof ActionError) {
      throw error;
    }
    throw new ActionError("Erreur lors de la création de la matière");
  }
}

// Mettre à jour une matière
export async function updateSubject(
  id: number,
  data: z.infer<typeof subjectSchema>
) {
  try {
    const validatedData = subjectSchema.parse(data);

    const existingSubject = await db.subject.findUnique({
      where: { id },
    });

    if (!existingSubject) {
      throw new ActionError("Matière non trouvée");
    }

    // Vérifier l'unicité du code et du nom
    const duplicateSubject = await db.subject.findFirst({
      where: {
        OR: [{ code: validatedData.code }, { name: validatedData.name }],
        NOT: { id },
      },
    });

    if (duplicateSubject) {
      if (duplicateSubject.code === validatedData.code) {
        throw new ActionError("Une matière avec ce code existe déjà");
      }
      throw new ActionError("Une matière avec ce nom existe déjà");
    }

    const updatedSubject = await db.subject.update({
      where: { id },
      data: {
        ...validatedData,
        updated_at: new Date(),
      },
      include: {
        courses: true,
      },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: updatedSubject };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ActionError("Données de formulaire invalides");
    }
    if (error instanceof ActionError) {
      throw error;
    }
    throw new ActionError("Erreur lors de la mise à jour de la matière");
  }
}

// Supprimer une matière
export async function deleteSubject(id: number) {
  try {
    const subject = await db.subject.findUnique({
      where: { id }
    });

    if (!subject) {
      throw new ActionError("Matière non trouvée");
    }

   //  // Vérifier les dépendances
   //  const dependencies = [];
   //  if (subject.classes.length > 0) dependencies.push("classes");
   //  if (subject.materials.length > 0) dependencies.push("matériels");

   //  if (dependencies.length > 0) {
   //    throw new ActionError(
   //      `Impossible de supprimer cette matière car elle est utilisée par des ${dependencies.join(
   //        ", "
   //      )}`
   //    );
   //  }

    await db.subject.delete({
      where: { id },
    });

    revalidatePath("/academic/courses");
    return { success: true };
  } catch (error) {
    if (error instanceof ActionError) {
      throw error;
    }
    throw new ActionError("Erreur lors de la suppression de la matière");
  }
}
