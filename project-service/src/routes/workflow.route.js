import express from "express";
import { WorkflowController } from "../controllers/workflow.controller.js";

const WorkflowRouter = express.Router();

WorkflowRouter.post("/:project_id", WorkflowController.create);
WorkflowRouter.post("/step/:workflow_id", WorkflowController.addStep);
WorkflowRouter.get("/step/:workflow_id", WorkflowController.getSteps);

export default WorkflowRouter;