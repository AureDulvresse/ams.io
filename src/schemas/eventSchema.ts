import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Le titre doit comporter au moins 2 caractères" }),
  description: z
    .string()
    .optional(),
  date: z.string().refine((value) => new Date(value) > new Date(), {
        message: "La date de debut ne peut pas être dans le passé",
  }),
  duration : z
    .number()
    .min(1, "La durée d'un évènement doit être d'au moins 1 jour."),
        
  location: z
    .string()
    .min(2, {message: "Le lieu doit comporter au moins 2 caractères"}),
});
