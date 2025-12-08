// src/services/comment.service.js
import { Comment, CommentHistory } from "../models/index.js";
import { Task } from "../models/index.js";
import { getUserById } from "../helper/auth.helper.js";
import { ensureProjectExists, getProjectMembers } from "../helper/project.helper.js";

export async function createCommentService({ task_id, user_id, content }) {
  if (!task_id || !user_id || !content) {
    throw {
      status: 400,
      message: "Thiếu dữ liệu: task_id, user_id hoặc content",
    };
  }

  const task = await Task.findByPk(task_id);
  if (!task) throw { status: 404, message: "Task không tồn tại" };

  await getUserById(user_id);

  // nếu task thuộc project thì check user là member
  if (task.project_id) {
    await ensureProjectExists(task.project_id);
    const members = await getProjectMembers(task.project_id);
    const found = members.find((m) => m.user_id === Number(user_id));
    if (!found) {
      throw {
        status: 403,
        message: "User không thuộc project nên không được comment",
      };
    }
  }

  const comment = await Comment.create({
    task_id,
    user_id,
    content,
  });

  return comment;
}

export async function updateCommentService(comment_id, user_id, content) {
  if (!content) {
    throw { status: 400, message: "Nội dung comment không được để trống" };
  }

  const comment = await Comment.findByPk(comment_id);
  if (!comment) throw { status: 404, message: "Comment không tồn tại" };

  if (comment.user_id !== user_id) {
    throw { status: 403, message: "Bạn không có quyền sửa comment này" };
  }

  await CommentHistory.create({
    comment_id: comment.comment_id,
    edited_by_user_id: user_id,
    old_content: comment.content,
  });

  comment.content = content;
  await comment.save();

  return comment;
}

export async function deleteCommentService(comment_id, user_id) {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) throw { status: 404, message: "Comment không tồn tại" };

  if (comment.user_id !== user_id) {
    throw { status: 403, message: "Bạn không có quyền xoá comment này" };
  }

  await comment.destroy();

  return { message: "Xóa comment thành công", deleted_comment_id: comment_id };
}

export async function getCommentsByTaskService(task_id) {
  const task = await Task.findByPk(task_id);
  if (!task) throw { status: 404, message: "Task không tồn tại" };

  const comments = await Comment.findAll({
    where: { task_id },
    order: [["created_at", "ASC"]],
  });

  return comments;
}

export async function getCommentHistoryService(comment_id) {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) throw { status: 404, message: "Comment không tồn tại" };

  const history = await CommentHistory.findAll({
    where: { comment_id },
    order: [["edited_at", "DESC"]],
  });

  return history;
}
