import { File } from "../models/file.model.js";
import { cloudinary } from "../utils/cloudinary.js";
import { createFileRecordService } from "../services/file.service.js";

export class AvatarController {
  static async updateAvatar(req, res) {
    try {
      const user_id = req.user.id;

      if (!req.file) {
        return res.status(400).json({ message: "Thiếu file avatar" });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "todoapp/avatar",
      });

      await File.destroy({
        where: {
          owner_user_id: user_id,
          context_type: "avatar",
          context_id: user_id,
        },
      });

      const file = await createFileRecordService({
        owner_user_id: user_id,
        provider: "cloudinary",
        public_id: result.public_id,
        url: result.secure_url,
        resource_type: "image",
        context_type: "avatar",
        context_id: user_id,
      });

      res.status(201).json({
        message: "Cập nhật avatar thành công",
        file,
      });
    } catch (err) {
      console.error(err);
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async deleteAvatar(req, res) {
    try {
      const user_id = req.user.id;
      const avatar = await File.findOne({
        where: {
          owner_user_id: user_id,
          context_type: "avatar",
          context_id: user_id,
        },
        order: [["created_at", "DESC"]],
      });

      if (!avatar) {
        return res.status(404).json({ message: "Không có avatar để xoá" });
      }

      if (avatar.provider === "cloudinary" && avatar.public_id) {
        try {
          await cloudinary.uploader.destroy(avatar.public_id);
        } catch (e) {
          console.error("Cloudinary delete error:", e.message);
        }
      }
      await avatar.destroy();
      res.json({ message: "Xoá avatar thành công" });
    } catch (err) {
      console.error(err);
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
