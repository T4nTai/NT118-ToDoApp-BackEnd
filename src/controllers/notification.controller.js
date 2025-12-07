import { NotificationService } from "../services/notificationservices.js";

export class NotificationController {
  static async list(req, res) {
    try {
      const user_id = Number(req.headers["x-user-id"]);
      const data = await NotificationService.getNotifications(user_id);
      return res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async markRead(req, res) {
    try {
      const user_id = Number(req.headers["x-user-id"]);
      const { id } = req.params;
      const result = await NotificationService.markAsRead(id, user_id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async markAll(req, res) {
    try {
      const user_id = Number(req.headers["x-user-id"]);
      const result = await NotificationService.markAllAsRead(user_id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const user_id = Number(req.headers["x-user-id"]);
      const { id } = req.params;
      const result = await NotificationService.deleteNotification(id, user_id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
