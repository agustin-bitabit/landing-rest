import { Router, type Request, type Response } from "express";
import type { SubmitContactUseCase } from "../../../application/use-cases/submit-contact.use-case.js";

/**
 * Adaptador primario (driving): HTTP → caso de uso.
 */
export function createContactRouter(useCase: SubmitContactUseCase): Router {
  const router = Router();

  router.post("/", async (req: Request, res: Response) => {
    try {
      const email = typeof req.body?.email === "string" ? req.body.email : "";
      const message =
        typeof req.body?.message === "string" ? req.body.message : "";
      const result = await useCase.execute({ email, message });
      res.status(201).json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      res.status(400).json({ error: msg });
    }
  });

  return router;
}
