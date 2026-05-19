import { Router } from "express";
import { CargoController } from "../controllers/CargoController";
import { validateResource } from "../middlewares/validateResource";
import { createCargoSchema, updateCargoSchema } from "../schemas/cargo.schema";

const router = Router();

router.post("/", validateResource(createCargoSchema), CargoController.create);
router.get("/", CargoController.getAll);
router.get("/:id", CargoController.getById);
router.put("/:id", validateResource(updateCargoSchema), CargoController.update);
router.delete("/:id", CargoController.delete);

export default router;
