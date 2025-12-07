import express from "express";
import { PerformanceController } from "../controllers/performance.controller.js";

const PerformanceRouter = express.Router();

PerformanceRouter.post("/", PerformanceController.create);

PerformanceRouter.get("/project/:project_id", PerformanceController.byProject);
PerformanceRouter.get("/user/:user_id", PerformanceController.byUser);
PerformanceRouter.get("/group/:group_id", PerformanceController.byGroup);

export default PerformanceRouter;