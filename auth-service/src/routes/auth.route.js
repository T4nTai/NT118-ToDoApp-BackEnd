import { Router } from "express";
import { register, login, refreshToken } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/refresh", refreshToken);

export default authRoutes;
