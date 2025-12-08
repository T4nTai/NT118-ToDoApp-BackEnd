// src/routes/comment.route.js
import { Router } from "express";
import { authenticateFromGateway } from "../middleware/auth.gateway.middleware.js";
import { CommentController } from "../controllers/comment.controller.js";

const CommentRouter = Router();

CommentRouter.use(authenticateFromGateway);

CommentRouter.post("/", CommentController.create);
CommentRouter.put("/:comment_id", CommentController.update);
CommentRouter.delete("/:comment_id", CommentController.delete);

// lấy comment theo task
CommentRouter.get("/task/:task_id", CommentController.listByTask);

// lịch sử chỉnh sửa 1 comment
CommentRouter.get("/:comment_id/history", CommentController.history);

export default CommentRouter;
