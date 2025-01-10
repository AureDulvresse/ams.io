"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/src/lib/prisma";
import { z } from "zod";
import { courseSchema, courseVersionSchema, enrollmentConstraintSchema, subjectSchema } from "../schemas/course.schema";

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
      data: validatedData,
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

// Archive un cours plutôt que de le supprimer
export async function archiveCourse(id: number, reason: string) {
  try {
    const course = await db.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new ActionError("Cours non trouvé");
    }

    const archivedCourse = await db.course.update({
      where: { id },
      data: {
        status: "archived",
        archived_at: new Date(),
        archive_reason: reason,
      },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: archivedCourse };
  } catch (error) {
    throw new ActionError("Erreur lors de l'archivage du cours");
  }
}

// Créer une nouvelle version d'un cours
export async function createCourseVersion(
  courseId: number,
  data: z.infer<typeof courseVersionSchema>
) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new ActionError("Cours non trouvé");
    }

    // Créer une nouvelle version
    const newVersion = await db.courseVersion.create({
      data: {
        course_id: courseId,
        ...data,
        created_at: new Date(),
      },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: newVersion };
  } catch (error) {
    throw new ActionError("Erreur lors de la création de la nouvelle version");
  }
}

// Dupliquer un cours
export async function duplicateCourse(id: number, newCode: string, newName: string) {
  try {
    const sourceCourse = await db.course.findUnique({
      where: { id },
      include: {
        prerequisites: true,
        subjects: true,
        materials: true,
      },
    });

    if (!sourceCourse) {
      throw new ActionError("Cours source non trouvé");
    }

    // Vérifier l'unicité du nouveau code et nom
    const existingCourse = await db.course.findFirst({
      where: {
        OR: [
          { code: newCode },
          { name: newName },
        ],
      },
    });

    if (existingCourse) {
      throw new ActionError("Un cours avec ce code ou ce nom existe déjà");
    }

    // Créer le nouveau cours avec ses données associées
    const newCourse = await db.$transaction(async (tx) => {
      // Dupliquer le cours principal
      const duplicatedCourse = await tx.course.create({
        data: {
          ...sourceCourse,
          id: undefined,
          code: newCode,
          name: newName,
          created_at: new Date(),
          updated_at: new Date(),
          status: "draft",
        },
      });

      // Dupliquer les matières
      for (const subject of sourceCourse.subjects) {
        await tx.subject.create({
          data: {
            ...subject,
            id: undefined,
            course_id: duplicatedCourse.id,
            code: `${subject.code}_COPY`,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }

      // Dupliquer les matériels
      for (const material of sourceCourse.materials) {
        await tx.courseMaterial.create({
          data: {
            ...material,
            id: undefined,
            course_id: duplicatedCourse.id,
            created_at: new Date(),
          },
        });
      }

      return duplicatedCourse;
    });

    revalidatePath("/academic/courses");
    return { success: true, data: newCourse };
  } catch (error) {
    throw new ActionError("Erreur lors de la duplication du cours");
  }
}

// Gérer les équivalences entre cours
export async function createCourseEquivalence(
  data: z.infer<typeof courseEquivalenceSchema>
) {
  try {
    const { source_course_id, target_course_id } = data;

    // Vérifier l'existence des deux cours
    const [sourceCourse, targetCourse] = await Promise.all([
      db.course.findUnique({ where: { id: source_course_id } }),
      db.course.findUnique({ where: { id: target_course_id } }),
    ]);

    if (!sourceCourse || !targetCourse) {
      throw new ActionError("Un des cours n'existe pas");
    }

    // Vérifier si l'équivalence existe déjà
    const existingEquivalence = await db.courseEquivalence.findFirst({
      where: {
        OR: [
          {
            source_course_id: source_course_id,
            target_course_id: target_course_id,
          },
          {
            source_course_id: target_course_id,
            target_course_id: source_course_id,
          },
        ],
      },
    });

    if (existingEquivalence) {
      throw new ActionError("Une équivalence existe déjà entre ces cours");
    }

    const equivalence = await db.courseEquivalence.create({
      data: {
        ...data,
        created_at: new Date(),
      },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: equivalence };
  } catch (error) {
    throw new ActionError("Erreur lors de la création de l'équivalence");
  }
}

// Gérer les groupes de cours
export async function createCourseGroup(
  data: z.infer<typeof courseGroupSchema>
) {
  try {
    // Vérifier l'existence de tous les cours
    const courses = await db.course.findMany({
      where: {
        id: {
          in: data.course_ids,
        },
      },
    });

    if (courses.length !== data.course_ids.length) {
      throw new ActionError("Certains cours n'existent pas");
    }

    const group = await db.courseGroup.create({
      data: {
        name: data.name,
        description: data.description,
        created_at: new Date(),
        courses: {
          connect: data.course_ids.map(id => ({ id })),
        },
      },
      include: {
        courses: true,
      },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: group };
  } catch (error) {
    throw new ActionError("Erreur lors de la création du groupe");
  }
}

// Gérer les contraintes d'inscription
export async function setEnrollmentConstraints(
  courseId: number,
  data: z.infer<typeof enrollmentConstraintSchema>
) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new ActionError("Cours non trouvé");
    }

    // Vérifier l'existence des cours requis
    if (data.required_courses?.length) {
      const requiredCourses = await db.course.findMany({
        where: {
          id: {
            in: data.required_courses,
          },
        },
      });

      if (requiredCourses.length !== data.required_courses.length) {
        throw new ActionError("Certains cours requis n'existent pas");
      }
    }

    const constraints = await db.enrollmentConstraint.upsert({
      where: {
        course_id: courseId,
      },
      update: {
        ...data,
        updated_at: new Date(),
      },
      create: {
        ...data,
        course_id: courseId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    revalidatePath("/academic/courses");
    return { success: true, data: constraints };
  } catch (error) {
    throw new ActionError("Erreur lors de la définition des contraintes d'inscription");
  }
}

// Valider les prérequis d'un étudiant pour un cours
export async function validatePrerequisites(
  studentId: number,
  courseId: number
): Promise<{ 
  isValid: boolean;
  missingPrerequisites?: Array<{ id: number; name: string }>;
  message: string;
}> {
  try {
    const [course, studentGrades] = await Promise.all([
      db.course.findUnique({
        where: { id: courseId },
        include: {
          prerequisites: {
            include: {
              prerequisite: true,
            },
          },
          enrollmentConstraints: true,
        },
      }),
      db.studentGrade.findMany({
        where: {
          student_id: studentId,
        },
        include: {
          course: true,
        },
      }),
    ]);

    if (!course) {
      throw new ActionError("Cours non trouvé");
    }

    const validationRule = course.enrollmentConstraints?.prerequisites_validation_rule || "all";
    const minGrade = course.enrollmentConstraints?.min_grade || 0;
    const prerequisites = course.prerequisites.map(p => p.prerequisite);
    
    const missingPrerequisites = [];
    let prerequisitesValid = true;

    for (const prerequisite of prerequisites) {
      const grade = studentGrades.find(g => g.course_id === prerequisite.id);
      
      if (!grade || grade.grade < minGrade) {
        missingPrerequisites.push({
          id: prerequisite.id,
          name: prerequisite.name,
        });
        if (validationRule === "all") {
          prerequisitesValid = false;
          break;
        }
      } else if (validationRule === "any") {
        prerequisitesValid = true;
        break;
      }
    }

    return {
      isValid: prerequisitesValid && missingPrerequisites.length === 0,
      missingPrerequisites: missingPrerequisites.length > 0 ? missingPrerequisites : undefined,
      message: prerequisitesValid 
        ? "Tous les prérequis sont validés"
        : "Certains prérequis ne sont pas validés",
    };
  } catch (error) {
    throw new ActionError("Erreur lors de la validation des prérequis");
  }
}

// Recherche avancée de cours
export async function searchCourses(params: {
  query?: string;
  department_id?: number;
  status?: string;
  creditRange?: { min?: number; max?: number };
  level?: string;
  hasPrerequisites?: boolean;
  teacher_id?: number;
  groupId?: number;
  page?: number;
  limit?: number;
}) {
  try {
    const {
      query,
      department_id,
      status,
      creditRange,
      level,
      hasPrerequisites,
      teacher_id,
      groupId,
      page = 1,
      limit = 10,
    } = params;

    const where: any = {};

    // Construire les conditions de recherche
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (department_id) {
      where.department_id = department_id;
    }

    if (status) {
      where.status = status;
    }

    if (level) {
      where.level = level;
    }

    if (creditRange) {
      where.credits = {};
      if (creditRange.min !== undefined) {
        where.credits.gte = creditRange.min;
      }
      if (creditRange.max !== undefined) {
        where.credits.lte = creditRange.max;
      }
    }

    if (hasPrerequisites !== undefined) {
      where.prerequisites = hasPrerequisites
        ? { some: {} }
        : { none: {} };
    }

    if (teacher_id) {
      where.teachers = {
        some: {
          teacher_id,
        },
      };
    }

    if (groupId) {
      where.groups = {
        some: {
          group_id: groupId,
        },
      };
    }

    // Exécuter la recherche avec pagination
    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        include: {
          department: true,
          prerequisites: {
            include: {
              prerequisite: true,
            },
          },
          teachers: {
            include: {
              course: true,
            },
          },
          groups: {
            include: {
              group: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      db.course.count({ where }),
    ]);

    return {
      success: true,
      data: {
        courses,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          current: page,
          limit,
        },
      },
    };
  } catch (error) {
    throw new ActionError("Erreur lors de la recherche des cours");
  }
}