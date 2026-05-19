import { Router } from "express";
import { AsoController } from "../controllers/AsoController";
import { validateResource } from "../middlewares/validateResource";
import { createAsoSchema, updateAsoSchema } from "../schemas/aso.schema";

const router = Router();

router.post("/", validateResource(createAsoSchema), AsoController.create);
router.get("/", AsoController.getAll);
router.get("/:id", AsoController.getById);
router.put("/:id", validateResource(updateAsoSchema), AsoController.update);
router.delete("/:id", AsoController.delete);

export default router;
