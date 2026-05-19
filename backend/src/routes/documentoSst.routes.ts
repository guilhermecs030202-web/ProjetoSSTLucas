import { Router } from "express";
import { DocumentoSstController } from "../controllers/DocumentoSstController";
import { validateResource } from "../middlewares/validateResource";
import { createDocumentoSstSchema, updateDocumentoSstSchema } from "../schemas/documentoSst.schema";

const router = Router();

router.post("/", validateResource(createDocumentoSstSchema), DocumentoSstController.create);
router.get("/", DocumentoSstController.getAll);
router.get("/:id", DocumentoSstController.getById);
router.put("/:id", validateResource(updateDocumentoSstSchema), DocumentoSstController.update);
router.delete("/:id", DocumentoSstController.delete);

export default router;
