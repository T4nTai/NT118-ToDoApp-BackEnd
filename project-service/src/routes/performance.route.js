import express from "express";
import { PerformanceController } from "../controllers/performance.controller.js";

const PerformanceRouter = express.Router();


PerformanceRouter.post("/group", PerformanceController.evaluateInGroup);
PerformanceRouter.post("/project", PerformanceController.evaluateInProject);

PerformanceRouter.get("/group/:group_id", PerformanceController.byGroup);
PerformanceRouter.get("/project/:project_id", PerformanceController.byProject);

export default PerformanceRouter;
