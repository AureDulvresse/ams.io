import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string({ required_error: "Le nom est obligatoire" })
    .min(1, "Le nom est obligatoire"),
  description: z.string().optional(),
  permissionIds: z.array(
    z.number({
      required_error: "Chaque permission doit avoir id valide",
    })
  ),
});
