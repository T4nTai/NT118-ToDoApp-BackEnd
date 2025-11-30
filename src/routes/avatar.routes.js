import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { updateAvatar, deleteAvatar, getAvatar } from "../controllers/avatar.controller.js";

const AvatarRouter = Router();

AvatarRouter.put("/avatar", authenticateJWT, updateAvatar);
AvatarRouter.delete("/avatar", authenticateJWT, deleteAvatar);
AvatarRouter.get("/avatar", authenticateJWT, getAvatar);

export default AvatarRouter;