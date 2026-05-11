import cors from "cors";
import express from "express";
import { TestimonialController } from "./controllers/testimonial.controller.js";
import { getCorsOptions } from "./routes/cors-options.js";
import { createTestimonialRouter } from "./routes/testimonial.routes.js";

export function createApp(testimonialService) {
  const app = express();

  app.use(cors(getCorsOptions()));
  app.use(express.json());

  const testimonialController = new TestimonialController(testimonialService);
  app.use("/api/testimonials", createTestimonialRouter(testimonialController));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
