import { Router } from "express";
import { DocumentoSstController } from "../controllers/DocumentoSstController";
import { validateResource } from "../middlewares/validateResource";
import { createDocumentoSstSchema, updateDocumentoSstSchema } from "../schemas/documentoSst.schema";
import multer from "multer";
import { multerConfig } from "../config/multer";

const router = Router();
const upload = multer(multerConfig);

router.post("/", upload.single("arquivo"), validateResource(createDocumentoSstSchema), DocumentoSstController.create);
router.get("/", DocumentoSstController.getAll);
router.get("/:id", DocumentoSstController.getById);
router.get("/:id/download", DocumentoSstController.download);
router.get("/:id/view", DocumentoSstController.view);
router.put("/:id", upload.single("arquivo"), validateResource(updateDocumentoSstSchema), DocumentoSstController.update);
router.delete("/:id", DocumentoSstController.delete);

export default router;
