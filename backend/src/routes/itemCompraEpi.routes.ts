import { Router } from "express";
import { ItemCompraEpiController } from "../controllers/ItemCompraEpiController";
import { validateResource } from "../middlewares/validateResource";
import { createItemCompraEpiSchema, updateItemCompraEpiSchema } from "../schemas/itemCompraEpi.schema";

const router = Router();

router.post("/", validateResource(createItemCompraEpiSchema), ItemCompraEpiController.create);
router.get("/", ItemCompraEpiController.getAll);
router.get("/:id", ItemCompraEpiController.getById);
router.put("/:id", validateResource(updateItemCompraEpiSchema), ItemCompraEpiController.update);
router.delete("/:id", ItemCompraEpiController.delete);

export default router;
