import { Router } from "express";

export function createTestimonialRouter(controller) {
  const router = Router();
  router.get("/", (req, res) => {
    void controller.list(req, res);
  });
  return router;
}
