import { Router } from "express";
import type { LeadController } from "../controllers/lead.controller.js";

export function createLeadRouter(controller: LeadController): Router {
  const router = Router();
  router.post("/", (req, res) => {
    void controller.create(req, res);
  });
  return router;
}
