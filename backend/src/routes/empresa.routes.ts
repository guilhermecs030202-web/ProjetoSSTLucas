import { Router } from "express";
import { EmpresaController } from "../controllers/EmpresaController";
import { validateResource } from "../middlewares/validateResource";
import { createEmpresaSchema, updateEmpresaSchema } from "../schemas/empresa.schema";

const router = Router();

router.post("/", validateResource(createEmpresaSchema), EmpresaController.create);
router.get("/", EmpresaController.getAll);
router.get("/:id", EmpresaController.getById);
router.put("/:id", validateResource(updateEmpresaSchema), EmpresaController.update);
router.delete("/:id", EmpresaController.delete);

export default router;
