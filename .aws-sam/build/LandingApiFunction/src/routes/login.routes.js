import { Router } from "express";

export function createLoginRouter(controller) {
  const router = Router();

  router.post("/login", (req, res) => void controller.login(req, res));
  router.post("/register", (req, res) => void controller.register(req, res));
  router.post("/verify", (req, res) => void controller.verify(req, res));
  router.post("/logout", (req, res) => void controller.logout(req, res));

  return router;
}
