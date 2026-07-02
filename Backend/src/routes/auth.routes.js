import { Router } from "express";
import { registerController } from "../controllers/auth.controller.js";
import { registerValidation } from "../validator/auth.validation.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, registerController)

export default authRouter;