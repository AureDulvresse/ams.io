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
  department_id: z.number().positive("Veuillez sélectionner un département"),
  prerequisites: z.array(z.number()).optional(),
});

export const subjectSchema = z.object({
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
  course_id: z.number().positive("Veuillez sélectionner un cours"),
});
