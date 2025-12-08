import { Notification } from "../models/notification.model.js";
import { io } from "../socket.js";

export class NotificationService {

  static async createNotification(data) {

    if (!data.user_id || !data.message || !data.type) {
      throw { status: 400, message: "Thiếu user_id, type hoặc message" };
    }

    const notif = await Notification.create({
      user_id: data.user_id,
      type: data.type,
      title: data.title || "",
      message: data.message,
      context_type: data.context_type || null,
      context_id: data.context_id || null,
    });

    io.to(`user_${data.user_id}`).emit("notification", notif);

    return notif;
  }

  static async getNotifications(user_id) {
    return await Notification.findAll({
      where: { user_id, is_deleted: false },
      order: [["created_at", "DESC"]],
    });
  }

  static async markAsRead(notification_id, user_id) {
    const notif = await Notification.findOne({
      where: { notification_id, user_id },
    });

    if (!notif)
      throw { status: 404, message: "Không tìm thấy thông báo" };

    if (notif.is_read) return notif;

    notif.is_read = true;
    await notif.save();
    return notif;
  }

  static async markAllAsRead(user_id) {
    const [updatedCount] = await Notification.update(
      { is_read: true },
      { where: { user_id, is_deleted: false } }
    );

    return { message: "Đã đánh dấu tất cả", updated: updatedCount };
  }

  static async deleteNotification(notification_id, user_id) {
    const notif = await Notification.findOne({
      where: { notification_id, user_id },
    });

    if (!notif)
      throw { status: 404, message: "Không tìm thấy notification" };

    if (notif.is_deleted)
      return { message: "Notification đã xoá rồi" };

    notif.is_deleted = true;
    await notif.save();

    return { message: "Đã xoá notification" };
  }
}
