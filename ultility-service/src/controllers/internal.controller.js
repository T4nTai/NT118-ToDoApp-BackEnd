// src/controllers/internal.controller.js
import {
  createFileRecordService,
  getFileDetailService,
  getFilesByContextService,
} from "../services/file.service.js";

export class FileInternalController {
  static async create(req, res, next) {
    try {
      const file = await createFileRecordService(req.body);
      res.status(201).json(file);
    } catch (err) {
      next(err);
    }
  }
  static async detail(req, res, next) {
    try {
      const { file_id } = req.params;
      const file = await getFileDetailService(file_id);
      res.json(file);
    } catch (err) {
      next(err);
    }
  }
  static async byContext(req, res, next) {
    try {
      const { context_type, context_id } = req.query;
      const files = await getFilesByContextService(context_type, context_id);
      res.json({ files });
    } catch (err) {
      next(err);
    }
  }
}
