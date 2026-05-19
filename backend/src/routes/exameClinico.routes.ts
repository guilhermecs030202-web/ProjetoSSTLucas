import { Router } from "express";
import { ExameClinicoController } from "../controllers/ExameClinicoController";
import { validateResource } from "../middlewares/validateResource";
import { createExameClinicoSchema, updateExameClinicoSchema } from "../schemas/exameClinico.schema";

const router = Router();

router.post("/", validateResource(createExameClinicoSchema), ExameClinicoController.create);
router.get("/", ExameClinicoController.getAll);
router.get("/:id", ExameClinicoController.getById);
router.put("/:id", validateResource(updateExameClinicoSchema), ExameClinicoController.update);
router.delete("/:id", ExameClinicoController.delete);

export default router;
