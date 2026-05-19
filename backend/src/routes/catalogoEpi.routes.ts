import { Router } from "express";
import { CatalogoEpiController } from "../controllers/CatalogoEpiController";
import { validateResource } from "../middlewares/validateResource";
import { createCatalogoEpiSchema, updateCatalogoEpiSchema } from "../schemas/catalogoEpi.schema";

const router = Router();

router.post("/", validateResource(createCatalogoEpiSchema), CatalogoEpiController.create);
router.get("/", CatalogoEpiController.getAll);
router.get("/:id", CatalogoEpiController.getById);
router.put("/:id", validateResource(updateCatalogoEpiSchema), CatalogoEpiController.update);
router.delete("/:id", CatalogoEpiController.delete);

export default router;
