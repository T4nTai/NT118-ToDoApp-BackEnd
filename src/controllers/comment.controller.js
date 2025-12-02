import { createCommentService, getCommentsByTaskService, updateCommentService, deleteCommentService, getCommentHistoryService } from "../services/commentservices.js";

export async function createComment(req, res, next) {
  try {
    const { task_id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id;

    const newComment = await createCommentService({
      task_id,
      user_id,
      content
    });

    return res.status(201).json({
      message: "Tạo comment thành công",
      comment: newComment
    });

  } catch (err) {
    if (err?.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}


export async function getCommentsByTask(req, res, next) {
  try {
    const { task_id } = req.params;

    const comments = await getCommentsByTaskService(task_id);

    return res.status(200).json({ comments });

  } catch (err) {
    if (err?.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function updateComment(req, res, next) {
  try {
    const { comment_id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id;

    const updated = await updateCommentService(comment_id, user_id, content);

    return res.status(200).json({
      message: "Cập nhật comment thành công",
      comment: updated
    });

  } catch (err) {
    if (err?.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { comment_id } = req.params;
    const user_id = req.user.id;

    const result = await deleteCommentService(comment_id, user_id);

    return res.status(200).json(result);

  } catch (err) {
    if (err?.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function getCommentHistory(req, res, next) {
  try {
    const { comment_id } = req.params;

    const history = await getCommentHistoryService(comment_id);

    return res.status(200).json({ history });

  } catch (err) {
    if (err?.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}
