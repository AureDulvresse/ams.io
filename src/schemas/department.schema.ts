import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().min(1, "Le code est requis"),
  type: z.enum(["academic", "administrative", "service"], {
    required_error: "Type invalide",
  }),
  description: z.string().optional(),
});
