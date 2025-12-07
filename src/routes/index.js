import Router from 'express';
import AuthRouter from './auth.routes.js';
import TaskRouter from './task.routes.js';
import GroupRouter from './group.routes.js';
import ProjectRouter from './project.routes.js';
import PerformanceRouter from './performance.routes.js';
import SubTaskRouter from './subtask.route.js';
import CommentRouter from './comment.routes.js';
import WorkspaceRouter from './workspace.routes.js';
import MilestoneRouter from './milestone.route.js';
import NotificationRouter from "./notification.routes.js";

const router = Router();

router.use("/auth", AuthRouter);


router.use("/tasks", TaskRouter);


router.use("/projects", ProjectRouter);


router.use("/groups", GroupRouter);


router.use("/performance", PerformanceRouter);


router.use("/subtask", SubTaskRouter);


router.use("/comments", CommentRouter);

router.use("/workspaces", WorkspaceRouter);

router.use("/milestones", MilestoneRouter);

router.use("/notifications", NotificationRouter);


export default router;