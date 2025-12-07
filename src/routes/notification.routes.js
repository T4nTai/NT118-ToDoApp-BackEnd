import express from "express";
import { NotificationController } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", NotificationController.list);
router.patch("/:id/read", NotificationController.markRead);
router.patch("/read-all", NotificationController.markAll);
router.delete("/:id", NotificationController.delete);

export default router;
