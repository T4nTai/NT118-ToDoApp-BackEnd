import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { groupProxy } from "../proxy/group.proxy.js";

const groupRoutes = Router();

groupRoutes.use("/group", authMiddleware, groupProxy);

export default groupRoutes;
