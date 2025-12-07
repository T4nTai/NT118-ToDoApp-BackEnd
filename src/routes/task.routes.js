import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { viewTasksAssignToUser,viewTasksCreatedByUser ,createTask, assignTask, deleteTask, updateTask, viewTasksInProject, viewTasksByMilestone } from "../controllers/task.controller.js";

const TaskRouter = Router();

TaskRouter.get("/user-tasks", authenticateJWT, viewTasksAssignToUser);

TaskRouter.get("/created-by-me", authenticateJWT, viewTasksCreatedByUser);

TaskRouter.post("/create", authenticateJWT, createTask);

TaskRouter.post("/:task_id/assign", authenticateJWT, assignTask);

TaskRouter.patch("/:task_id", authenticateJWT, updateTask);

TaskRouter.delete("/:task_id", authenticateJWT, deleteTask);

TaskRouter.get("/projects/:project_id/tasks", authenticateJWT, viewTasksInProject);

TaskRouter.get("/:milestone_id/views", authenticateJWT, viewTasksByMilestone);

export default TaskRouter;