import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import {
  createSubtask,
  viewSubtaskByTask,
  updateSubtask
} from "../controllers/subtask.controller.js";

const SubTaskRouter = Router();

SubTaskRouter.get("/task/:task_id", authenticateJWT, viewSubtaskByTask );

SubTaskRouter.post("/task/:task_id", authenticateJWT, createSubtask );

SubTaskRouter.patch("/:subtask_id", authenticateJWT, updateSubtask );

export default SubTaskRouter;
