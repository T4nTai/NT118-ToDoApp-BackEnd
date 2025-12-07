import { Router } from "express";
import { authProxy } from "../proxy/auth.proxy.js";

const authRoutes = Router();
authRoutes.use("/auth", authProxy);

export default authRoutes;