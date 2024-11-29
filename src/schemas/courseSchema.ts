import { z } from "zod";

// Schéma de validation pour un cours
export const courseSchema = z.object({
    name: z
        .string()
        .min(1, "Le nom du cours est requis.")
        .max(100, "Le nom du cours ne doit pas dépasser 100 caractères."),

    description: z
        .string()
        .optional(),
        
    credits: z
        .number()
        .min(1, "Le nombre de crédits doit être d'au moins 1.")
        .max(30, "Le nombre de crédits ne peut pas dépasser 30."),

    department_id: z
        .number()
        .min(1, "Le département est requis.")
        .int("L'identifiant du département doit être un nombre entier."),
});

export type CourseSchema = z.infer<typeof courseSchema>;
