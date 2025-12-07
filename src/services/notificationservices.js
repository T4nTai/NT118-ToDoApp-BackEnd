import { Notification } from "../models/notification.model.js";

export class NotificationService {
  // Tạo thông báo
  static async createNotification(data) {
    return await Notification.create({
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      context_type: data.context_type || null,
      context_id: data.context_id || null,
    });
  }

  // Lấy tất cả thông báo user
  static async getNotifications(user_id) {
    return await Notification.findAll({
      where: { user_id, is_deleted: false },
      order: [["created_at", "DESC"]],
    });
  }

  // Đánh dấu đã đọc
  static async markAsRead(notification_id, user_id) {
    const notif = await Notification.findOne({
      where: { notification_id, user_id },
    });

    if (!notif) throw { status: 404, message: "Không tìm thấy thông báo" };

    notif.is_read = true;
    await notif.save();
    return notif;
  }

  // Đánh dấu tất cả đã đọc
  static async markAllAsRead(user_id) {
    await Notification.update({ is_read: true }, { where: { user_id } });
    return { message: "Đã đánh dấu tất cả là đã đọc" };
  }

  // Xóa mềm thông báo
  static async deleteNotification(notification_id, user_id) {
    const notif = await Notification.findOne({
      where: { notification_id, user_id },
    });

    if (!notif) throw { status: 404, message: "Không tìm thấy notification" };

    notif.is_deleted = true;
    await notif.save();

    return { message: "Đã xóa thông báo" };
  }
}
