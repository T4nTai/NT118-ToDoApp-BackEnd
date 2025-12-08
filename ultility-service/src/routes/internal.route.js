import { Router } from "express";
import { internalMiddleware } from "../middleware/internal.middleware.js";
import { FileInternalController } from "../controllers/internal.controller.js";

const InternalRouter = Router();

InternalRouter.use(internalMiddleware);

InternalRouter.post("/", FileInternalController.create);

InternalRouter.get("/:file_id", FileInternalController.detail);

InternalRouter.get("/by-context/search", FileInternalController.byContext);

export default InternalRouter;
