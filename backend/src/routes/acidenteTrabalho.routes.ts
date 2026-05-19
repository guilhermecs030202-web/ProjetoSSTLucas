import { Router } from "express";
import { AcidenteTrabalhoController } from "../controllers/AcidenteTrabalhoController";
import { validateResource } from "../middlewares/validateResource";
import { createAcidenteTrabalhoSchema, updateAcidenteTrabalhoSchema } from "../schemas/acidenteTrabalho.schema";

const router = Router();

router.post("/", validateResource(createAcidenteTrabalhoSchema), AcidenteTrabalhoController.create);
router.get("/", AcidenteTrabalhoController.getAll);
router.get("/:id", AcidenteTrabalhoController.getById);
router.put("/:id", validateResource(updateAcidenteTrabalhoSchema), AcidenteTrabalhoController.update);
router.delete("/:id", AcidenteTrabalhoController.delete);

export default router;
