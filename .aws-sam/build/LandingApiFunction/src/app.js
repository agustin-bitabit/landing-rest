import cors from "cors";
import express from "express";
import { getCorsOptions } from "./routes/cors-options.js";

import { TestimonialController } from "./controllers/testimonial.controller.js";
import { createTestimonialRouter } from "./routes/testimonial.routes.js";
import { UserController } from "./controllers/user.controller.js";
import { createUserRouter } from "./routes/user.routes.js";
import { LoginController} from "./controllers/login.controller.js";
import { createLoginRouter } from "./routes/login.routes.js";

export function createApp(testimonialService, userService, loginService) {
  const app = express();

  app.use(cors(getCorsOptions()));
  app.use(express.json());

  const testimonialController = new TestimonialController(testimonialService);
  const userController = new UserController(userService);
  const loginController = new LoginController(loginService);

  app.use("/api/testimonials", createTestimonialRouter(testimonialController));
  app.use("/api/users", createUserRouter(userController));
  app.use("/api", createLoginRouter(loginController));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
