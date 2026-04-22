import type { Request, Response } from "express";
import { ZodError } from "zod";
import type { LeadService } from "../services/lead.service.js";
import { createLeadBodySchema } from "./lead.schemas.js";

export class LeadController {
  constructor(private readonly service: LeadService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = createLeadBodySchema.parse(req.body);
      const result = await this.service.createLead(body);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof ZodError) {
        const first = err.issues[0];
        res
          .status(400)
          .json({ error: first ? `${first.path.join(".")}: ${first.message}` : "Entrada inválida" });
        return;
      }
      const msg = err instanceof Error ? err.message : "Error desconocido";
      res.status(400).json({ error: msg });
    }
  };
}
