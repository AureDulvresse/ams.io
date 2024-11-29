import { z } from "zod";

export const levelStudySchema = z.object({
    designation: z
        .string()
        .min(2, { message: "La designation doit comporter au moins 2 caractères" }),
    description: z
        .string()
        .optional(),
});
