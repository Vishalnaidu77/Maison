import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { config } from "./config/config.js";
import productRouter from "./routes/product.route.js";
import CookieParser from 'cookie-parser'

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(CookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())

passport.use(new GoogleStrategy({
	clientID: config.CLIENT_ID,
	clientSecret: config.CLIENT_SECRET,
	callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
	return done(null, profile)
}))

app.get("/", (req, res) => {
	res.json({ message: "API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter)

export default app;
