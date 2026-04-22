import { z } from "zod";

/** Valida el cuerpo JSON: email con formato correcto,etc. (capa controllers) */
export const createLeadBodySchema = z.object({
  email: z.string().min(1, "email es obligatorio").email("email no válido"),
  message: z.string().min(1, "message es obligatorio"),
});

export type CreateLeadBody = z.infer<typeof createLeadBodySchema>;
