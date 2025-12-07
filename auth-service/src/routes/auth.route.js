import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", AuthController.register);

AuthRouter.post("/login", AuthController.login);

AuthRouter.post("/refresh", AuthController.refresh);

AuthRouter.get("/users/:user_id", AuthController.getUserById);

AuthRouter.post("/logout", AuthController.logout);

export default AuthRouter;
