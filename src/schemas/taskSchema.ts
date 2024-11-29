import { z } from "zod";

export const taskSchema = z.object({
    title: z
        .string()
        .min(2, { message: "Le titre doit comporter au moins 2 caractères" }),
    description: z
        .string()
        .optional(),
    repeat: z
        .number()
        .min(1, "Une tâche doit se faire au moins une fois."),

});
