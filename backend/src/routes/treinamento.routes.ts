import { Router } from "express";
import { TreinamentoController } from "../controllers/TreinamentoController";
import { validateResource } from "../middlewares/validateResource";
import { createTreinamentoSchema, updateTreinamentoSchema } from "../schemas/treinamento.schema";

const router = Router();

router.post("/", validateResource(createTreinamentoSchema), TreinamentoController.create);
router.get("/", TreinamentoController.getAll);
router.get("/:id", TreinamentoController.getById);
router.put("/:id", validateResource(updateTreinamentoSchema), TreinamentoController.update);
router.delete("/:id", TreinamentoController.delete);

export default router;
