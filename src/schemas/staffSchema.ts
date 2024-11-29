import { z } from "zod";

// Schéma de validation Zod pour les informations personnelles
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit comporter au moins 2 caractères" }),
  lastName: z
    .string()
    .min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  dob: z.string().refine((value) => new Date(value) < new Date(), {
    message: "La date de naissance ne peut pas être dans le futur",
  }),
  pob: z.string().min(2, { message: "Le lieu de naissance est requis" }),
  address: z
    .string()
    .min(5, { message: "L'adresse doit comporter au moins 5 caractères" }),
  phone: z.string().regex(/^[0-9]{9}$/, {
    message: "Le numéro de téléphone doit comporter 9 chiffres",
  }),
  email: z.string().email({ message: "Email invalide" }),
  gender: z.enum(["M", "F"], { message: "Le sexe est requis" }),
});


export const administrativeInfoSchema = z.object({
  department_id: z.number().min(1, "Veuillez sélectionner un departement.").optional(),
  year: z.string().optional(),
  paymentMode: z.number().min(1, "Veuillez sélectionner un mode de paiement")
});
