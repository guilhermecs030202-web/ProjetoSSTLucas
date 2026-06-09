import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateResource } from "../middlewares/validateResource";
import { loginSchema, changeCredentialsSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/login", validateResource(loginSchema), AuthController.login);
router.post("/change-credentials", validateResource(changeCredentialsSchema), AuthController.changeCredentials);

export default router;
