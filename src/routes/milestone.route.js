import express from "express";
import { MilestoneController } from "../controllers/milestone.controller.js";

const MilestoneRouter = express.Router();

// Tạo milestone
MilestoneRouter.post("/", MilestoneController.create);

// Lấy danh sách milestone theo project_id
MilestoneRouter.get("/project/:project_id", MilestoneController.getByProject);

// Lấy chi tiết milestone
MilestoneRouter.get("/:milestone_id", MilestoneController.detail);

// Cập nhật milestone
MilestoneRouter.put("/:milestone_id", MilestoneController.update);

// Đánh dấu hoàn thành milestone
MilestoneRouter.patch("/:milestone_id/complete", MilestoneController.complete);

// Xóa milestone
MilestoneRouter.delete("/:milestone_id", MilestoneController.delete);

export default MilestoneRouter;
