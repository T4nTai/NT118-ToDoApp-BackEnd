import { NotificationService } from "../services/notificationservices.js";
import { io } from "../socket.js";
import { User } from "../models/auth.model.js";


function emitToUser(user_id, notif) {
    io.to(`user_${user_id}`).emit("notification", notif);
}


function emitToUsers(userIds, notif) {
    userIds.forEach(id => io.to(`user_${id}`).emit("notification", notif));
}

    export const NotificationHook = {
        async workspaceCreated(workspace, owner_id) {
        const notif = await NotificationService.createNotification({
            user_id: owner_id,
            type: "workspace_created",
            title: "Workspace được tạo thành công",
            message: `Bạn đã tạo workspace "${workspace.name}".`,
            context_type: "workspace",
            context_id: workspace.workspace_id
        });
        emitToUser(owner_id, notif);
    },

    async workspaceJoined(user_id, workspace) {
        const notif = await NotificationService.createNotification({
            user_id,
            type: "workspace_joined",
            title: "Tham gia Workspace thành công",
            message: `Bạn đã tham gia workspace "${workspace.name}".`,
            context_type: "workspace",
            context_id: workspace.workspace_id
        });

        emitToUser(user_id, notif);
    },

    async workspaceRoleUpdated({ target_user_id, workspace_id, newRole }) {
        const notif = await NotificationService.createNotification({
            user_id: target_user_id,
            type: "workspace_role_updated",
            title: "Quyền hạn trong Workspace thay đổi",
            message: `Role của bạn trong workspace đã được đổi thành "${newRole}".`,
            context_type: "workspace",
            context_id: workspace_id
        });

        emitToUser(target_user_id, notif);
    },

    async workspaceMemberLeft({ target_user_id, workspace_id }) {
        const notif = await NotificationService.createNotification({
            user_id: target_user_id,
            type: "workspace_left",
            title: "Bạn đã rời Workspace",
            message: `Bạn đã rời workspace có ID: ${workspace_id}.`,
            context_type: "workspace",
            context_id: workspace_id
        });

        emitToUser(target_user_id, notif);
    },

    async workspaceDeleted(workspace_id, userIds) {
        const notif = await NotificationService.createNotification({
            user_id: null,  // gửi cho nhiều người → không gắn cụ thể
            type: "workspace_deleted",
            title: "Workspace đã bị xóa",
            message: `Workspace (ID: ${workspace_id}) đã bị xóa.`,
            context_type: "workspace",
            context_id: workspace_id
        });

        emitToUsers(userIds, notif);
    },
    // ============================================================
    // 🟦 GROUP EVENTS
    // ============================================================

    async groupMemberAdded(user, group) {
        const notif = await NotificationService.createNotification({
            user_id: user.user_id,
            type: "group_invite",
            title: "Bạn được thêm vào Group",
            message: `Bạn vừa được thêm vào group "${group.name}"`,
            context_type: "group",
            context_id: group.group_id
        });
        emitToUser(user.user_id, notif);
    },

    async groupMemberRemoved(user, group) {
        const notif = await NotificationService.createNotification({
            user_id: user.user_id,
            type: "group_removed",
            title: "Bạn đã bị xóa khỏi Group",
            message: `Bạn đã bị xóa khỏi group "${group.name}"`,
            context_type: "group",
            context_id: group.group_id
        });
        emitToUser(user.user_id, notif);
    },

    // ============================================================
    // 🟦 PROJECT EVENTS
    // ============================================================

    async projectAssignedToUser(project, user) {
        const notif = await NotificationService.createNotification({
            user_id: user.user_id,
            type: "project_assigned",
            title: "Bạn được giao một Project",
            message: `Bạn đã được giao project "${project.name}"`,
            context_type: "project",
            context_id: project.project_id
        });
        emitToUser(user.user_id, notif);
    },

    async projectAssignedToGroup(project, groupMembers) {
        for (const member of groupMembers) {
            const notif = await NotificationService.createNotification({
                user_id: member.user_id,
                type: "project_assigned",
                title: "Group được giao Project",
                message: `Nhóm bạn thuộc về đã được giao project "${project.name}"`,
                context_type: "project",
                context_id: project.project_id
            });
            emitToUser(member.user_id, notif);
        }
    },

    async projectCompleted(project, admins) {
        for (const admin of admins) {
            const notif = await NotificationService.createNotification({
                user_id: admin.user_id,
                type: "project_completed",
                title: "Project hoàn thành",
                message: `Project "${project.name}" đã được hoàn thành.`,
                context_type: "project",
                context_id: project.project_id
            });
            emitToUser(admin.user_id, notif);
        }
    },

    async projectUpdated(project, admins) {
        for (const admin of admins) {
            const notif = await NotificationService.createNotification({
                user_id: admin.user_id,
                type: "project_updated",
                title: "Project được cập nhật",
                message: `Project "${project.name}" vừa được cập nhật.`,
                context_type: "project",
                context_id: project.project_id
            });
            emitToUser(admin.user_id, notif);
        }
    },

    // ============================================================
    // 🟦 TASK EVENTS
    // ============================================================

    async taskAssigned(task, user) {
        const notif = await NotificationService.createNotification({
            user_id: user.user_id,
            type: "task_assigned",
            title: "Task mới được giao",
            message: `Bạn vừa được giao task "${task.title}"`,
            context_type: "task",
            context_id: task.task_id
        });
        emitToUser(user.user_id, notif);
    },

    async taskCreatedByUser(task, creatorUser, admins) {
        for (const admin of admins) {
            const notif = await NotificationService.createNotification({
                user_id: admin.user_id,
                type: "task_created",
                title: "Task mới được tạo",
                message: `User "${creatorUser.username}" vừa tạo task "${task.title}"`,
                context_type: "task",
                context_id: task.task_id
            });
            emitToUser(admin.user_id, notif);
        }
    },

    async taskUpdatedStatus(task, newStatus, admins) {
        for (const admin of admins) {
            const notif = await NotificationService.createNotification({
                user_id: admin.user_id,
                type: "task_status_changed",
                title: "Task cập nhật trạng thái",
                message: `Task "${task.title}" vừa đổi trạng thái thành "${newStatus}"`,
                context_type: "task",
                context_id: task.task_id
            });
            emitToUser(admin.user_id, notif);
        }
    },

    async taskCompleted(task, user, admins) {
        for (const admin of admins) {
            const notif = await NotificationService.createNotification({
                user_id: admin.user_id,
                type: "task_completed",
                title: "Task hoàn thành",
                message: `User "${user.username}" đã hoàn thành task "${task.title}"`,
                context_type: "task",
                context_id: task.task_id
            });
            emitToUser(admin.user_id, notif);
        }
    },

    async taskDeleted(task, admins) {
        for (const admin of admins) {
            const notif = await NotificationService.createNotification({
                user_id: admin.user_id,
                type: "task_deleted",
                title: "Task đã bị xóa",
                message: `Task "${task.title}" đã bị xóa.`,
                context_type: "task",
                context_id: task.task_id
            });
            emitToUser(admin.user_id, notif);
        }
    },

    async taskCommented(task, commenter, assignedUser) {
        const notif = await NotificationService.createNotification({
            user_id: assignedUser.user_id,
            type: "task_comment",
            title: "Bình luận mới trên Task",
            message: `${commenter.username} đã bình luận vào task "${task.title}"`,
            context_type: "task",
            context_id: task.task_id
        });
        emitToUser(assignedUser.user_id, notif);
    },

    // ============================================================
    // 🟦 MILESTONE EVENTS
    // ============================================================

    async milestoneCompleted(milestone, user, admins) {
        for (const admin of admins) {
            const notif = await NotificationService.createNotification({
                user_id: admin.user_id,
                type: "milestone_completed",
                title: "Milestone hoàn thành",
                message: `User "${user.username}" hoàn thành milestone "${milestone.name}"`,
                context_type: "milestone",
                context_id: milestone.milestone_id
            });
            emitToUser(admin.user_id, notif);
        }
    },

    async milestoneDueSoon(milestone, users) {
        for (const u of users) {
            const notif = await NotificationService.createNotification({
                user_id: u.user_id,
                type: "milestone_due_soon",
                title: "Milestone sắp đến hạn",
                message: `Milestone "${milestone.name}" sẽ đến hạn vào ${milestone.due_date}`,
                context_type: "milestone",
                context_id: milestone.milestone_id
            });
            emitToUser(u.user_id, notif);
        }
    },

    // ============================================================
    // 🟦 PERFORMANCE EVENTS
    // ============================================================

    async performanceRatedUser(user, score, comment) {
        const notif = await NotificationService.createNotification({
            user_id: user.user_id,
            type: "performance_review",
            title: "Bạn được đánh giá hiệu suất",
            message: `Bạn được chấm điểm: ${score}. ${comment || ""}`,
            context_type: "performance",
            context_id: null
        });
        emitToUser(user.user_id, notif);
    },

    async performanceRatedGroup(groupMembers, score) {
        for (const u of groupMembers) {
            const notif = await NotificationService.createNotification({
                user_id: u.user_id,
                type: "performance_review",
                title: "Nhóm của bạn được đánh giá",
                message: `Group của bạn được chấm điểm: ${score}`,
                context_type: "performance",
                context_id: null
            });
            emitToUser(u.user_id, notif);
        }
    }
};
