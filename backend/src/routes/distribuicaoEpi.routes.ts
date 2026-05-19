import { Router } from "express";
import { DistribuicaoEpiController } from "../controllers/DistribuicaoEpiController";
import { validateResource } from "../middlewares/validateResource";
import { createDistribuicaoEpiSchema, updateDistribuicaoEpiSchema } from "../schemas/distribuicaoEpi.schema";

const router = Router();

router.post("/", validateResource(createDistribuicaoEpiSchema), DistribuicaoEpiController.create);
router.get("/", DistribuicaoEpiController.getAll);
router.get("/:id", DistribuicaoEpiController.getById);
router.put("/:id", validateResource(updateDistribuicaoEpiSchema), DistribuicaoEpiController.update);
router.delete("/:id", DistribuicaoEpiController.delete);

export default router;
