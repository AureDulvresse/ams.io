import { z } from "zod";

export const courseSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  code: z
    .string()
    .min(2, "Le code doit contenir au moins 2 caractères")
    .max(20, "Le code ne peut pas dépasser 20 caractères"),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
  credits: z
    .number()
    .min(0, "Le nombre de crédits ne peut pas être négatif")
    .max(100, "Le nombre de crédits ne peut pas dépasser 100"),
  subject_id: z.number().positive("Veuillez sélectionner un département"),
  prerequisites: z.array(z.number()).optional(),
});

// Schémas de validation supplémentaires
export const courseVersionSchema = z.object({
  version: z.string(),
  changes: z.string(),
  effective_date: z.date(),
});

export const courseEquivalenceSchema = z.object({
  source_course_id: z.number(),
  target_course_id: z.number(),
  equivalence_type: z.enum(["full", "partial"]),
  notes: z.string().optional(),
});

export const courseGroupSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  course_ids: z.array(z.number()),
});

export const enrollmentConstraintSchema = z.object({
  course_id: z.number(),
  min_grade: z.number().optional(),
  min_credits: z.number().optional(),
  required_courses: z.array(z.number()).optional(),
  max_students: z.number().optional(),
  prerequisites_validation_rule: z.enum(["all", "any"]).optional(),
});
