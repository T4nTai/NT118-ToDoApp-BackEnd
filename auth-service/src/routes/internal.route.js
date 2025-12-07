import { Router } from "express";
import { internalMiddleware } from "../middleware/internal.middleware.js";
import {
  internalGetUserById,
  internalGetUserByEmail,
  internalGetUserByPhone
} from "../controllers/internal.controller.js";

const internalRoutes = Router();

internalRoutes.use(internalMiddleware);

internalRoutes.get("/users/:user_id", internalGetUserById);
internalRoutes.get("/users", internalGetUserByEmail);
internalRoutes.get("/users", internalGetUserByPhone); 

export default internalRoutes;