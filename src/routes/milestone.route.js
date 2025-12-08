import express from "express";
import { MilestoneController } from "../controllers/milestone.controller.js";

const MilestoneRouter = express.Router();


MilestoneRouter.post("/", MilestoneController.create);


MilestoneRouter.get("/project/:project_id", MilestoneController.getByProject);


MilestoneRouter.get("/:milestone_id", MilestoneController.detail);


MilestoneRouter.put("/:milestone_id", MilestoneController.update);


MilestoneRouter.patch("/:milestone_id/complete", MilestoneController.complete);


MilestoneRouter.delete("/:milestone_id", MilestoneController.delete);

export default MilestoneRouter;
