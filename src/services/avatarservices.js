import cloudinary from "../config/cloudinary.js";
import { User } from "../models/auth.model.js";

export async function updateAvatarService(userId, imageBase64) {
  if (!imageBase64) {
    throw { status: 400, message: "Không có ảnh để upload" };
  }

  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };

  if (user.avatar_public_id) {
    try {
      await cloudinary.uploader.destroy(user.avatar_public_id);
    } catch (err) {
      console.log("Không thể xóa avatar cũ:", err);
    }
  }

  const upload = await cloudinary.uploader.upload(imageBase64, {
    folder: "todoapp/avatar",
  });

  user.avatar_url = upload.secure_url;
  user.avatar_public_id = upload.public_id;
  await user.save();

  return {
    message: "Cập nhật avatar thành công",
    avatar_url: upload.secure_url,
  };
}


export async function deleteAvatarService(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };

  if (user.avatar_public_id) {
    try {
      await cloudinary.uploader.destroy(user.avatar_public_id);
    } catch (err) {
      console.log("Lỗi xoá avatar:", err);
    }
  }

  user.avatar_url = null;
  user.avatar_public_id = null;
  await user.save();

  return { message: "Đã xoá avatar và đặt về mặc định" };
}

export async function getAvatarService(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };

  return {
    avatar_url: user.avatar_url,
  };
}
