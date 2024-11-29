import { z } from "zod";

// Schéma de validation Zod pour les informations personnelles
export const schoolSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
    address: z
        .string()
        .min(5, { message: "L'addresse doit comporter au moins 5 caractères" }),
    email: z
        .string()
        .email({ message: "Email invalide" }),
    phone: z
        .string()
        .min(9, { message: "Le numéro de téléphone doit comporter au moins 9 chiffres" }),
});
