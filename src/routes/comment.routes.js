import { authenticateJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import { createComment, getCommentsByTask, updateComment, deleteComment, getCommentHistory } from "../controllers/comment.controller.js";

const CommentRouter = Router();

CommentRouter.post("/:task_id/create", authenticateJWT, createComment );

CommentRouter.get("/tasks/:task_id", authenticateJWT, getCommentsByTask );

CommentRouter.put("/:comment_id", authenticateJWT, updateComment );

CommentRouter.delete("/:comment_id", authenticateJWT, deleteComment );

CommentRouter.get("/comments/:comment_id/history", authenticateJWT, getCommentHistory );

export default CommentRouter;