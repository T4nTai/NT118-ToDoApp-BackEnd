import { Comment } from "../models/comment.model.js";
import { CommentHistory } from "../models/comment_history.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/auth.model.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/project_member.model.js";
import { GroupMember } from "../models/group_member.model.js";

export async function createCommentService({ task_id, user_id, content }) {
    if (!task_id || !user_id || !content) {
        throw { status: 400, message: "Thiếu dữ liệu: task_id, user_id hoặc content" };
    }
    const task = await Task.findByPk(task_id);
    if (!task) throw { status: 404, message: "Task không tồn tại" };
    if (task.project_id) {
        const project = await Project.findByPk(task.project_id);

        const isMember =
            await ProjectMember.findOne({ where: { project_id: project.project_id, user_id } }) ||
            (project.assigned_group_id &&
                await GroupMember.findOne({
                    where: {
                        group_id: project.assigned_group_id,
                        user_id
                    }
                })
            );

        if (!isMember) {
            throw { status: 403, message: "Bạn không có quyền comment trong task này" };
        }
    }

    const comment = await Comment.create({
        task_id,
        user_id,
        content
    });

    return comment;
}

export async function getCommentsByTaskService(task_id) {
    if (!task_id) throw { status: 400, message: "Thiếu task_id" };

    return Comment.findAll({
        where: { task_id },
        include: [
            { model: User, as: "author", attributes: ["user_id", "username", "email"] },
            {
                model: CommentHistory,
                as: "history",
                include: [{ model: User, as: "editor", attributes: ["user_id", "username"] }]
            }
        ],
        order: [["created_at", "ASC"]]
    });
}

export async function updateCommentService(comment_id, user_id, newContent) {
    if (!comment_id || !newContent) {
        throw { status: 400, message: "Thiếu comment_id hoặc content" };
    }

    const comment = await Comment.findByPk(comment_id);
    if (!comment) throw { status: 404, message: "Comment không tồn tại" };
    if (comment.user_id !== user_id) {
        throw { status: 403, message: "Bạn không có quyền chỉnh sửa comment này" };
    }
    await CommentHistory.create({
        comment_id,
        edited_by_user_id: user_id,
        old_content: comment.content
    });

    comment.content = newContent;
    comment.is_edited = true;

    await comment.save();

    return comment;
}

export async function deleteCommentService(comment_id, user_id) {
    const comment = await Comment.findByPk(comment_id);

    if (!comment) throw { status: 404, message: "Comment không tồn tại" };
    if (comment.user_id !== user_id) {
        throw { status: 403, message: "Bạn không có quyền xóa comment này" };
    }

    await comment.destroy();

    return { message: "Xóa comment thành công", comment_id };
}

export async function getCommentHistoryService(comment_id) {
    const comment = await Comment.findByPk(comment_id);

    if (!comment) throw { status: 404, message: "Comment không tồn tại" };

    return CommentHistory.findAll({
        where: { comment_id },
        include: [
            { model: User, as: "editor", attributes: ["user_id", "username"] }
        ],
        order: [["edited_at", "DESC"]]
    });
}
