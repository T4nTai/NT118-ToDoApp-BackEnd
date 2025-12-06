import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { signUp, signIn, signOut,getUserById ,resetPassword, forgotPassword, updateUserProfile, checkResetToken, refreshToken, githubCallback, githubSignIn, createAdminAccount } from "../controllers/auth.controller.js";   
const AuthRouter = Router();

AuthRouter.post("/sign-up", signUp);

AuthRouter.post("/sign-in", signIn);

AuthRouter.post("/sign-out", authenticateJWT, signOut);

AuthRouter.post("/forgot-password", forgotPassword);

AuthRouter.post("/reset-password", resetPassword);

AuthRouter.get ("/user-info",authenticateJWT, getUserById);

AuthRouter.post("/check-reset-token", checkResetToken);

AuthRouter.put ("/update-profile",authenticateJWT, updateUserProfile);

AuthRouter.post ("/refresh", refreshToken);

AuthRouter.get("/github/sign-in", githubSignIn);

AuthRouter.get("/github/callback", githubCallback);

AuthRouter.post("/create-admin", createAdminAccount);

export default AuthRouter;
