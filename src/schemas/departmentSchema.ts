import { z } from "zod";

// Schéma de validation Zod pour les informations personnelles
export const departmentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  description: z
    .string()
    .optional(),
});
