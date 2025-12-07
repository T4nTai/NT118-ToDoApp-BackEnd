import { NotificationService } from "../services/notificationservices.js";
import { io } from "../socket.js";

export const NotificationHook = {
  async workspaceMemberAdded(user_id, workspace) {
    const notif = await NotificationService.createNotification({
      user_id,
      type: "workspace_invite",
      title: "Bạn được thêm vào Workspace",
      message: `Bạn đã được thêm vào workspace "${workspace.name}"`,
      context_type: "workspace",
      context_id: workspace.workspace_id,
    });

    io.to(`user_${user_id}`).emit("notification", notif);
    return notif;
  },

  async taskAssigned(task, assigned_to) {
    const notif = await NotificationService.createNotification({
      user_id: assigned_to,
      type: "task_assigned",
      title: "Task mới được giao",
      message: `Task "${task.title}" vừa được giao cho bạn`,
      context_type: "task",
      context_id: task.task_id,
    });

    io.to(`user_${assigned_to}`).emit("notification", notif);
    return notif;
  },

  async taskCommented(task, commenter, content) {
    const notif = await NotificationService.createNotification({
      user_id: task.assigned_to,
      type: "task_comment",
      title: `Comment mới trong task ${task.title}`,
      message: `${commenter.username}: ${content}`,
      context_type: "task",
      context_id: task.task_id,
    });

    io.to(`user_${task.assigned_to}`).emit("notification", notif);
    return notif;
  },
};
