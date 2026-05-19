import { Router } from "express";
import { FuncionarioController } from "../controllers/FuncionarioController";
import { validateResource } from "../middlewares/validateResource";
import { createFuncionarioSchema, updateFuncionarioSchema } from "../schemas/funcionario.schema";

const router = Router();

router.post("/", validateResource(createFuncionarioSchema), FuncionarioController.create);
router.get("/", FuncionarioController.getAll);
router.get("/:id", FuncionarioController.getById);
router.put("/:id", validateResource(updateFuncionarioSchema), FuncionarioController.update);
router.delete("/:id", FuncionarioController.delete);

export default router;
