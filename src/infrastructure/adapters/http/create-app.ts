import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SubmitContactUseCase } from "../../../application/use-cases/submit-contact.use-case.js";
import { createContactRouter } from "./contact.router.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp(submitContact: SubmitContactUseCase): express.Application {
  const app = express();

  app.use(express.json());

  const publicDir = path.resolve(__dirname, "../../../../public");
  app.use(express.static(publicDir));

  app.use("/api/contact", createContactRouter(submitContact));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  return app;
}
