import { Router } from "express";
import { TreinamentoController } from "../controllers/TreinamentoController";
import { validateResource } from "../middlewares/validateResource";
import { createTreinamentoSchema, updateTreinamentoSchema } from "../schemas/treinamento.schema";
import multer from "multer";
import { multerConfig } from "../config/multer";

const router = Router();
const upload = multer(multerConfig);

router.post("/", upload.single("arquivo"), validateResource(createTreinamentoSchema), TreinamentoController.create);
router.get("/", TreinamentoController.getAll);
router.get("/:id", TreinamentoController.getById);
router.get("/:id/download", TreinamentoController.download);
router.get("/:id/view", TreinamentoController.view);
router.put("/:id", upload.single("arquivo"), validateResource(updateTreinamentoSchema), TreinamentoController.update);
router.delete("/:id", TreinamentoController.delete);

export default router;
