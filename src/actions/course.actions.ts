"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/src/lib/prisma";
import { z } from "zod";
import {
  courseEquivalenceSchema,
  courseGroupSchema,
  courseSchema,
  courseVersionSchema,
  enrollmentConstraintSchema,
} from "../schemas/course.schema";
import { PaginationParams } from "../types/custom-props";

export interface SearchCoursesParams extends PaginationParams {
  query?: string;
  subject_id?: number;
  status?: string;
  creditRange?: { min?: number; max?: number };
  level?: string;
  hasPrerequisites?: boolean;
  teacher_id?: number;
  groupId?: number;
}

class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

// Validation helper
async function validateDepartment(id: number) {
  const department = await db.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new ActionError("Le département sélectionné n'existe pas");
  }

  return department;
}

export async function createCourse(data: z.infer<typeof courseSchema>) {
  try {
    const validatedData = courseSchema.parse(data);
    const { prerequisites, ...courseData } = validatedData;

    await validateDepartment(courseData.subject_id);

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
    if (prerequisites?.length) {
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

    // Utiliser une transaction
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

      return tx.course.findUnique({
        where: { id: newCourse.id },
        include: {
          prerequisites: {
            include: {
              prerequisite: true,
            },
          },
          department: true,
        },
      });
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

// Valider les prérequis d'un étudiant pour un cours
export async function validatePrerequisites(
  studentId: number,
  courseId: number
): Promise<{
  isValid: boolean;
  missingPrerequisites?: Array<{ id: number; name: string; grade?: number }>;
  message: string;
}> {
  try {
    // Vérifier l'existence de l'étudiant
    const student = await db.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new ActionError("Étudiant non trouvé");
    }

    const [course, studentGrades] = await Promise.all([
      db.course.findUnique({
        where: { id: courseId },
        include: {
          prerequisites: {
            include: {
              prerequisite: true,
            },
          },
          enrollmentConstraints: {
            include: {
              required_courses: true,
            },
          },
        },
      }),
      db.grade.findMany({
        where: {
          enrollment: {
            student_id: studentId,
          },
        },
        include: {
          enrollment: {
            include: {
              class: true,
            },
          },
        },
      }),
    ]);

    if (!course) {
      throw new ActionError("Cours non trouvé");
    }

    const constraints = course.enrollmentConstraints?.[0];
    const validationRule = constraints?.prerequisites_validation_rule || "all";
    const minGrade = constraints?.min_grade || 0;

    const prerequisites = course.prerequisites.map((p) => p.prerequisite);
    const missingPrerequisites: Array<{
      id: number;
      name: string;
      grade?: number;
    }> = [];

    let prerequisitesValid = validationRule === "any" ? false : true;

    for (const prerequisite of prerequisites) {
      const grade = studentGrades.find(
        (g) => g.enrollment.class_id === prerequisite.id
      );

      if (!grade || grade.final_grade < minGrade) {
        missingPrerequisites.push({
          id: prerequisite.id,
          name: prerequisite.name,
          grade: grade?.final_grade,
        });

        if (validationRule === "all") {
          prerequisitesValid = false;
        }
      } else if (validationRule === "any") {
        prerequisitesValid = true;
        break;
      }
    }

    // Vérifier les cours requis additionnels
    if (constraints?.required_courses.length) {
      for (const requiredCourse of constraints.required_courses) {
        const grade = studentGrades.find(
          (g) => g.enrollment.class_id === requiredCourse.course_id
        );

        if (!grade || grade.final_grade < minGrade) {
          const course = await db.course.findUnique({
            where: { id: requiredCourse.course_id },
          });

          if (course) {
            missingPrerequisites.push({
              id: course.id,
              name: course.name,
              grade: grade?.final_grade,
            });
          }
          prerequisitesValid = false;
        }
      }
    }

    return {
      isValid: prerequisitesValid,
      missingPrerequisites:
        missingPrerequisites.length > 0 ? missingPrerequisites : undefined,
      message: prerequisitesValid
        ? "Tous les prérequis sont validés"
        : "Certains prérequis ne sont pas validés",
    };
  } catch (error) {
    if (error instanceof ActionError) {
      throw error;
    }
    throw new ActionError("Erreur lors de la validation des prérequis");
  }
}

// Recherche avancée de cours avec typage amélioré
export async function searchCourses(params: SearchCoursesParams) {
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

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { code: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
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
      where.credits = {
        ...(creditRange.min !== undefined && { gte: creditRange.min }),
        ...(creditRange.max !== undefined && { lte: creditRange.max }),
      };
    }

    if (hasPrerequisites !== undefined) {
      where.prerequisites = {
        [hasPrerequisites ? "some" : "none"]: {},
      };
    }

    if (teacher_id) {
      where.teachers = {
        some: { teacher_id },
      };
    }

    if (groupId) {
      where.groups = {
        some: { group_id: groupId },
      };
    }

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
          teachers: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
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
