import { Router } from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";
import { registerValidation } from "../validator/auth.validation.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, registerController)
authRouter.post("/login", loginController)

export default authRouter;