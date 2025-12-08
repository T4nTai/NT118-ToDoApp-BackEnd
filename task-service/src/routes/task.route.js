// src/routes/task.route.js
import { Router } from "express";
import { authenticateFromGateway } from "../middleware/auth.gateway.middleware.js";
import { TaskController } from "../controllers/task.controller.js";

const TaskRouter = Router();

TaskRouter.use(authenticateFromGateway);

TaskRouter.post("/", TaskController.create);
TaskRouter.get("/assigned", TaskController.viewTasksAssignToUser);
TaskRouter.get("/created", TaskController.viewTasksCreatedByUser);
TaskRouter.get("/project/:project_id", TaskController.viewTasksInProject);
TaskRouter.get("/milestone/:milestone_id", TaskController.viewTasksByMilestone);
TaskRouter.post("/:task_id/assign", TaskController.assignTask);
TaskRouter.put("/:task_id", TaskController.updateTask);
TaskRouter.delete("/:task_id", TaskController.deleteTask);

export default TaskRouter;
