import {
  createFileRecordService,
  getFileDetailService,
  getFilesOfOwnerService,
  getFilesByContextService,
  deleteFileService,
} from "../services/file.service.js";
import { cloudinary } from "../utils/cloudinary.js";

export class FileController {
  static async createRecord(req, res) {
    try {
      const owner_user_id = req.user.id;
      const {
        provider,
        public_id,
        url,
        resource_type,
        context_type,
        context_id,
      } = req.body;

      const file = await createFileRecordService({
        owner_user_id,
        provider,
        public_id,
        url,
        resource_type,
        context_type,
        context_id,
      });

      res.status(201).json(file);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async uploadAndCreate(req, res) {
    try {
      const owner_user_id = req.user.id;
      const { context_type, context_id } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Thiếu file upload" });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "todoapp",
      });

      const file = await createFileRecordService({
        owner_user_id,
        provider: "cloudinary",
        public_id: result.public_id,
        url: result.secure_url,
        resource_type: result.resource_type === "image" ? "image" : "file",
        context_type: context_type || "other",
        context_id: context_id || null,
      });

      res.status(201).json(file);
    } catch (err) {
      console.error(err);
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async me(req, res) {
    try {
      const owner_user_id = req.user.id;
      const files = await getFilesOfOwnerService(owner_user_id);
      res.status(200).json({ files });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async byContext(req, res) {
    try {
      const { context_type, context_id } = req.query;
      const files = await getFilesByContextService(context_type, context_id);
      res.status(200).json({ files });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async detail(req, res) {
    try {
      const { file_id } = req.params;
      const file = await getFileDetailService(file_id);
      res.status(200).json(file);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const requester_id = req.user.id;
      const { file_id } = req.params;

      const result = await deleteFileService(file_id, requester_id);
      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
