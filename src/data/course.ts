import { db } from "../lib/prisma";

// Lire les matières
export async function getCourses() {
  return db.course.findMany({
    include: {
      subject: true,
      sourceEquivalences: true,
      prerequisites: true,
      classes: true,
      materials: true,
    },
  });
}

// Lire un matière spécifique
export async function getCourseById(id: number) {
  return db.course.findUnique({
    where: { id },
    // include: {
    //   courses: true,
    //   staff: true,
    //   programs: true,
    // },
  });
}

export async function getCourseByCode(code: string) {
  return db.course.findUnique({
    where: { code },
    include: {
      subject: true,
      sourceEquivalences: true,
      prerequisites: true,
      classes: true,
      materials: true,
    },
  });
}
