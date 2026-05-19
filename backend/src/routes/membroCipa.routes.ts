import { Router } from "express";
import { MembroCipaController } from "../controllers/MembroCipaController";
import { validateResource } from "../middlewares/validateResource";
import { createMembroCipaSchema, updateMembroCipaSchema } from "../schemas/membroCipa.schema";

const router = Router();

router.post("/", validateResource(createMembroCipaSchema), MembroCipaController.create);
router.get("/", MembroCipaController.getAll);
router.get("/:id", MembroCipaController.getById);
router.put("/:id", validateResource(updateMembroCipaSchema), MembroCipaController.update);
router.delete("/:id", MembroCipaController.delete);

export default router;
