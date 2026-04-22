import express from "express";
import { LeadController } from "../controllers/lead.controller.js";
import type { LeadService } from "../services/lead.service.js";
import { createLeadRouter } from "./lead.routes.js";

export function createApp(service: LeadService): express.Application {
  const app = express();
  app.use(express.json());

  const leadController = new LeadController(service);
  app.use("/api/leads", createLeadRouter(leadController));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
