import { Router } from "express";
import { AcidenteTrabalhoController } from "../controllers/AcidenteTrabalhoController";
import { validateResource } from "../middlewares/validateResource";
import { createAcidenteTrabalhoSchema, updateAcidenteTrabalhoSchema } from "../schemas/acidenteTrabalho.schema";
import multer from "multer";
import { multerConfig } from "../config/multer";

const router = Router();
const upload = multer(multerConfig);

router.post("/", upload.single("arquivo"), validateResource(createAcidenteTrabalhoSchema), AcidenteTrabalhoController.create);
router.get("/", AcidenteTrabalhoController.getAll);
router.get("/:id", AcidenteTrabalhoController.getById);
router.get("/:id/download", AcidenteTrabalhoController.download);
router.get("/:id/view", AcidenteTrabalhoController.view);
router.put("/:id", upload.single("arquivo"), validateResource(updateAcidenteTrabalhoSchema), AcidenteTrabalhoController.update);
router.delete("/:id", AcidenteTrabalhoController.delete);

export default router;
