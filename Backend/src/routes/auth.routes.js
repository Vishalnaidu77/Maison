import { Router } from "express";
import { getMeController, googleCallback, loginController, registerController } from "../controllers/auth.controller.js";
import { registerValidation } from "../validator/auth.validation.js";
import passport from "passport";
import { config } from "../config/config.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, registerController)
authRouter.post("/login", loginController)
authRouter.get("/google", 
    passport.authenticate("google", { scope: ["profile", "email"]}))

authRouter.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login" }),
    googleCallback
)

authRouter.get("/get-me", verifyUser, getMeController)

export default authRouter;