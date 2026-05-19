import { Router } from "express";
import { CompraEpiController } from "../controllers/CompraEpiController";
import { validateResource } from "../middlewares/validateResource";
import { createCompraEpiSchema, updateCompraEpiSchema } from "../schemas/compraEpi.schema";

const router = Router();

router.post("/", validateResource(createCompraEpiSchema), CompraEpiController.create);
router.get("/", CompraEpiController.getAll);
router.get("/:id", CompraEpiController.getById);
router.put("/:id", validateResource(updateCompraEpiSchema), CompraEpiController.update);
router.delete("/:id", CompraEpiController.delete);

export default router;
