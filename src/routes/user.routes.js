import { Router } from "express";

export function createUserRouter(controller) {
  const router = Router();

  router.get("/", (req, res) => {
    console.log("get users");
    
    void controller.list(req, res);
  });

  router.get("/:id", (req, res) => {
    void controller.getById(req, res);
  });

  router.post("/", (req, res) => {
    void controller.create(req, res);
  });

  router.put("/:id", (req, res) => {
    void controller.update(req, res);
  });

  router.delete("/:id", (req, res) => {
    void controller.delete(req, res);
  });

  return router;
}
