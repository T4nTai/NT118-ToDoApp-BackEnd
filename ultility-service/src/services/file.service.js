import { File } from "../models/file.model.js";
import { getUserById } from "../helper/auth.helper.js";

export async function createFileRecordService({
  owner_user_id,
  provider,
  public_id,
  url,
  resource_type,
  context_type,
  context_id,
}) {
  if (!owner_user_id || !provider || !url) {
    throw {
      status: 400,
      message: "Thiếu owner_user_id, provider hoặc url",
    };
  }

  await getUserById(owner_user_id);

  const file = await File.create({
    owner_user_id,
    provider,
    public_id: public_id || null,
    url,
    resource_type: resource_type || "image",
    context_type: context_type || "other",
    context_id: context_id || null,
  });

  return file;
}

export async function getFileDetailService(file_id) {
  const file = await File.findByPk(file_id);
  if (!file) throw { status: 404, message: "File không tồn tại" };
  return file;
}

export async function getFilesOfOwnerService(owner_user_id) {
  await getUserById(owner_user_id);

  const files = await File.findAll({
    where: { owner_user_id },
    order: [["created_at", "DESC"]],
  });

  return files;
}

export async function getFilesByContextService(context_type, context_id) {
  if (!context_type || !context_id) {
    throw { status: 400, message: "Thiếu context_type hoặc context_id" };
  }

  const files = await File.findAll({
    where: { context_type, context_id },
    order: [["created_at", "DESC"]],
  });

  return files;
}

export async function deleteFileService(file_id, requester_id) {
  const file = await File.findByPk(file_id);
  if (!file) throw { status: 404, message: "File không tồn tại" };

  // chỉ cho owner xoá
  if (file.owner_user_id !== requester_id) {
    throw { status: 403, message: "Bạn không có quyền xoá file này" };
  }

  await file.destroy();

  // nếu dùng cloudinary/s3 thì ở đây mới gọi SDK để xoá thật storage
  // (vd: cloudinary.uploader.destroy(file.public_id))

  return { message: "Xoá file thành công" };
}
