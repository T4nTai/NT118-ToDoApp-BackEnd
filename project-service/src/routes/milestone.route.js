import express from "express";
import { MilestoneController } from "../controllers/milestone.controller.js";

const MilestoneRouter = express.Router();

MilestoneRouter.post("/:project_id", MilestoneController.create);
MilestoneRouter.get("/:project_id", MilestoneController.list);

MilestoneRouter.get("/detail/:milestone_id", MilestoneController.detail);
MilestoneRouter.put("/detail/:milestone_id", MilestoneController.update);
MilestoneRouter.delete("/detail/:milestone_id", MilestoneController.delete);

export default MilestoneRouter;
