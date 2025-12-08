import { Router } from "express";
import multer from "multer";
import { authenticateFromGateway } from "../middleware/auth.gateway.middleware.js";
import { FileController } from "../controllers/file.controller.js";
import { AvatarController } from "../controllers/avatar.controller.js";

const FileRouter = Router();
const upload = multer({ dest: "uploads/" });

FileRouter.use(authenticateFromGateway);


FileRouter.post("/", FileController.createRecord);


FileRouter.post("/upload", upload.single("file"), FileController.uploadAndCreate);


FileRouter.get("/me", FileController.me);


FileRouter.get("/context", FileController.byContext);


FileRouter.get("/:file_id", FileController.detail);


FileRouter.delete("/:file_id", FileController.delete);

FileRouter.put("/avatar", upload.single("file"), AvatarController.updateAvatar);


FileRouter.delete("/avatar", AvatarController.deleteAvatar);

export default FileRouter;
